'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MobileShell } from '@/components/MobileShell';
import { localStore } from '@/lib/local-store';
import { api } from '@/lib/api';
import {
  Shield,
  Link2,
  ArrowRight,
  ArrowLeft,
  Download,
  Upload,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileUp,
  MessageSquare,
  Sparkles,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';

const STEPS = [
  'Download the prompt below',
  'Paste it into ChatGPT, Claude, or Gemini',
  'Answer its questions — briefly or in detail',
  'Copy or download the YAML it outputs',
  'Upload the file or paste the YAML here',
];

type OnboardingPath = 'loading' | 'decide' | 'choose' | 'import';

function buildRawContext(links: string, paste: string, fileNote: string | null): string {
  const parts: string[] = [];
  const trimmedLinks = links.trim();
  if (trimmedLinks) {
    parts.push(`Links:\n${trimmedLinks}`);
  }
  if (paste.trim()) {
    parts.push(paste.trim());
  }
  if (fileNote) {
    parts.push(fileNote);
  }
  return parts.join('\n\n');
}

export default function OnboardingIntake() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [path, setPath] = useState<OnboardingPath>('loading');
  const [links, setLinks] = useState('');
  const [paste, setPaste] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileNote, setFileNote] = useState<string | null>(null);
  const [promptExpanded, setPromptExpanded] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [preflight, setPreflight] = useState(false);

  useEffect(() => {
    const token = localStore.getToken();
    if (!token) {
      router.replace('/demo');
      return;
    }
    setPaste(localStore.getRawContext() ?? '');

    const mode = localStore.getEventMode();
    api.getExistingTwin(token, mode)
      .then(res => {
        if (res.has_profile) {
          setPath('decide');
        } else {
          localStore.setPersonaSource('new');
          setPath('choose');
        }
      })
      .catch(() => {
        localStore.setPersonaSource('new');
        setPath('choose');
      });

    setMounted(true);
  }, [router]);

  if (!mounted || preflight || path === 'loading') {
    return (
      <MobileShell>
        <div className="flex min-h-screen flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          {preflight && <p className="text-sm text-subtle">Building your questions…</p>}
        </div>
      </MobileShell>
    );
  }

  if (path === 'decide') {
    return (
      <MobileShell>
        <div className="flex min-h-screen flex-col gap-6 px-6 py-10">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-primary">Welcome back</h1>
            <p className="text-sm text-subtle">
              You have a saved twin. Jump straight to preview and tune it, or build a fresh one.
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <button
              onClick={() => {
                localStore.setPersonaSource('existing');
                router.push('/onboarding/preview');
              }}
              className="flex w-full items-start gap-4 rounded-2xl border border-accent/40 bg-accent/10 p-5 text-left transition-colors hover:border-accent/60"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent/20">
                <Sparkles className="h-5 w-5 text-accent-muted" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-primary">Use my existing twin</span>
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent-muted">
                    Recommended
                  </span>
                </div>
                <p className="text-sm text-muted">
                  Load your saved profile. Review and optionally tune the system prompt before the arena.
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                localStore.setPersonaSource('new');
                setPath('choose');
              }}
              className="flex w-full items-start gap-4 rounded-2xl border border-border bg-surface p-5 text-left transition-colors hover:border-border-strong"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2">
                <PlusCircle className="h-5 w-5 text-muted" />
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-primary">Create a new twin</span>
                <p className="text-sm text-muted">
                  Start from scratch — import data or answer questions to build a fresh profile.
                </p>
              </div>
            </button>
          </div>
        </div>
      </MobileShell>
    );
  }

  function loadFile(file: File) {
    const isText = /\.(yaml|yml|md|txt)$/i.test(file.name);
    if (isText) {
      const reader = new FileReader();
      reader.onload = e => {
        const text = e.target?.result as string;
        setPaste(text);
        setUploadedFileName(file.name);
        setFileNote(null);
      };
      reader.readAsText(file);
    } else {
      setUploadedFileName(file.name);
      setFileNote(`[Uploaded file: ${file.name}]`);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }

  function chooseQuestions() {
    localStore.clearRawContext();
    localStore.clearPreflightData();
    localStore.setSkippedIntake(true);
    router.push('/onboarding/questions');
  }

  async function proceedWithImport() {
    const raw = buildRawContext(links, paste, fileNote);
    localStore.setRawContext(raw);
    localStore.setSkippedIntake(false);

    const token = localStore.getToken();
    if (token) {
      setPreflight(true);
      try {
        const result = await api.preflight(token, raw);
        localStore.setPreflightQuestions(result.questions);
        localStore.setPreflightProfileYaml(result.profile_yaml);
      } catch {
        localStore.clearPreflightData();
      }
    }

    router.push('/onboarding/questions');
  }

  const hasContent = Boolean(
    links.trim() || paste.trim() || uploadedFileName || fileNote,
  );

  if (path === 'choose') {
    return (
      <MobileShell>
        <div className="flex min-h-screen flex-col gap-6 px-6 py-10">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-primary">Build your twin</h1>
            <p className="text-sm text-subtle">
              Choose how you want to give your agent context. Both paths end with a quick preview before the arena.
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <button
              onClick={() => setPath('import')}
              className="flex w-full items-start gap-4 rounded-2xl border border-accent/40 bg-accent/10 p-5 text-left transition-colors hover:border-accent/60"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent/20">
                <FileUp className="h-5 w-5 text-accent-muted" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-primary">Import data</span>
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent-muted">
                    Recommended
                  </span>
                </div>
                <p className="text-sm text-muted">
                  Drop your resume, YAML, or files. Paste links to your site, LinkedIn, or GitHub.
                </p>
              </div>
            </button>

            <button
              onClick={chooseQuestions}
              className="flex w-full items-start gap-4 rounded-2xl border border-border bg-surface p-5 text-left transition-colors hover:border-border-strong"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2">
                <MessageSquare className="h-5 w-5 text-muted" />
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-primary">Answer questions</span>
                <p className="text-sm text-muted">
                  A few quick prompts in the app instead of importing files.
                </p>
              </div>
            </button>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="flex min-h-screen flex-col gap-6 px-6 py-10">
        <button
          onClick={() => setPath('choose')}
          className="inline-flex items-center gap-1.5 text-sm text-subtle transition-colors hover:text-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to options
        </button>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">Import your data</h1>
          <p className="text-sm text-subtle">
            Drop a resume, YAML, or any file. Paste links to your site, LinkedIn, or GitHub. No scraping — we pass URLs as context.
          </p>
        </div>

        {/* Prompt accordion */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <button
            onClick={() => setPromptExpanded(v => !v)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left"
          >
            <span className="text-sm font-semibold text-primary">Use the Twinder prompt</span>
            {promptExpanded
              ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-subtle" />
              : <ChevronDown className="h-4 w-4 flex-shrink-0 text-subtle" />}
          </button>

          {promptExpanded && (
            <div className="space-y-4 border-t border-border px-4 pb-4">
              <ol className="space-y-2 pt-3">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs text-subtle">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <a
                href="/twinder-intake-prompt.md"
                download="twinder-intake-prompt.md"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-solid py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-solid-hover"
              >
                <Download className="h-4 w-4" />
                Download prompt
              </a>
            </div>
          )}
        </div>

        {/* Dropzone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 transition-all ${
            dragOver
              ? 'border-accent bg-accent/10'
              : uploadedFileName
                ? 'border-success/50 bg-success/5'
                : 'border-border-strong bg-bg/50 hover:border-border-strong'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".yaml,.yml,.md,.txt,.pdf,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
          {uploadedFileName ? (
            <>
              <CheckCircle className="h-7 w-7 text-success-fg" />
              <p className="text-sm font-medium text-success-fg">{uploadedFileName}</p>
              <p className="text-xs text-subtle">Tap to replace</p>
            </>
          ) : (
            <>
              <Upload className="h-7 w-7 text-subtle" />
              <p className="text-sm text-muted">Drop resume, YAML, or any file</p>
              <p className="text-xs text-subtle">.yaml .yml .md .txt .pdf .docx</p>
            </>
          )}
        </div>

        {/* Links */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="border-b border-border px-4 py-3.5">
            <span className="text-sm font-semibold text-primary">Profile links</span>
          </div>
          <div className="px-4 py-4">
            <textarea
              value={links}
              onChange={e => setLinks(e.target.value)}
              placeholder={'https://yoursite.com\nhttps://linkedin.com/in/you\nhttps://github.com/you'}
              rows={3}
              className="field-textarea-inset min-h-[5.5rem]"
            />
          </div>
        </div>

        {/* Freeform paste */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="border-b border-border px-4 py-3.5">
            <span className="text-sm font-semibold text-primary">Or paste context</span>
          </div>
          <div className="px-4 py-4">
            <textarea
              value={paste}
              onChange={e => {
                setPaste(e.target.value);
                if (uploadedFileName && /\.(yaml|yml|md|txt)$/i.test(uploadedFileName)) {
                  setUploadedFileName(null);
                }
              }}
              placeholder="Resume text, YAML from the prompt, bio, or freeform notes..."
              rows={5}
              className="field-textarea-inset min-h-[8.5rem]"
            />
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-success/10 bg-success/5 p-3">
          <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-success-fg" />
          <p className="text-xs leading-relaxed text-muted">
            Your raw text is never shown to matches. Only a safe, human-readable twin summary appears in the app.
          </p>
        </div>

        <Link
          href="/integrations"
          className="-mt-2 inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent-muted"
        >
          <Link2 className="h-4 w-4" />
          Connect integrations (coming soon)
        </Link>

        <button
          onClick={chooseQuestions}
          className="text-center text-sm text-subtle transition-colors hover:text-accent"
        >
          Skip to questions
        </button>

        <button
          onClick={proceedWithImport}
          disabled={!hasContent}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-solid py-4 text-lg font-semibold text-accent-fg transition-colors hover:bg-accent-solid-hover disabled:opacity-40"
        >
          Build my twin
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </MobileShell>
  );
}
