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
    const persona = DEMO_PERSONAS.find(p => p.id === localStore.getPersonaId()) ?? DEMO_PERSONAS[0];
    const userName = localStore.getUserName();

    // Fire DAT scoring in the background as soon as we have words.
    if (token && answers?.dat) {
      submitDatInBackground(token, answers.dat);
    }

    async function load() {
      try {
        // If we already have a cached preview, restore it immediately — no rebuild needed.
        const cached = localStore.getTwinPreview();
        if (cached) {
          const derived = buildPreviewFromTwinPreview(cached, persona, userName);
          setPreview(derived);
          setLoading(false);
          return;
        }

        if (!hasInput) {
          // Fully skipped — no input at all. Build from persona only.
          const derived = buildPreviewFromPersona(persona, userName);
          setPreview(derived);
          localStore.setTwinPreview({
            public_safe_summary: derived.summary,
            looking_for: derived.lookingFor,
            interests: derived.interests,
          });
          await syncPersonaIfEmpty(token!, derived.summary);
          setLoading(false);
          return;
        }

        if (!rawContext && hasAnswers) {
          // Answers only, no pasted context — await intake so the flavored
          // synthesis result is what appears (no generic flash, then swap).
          const answerText = Object.entries(answers!)
            .filter(([, v]) => v.trim())
            .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
            .join('\n\n');
          const twin = await api.intake(token!, {
            raw_context: answerText,
            answers: answers ?? null,
          });
          const derived = buildPreviewFromTwinPreview(twin, persona, userName);
          setPreview(derived);
          localStore.setTwinPreview(twin);
          return;
        }

        // Has pasted context (possibly with answers too)
        const twin = await api.intake(token!, {
          raw_context: rawContext,
          answers: answers ?? null,
        });
        const derived = buildPreviewFromTwinPreview(twin, persona, userName);
        setPreview(derived);
        localStore.setTwinPreview(twin);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not build twin preview. Is the backend running?');
        const fallback = buildPreviewFromPersona(persona, userName);
        setPreview(fallback);
        localStore.setTwinPreview({
          public_safe_summary: fallback.summary,
          looking_for: fallback.lookingFor,
          interests: fallback.interests,
        });
        await syncPersonaIfEmpty(token!, fallback.summary);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function handleApprove() {
    const token = localStore.getToken();
    if (preview && token) {
      const twin: TwinPreview = {
        public_safe_summary: preview.summary,
        looking_for: preview.lookingFor,
        interests: preview.interests,
      };
      localStore.setTwinPreview(twin);
      await syncPersonaIfEmpty(token, preview.summary);
    }
    router.push('/arena');
  }

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen px-6 py-10 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Meet your twin</h1>
          <p className="text-zinc-500 text-sm">
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
            onPreviewChange={setPreview}
            onApprove={handleApprove}
            loading={loading}
          />
        )}
      </div>
    </MobileShell>
  );
}
