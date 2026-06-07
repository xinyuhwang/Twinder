'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/MobileShell';
import { AgentPreviewCard } from '@/components/AgentPreviewCard';
import { localStore } from '@/lib/local-store';
import { api } from '@/lib/api';
import { DEMO_PERSONAS } from '@/lib/personas';
import {
  buildPreviewFromPersona,
  buildPreviewFromTwinPreview,
  type AgentPreviewDisplay,
} from '@/lib/preview';
import type { TwinPreview } from '@/types';

type SaveMode = 'overwrite' | 'new_version';

async function submitDatInBackground(token: string, datWordsCsv: string) {
  const words = datWordsCsv
    .split(',')
    .map(w => w.trim())
    .filter(Boolean);
  if (words.length < 2) return;
  try {
    await api.dat(token, words);
  } catch {
    // Silent -- scoring is a best-effort signal, not blocking.
  }
}

async function syncPersonaIfEmpty(token: string, personaText: string) {
  const trimmed = personaText.trim();
  if (!trimmed) return;
  try {
    const me = await api.getMe(token);
    if (me.persona?.trim()) return;
    await api.updateMe(token, { persona: trimmed });
  } catch {
    // Non-blocking — arena still works if this fails.
  }
}

export default function OnboardingPreview() {
  const router = useRouter();
  const [preview, setPreview] = useState<AgentPreviewDisplay | null>(null);
  const [twinPrompt, setTwinPrompt] = useState<string | null>(null);
  const [editedPrompt, setEditedPrompt] = useState<string>('');
  const [originalPrompt, setOriginalPrompt] = useState<string>('');
  const [saveMode, setSaveMode] = useState<SaveMode>('overwrite');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStore.getToken();
    if (!token) {
      router.replace('/demo');
      return;
    }

    const rawContext = localStore.getRawContext()?.trim() ?? '';
    const answers = localStore.getOnboardingAnswers();
    const hasAnswers = answers && Object.values(answers).some(v => v.trim());
    const hasInput = Boolean(rawContext) || Boolean(hasAnswers);
    const authMethod = localStore.getAuthMethod();
    const personaId = authMethod === 'demo' ? localStore.getPersonaId() : null;
    const persona = personaId ? (DEMO_PERSONAS.find(p => p.id === personaId) ?? null) : null;
    const userName = localStore.getUserName();
    const mode = localStore.getEventMode();

    async function loadTwinPrompt() {
      try {
        const result = await api.getTwinPrompt(token!, mode);
        setTwinPrompt(result.twin_prompt);
        return result.twin_prompt;
      } catch {
        return null;
      }
    }

    async function load() {
      try {
        // If the user chose to reuse their existing profile, load it from the DB directly.
        if (localStore.getPersonaSource() === 'existing') {
          const existing = await api.getExistingTwin(token!, mode);
          if (existing.has_profile) {
            const derived = buildPreviewFromTwinPreview(
              existing.preview ?? { public_safe_summary: null, looking_for: [], interests: [] },
              persona,
              userName,
            );
            setPreview(derived);
            const baseInstruction = existing.system_instruction ?? '';
            setTwinPrompt(baseInstruction);
            setEditedPrompt(baseInstruction);
            setOriginalPrompt(baseInstruction);
            setLoading(false);
            return;
          }
          // Profile vanished between decide and preview — fall through to normal path.
        }

        // If we already have a cached preview, restore it immediately — no rebuild needed.
        const cached = localStore.getTwinPreview();
        if (cached) {
          const derived = buildPreviewFromTwinPreview(cached, persona, userName);
          setPreview(derived);
          if (cached.twin_prompt) {
            setTwinPrompt(cached.twin_prompt);
            setEditedPrompt(cached.twin_prompt);
            setOriginalPrompt(cached.twin_prompt);
          } else {
            const prompt = await loadTwinPrompt();
            if (prompt) { setEditedPrompt(prompt); setOriginalPrompt(prompt); }
          }
          setLoading(false);
          return;
        }

        if (!hasInput) {
          // Fully skipped — no input at all. Build from persona only.
          const derived = buildPreviewFromPersona(persona ?? DEMO_PERSONAS[0], userName);
          setPreview(derived);
          await syncPersonaIfEmpty(token!, derived.summary);
          const prompt = await loadTwinPrompt();
          localStore.setTwinPreview({
            public_safe_summary: derived.summary,
            looking_for: derived.lookingFor,
            interests: derived.interests,
            twin_prompt: prompt,
          });
          setLoading(false);
          return;
        }

        if (!rawContext && hasAnswers) {
          const answerText = Object.entries(answers!)
            .filter(([, v]) => v.trim())
            .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
            .join('\n\n');
          const twin = await api.intake(token!, {
            raw_context: answerText,
            answers: answers ?? null,
            mode,
          });
          const derived = buildPreviewFromTwinPreview(twin, persona, userName);
          setPreview(derived);
          setTwinPrompt(twin.twin_prompt ?? null);
          setEditedPrompt(twin.twin_prompt ?? '');
          setOriginalPrompt(twin.twin_prompt ?? '');
          localStore.setTwinPreview(twin);
          return;
        }

        const preflightProfileYaml = localStore.getPreflightProfileYaml();
        const twin = await api.intake(token!, {
          raw_context: rawContext,
          answers: answers ?? null,
          mode,
          ...(preflightProfileYaml ? { profile_yaml: preflightProfileYaml } : {}),
        });
        const derived = buildPreviewFromTwinPreview(twin, persona, userName);
        setPreview(derived);
        setTwinPrompt(twin.twin_prompt ?? null);
        setEditedPrompt(twin.twin_prompt ?? '');
        setOriginalPrompt(twin.twin_prompt ?? '');
        localStore.setTwinPreview(twin);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not build twin preview. Is the backend running?');
        const fallback = buildPreviewFromPersona(persona ?? DEMO_PERSONAS[0], userName);
        setPreview(fallback);
        localStore.setTwinPreview({
          public_safe_summary: fallback.summary,
          looking_for: fallback.lookingFor,
          interests: fallback.interests,
        });
        await syncPersonaIfEmpty(token!, fallback.summary);
        await loadTwinPrompt();
      } finally {
        setLoading(false);
      }
    }

    load();

    if (token && answers?.dat) {
      submitDatInBackground(token, answers.dat);
    }
  }, [router]);

  async function handleApprove() {
    const token = localStore.getToken();
    if (preview && token) {
      const twin: TwinPreview = {
        public_safe_summary: preview.summary,
        looking_for: preview.lookingFor,
        interests: preview.interests,
        twin_prompt: twinPrompt,
      };
      localStore.setTwinPreview(twin);
      await syncPersonaIfEmpty(token, preview.summary);

      // Persist the edited system instruction if it changed.
      const trimmedEdit = editedPrompt.trim();
      if (trimmedEdit && trimmedEdit !== originalPrompt.trim()) {
        try {
          await api.updateSystemInstruction(
            token,
            trimmedEdit,
            saveMode === 'new_version',
          );
        } catch {
          // Non-blocking — arena still works with the existing prompt.
        }
      }
    }
    router.push('/arena');
  }

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen px-6 py-10 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">Meet your twin</h1>
          <p className="text-subtle text-sm">
            This is how your agent will represent you in the arena. No YAML, no raw files.
          </p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
            Used offline preview: {error}
          </div>
        )}

        {(loading || preview) && (
          <AgentPreviewCard
            key={preview?.agentName ?? 'loading'}
            preview={preview ?? buildPreviewFromPersona(DEMO_PERSONAS[0])}
            twinPrompt={twinPrompt}
            editedPrompt={editedPrompt}
            onPromptChange={setEditedPrompt}
            saveMode={saveMode}
            onSaveModeChange={setSaveMode}
            onPreviewChange={setPreview}
            onApprove={handleApprove}
            loading={loading}
          />
        )}
      </div>
    </MobileShell>
  );
}
