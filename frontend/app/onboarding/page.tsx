'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MobileShell } from '@/components/MobileShell';
import { localStore } from '@/lib/local-store';
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
} from 'lucide-react';

const STEPS = [
  'Download the prompt below',
  'Paste it into ChatGPT, Claude, or Gemini',
  'Answer its questions — briefly or in detail',
  'Copy or download the YAML it outputs',
  'Upload the file or paste the YAML here',
];

type OnboardingPath = 'choose' | 'import';

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
  const [path, setPath] = useState<OnboardingPath>('choose');
  const [links, setLinks] = useState('');
  const [paste, setPaste] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileNote, setFileNote] = useState<string | null>(null);
  const [promptExpanded, setPromptExpanded] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!localStore.getToken()) {
      router.replace('/demo');
      return;
    }
    setPaste(localStore.getRawContext() ?? '');
    setMounted(true);
  }, [router]);

  if (!mounted) {
    return (
      <MobileShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
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
    localStore.setSkippedIntake(true);
    router.push('/onboarding/questions');
  }

  function proceedWithImport() {
    const raw = buildRawContext(links, paste, fileNote);
    localStore.setRawContext(raw);
    localStore.setSkippedIntake(false);
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
            <h1 className="text-2xl font-bold text-white">Build your twin</h1>
            <p className="text-sm text-zinc-500">
              Choose how you want to give your agent context. Both paths end with a quick preview before the arena.
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <button
              onClick={() => setPath('import')}
              className="flex w-full items-start gap-4 rounded-2xl border border-violet-500/40 bg-violet-500/10 p-5 text-left transition-colors hover:border-violet-500/60"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-500/20">
                <FileUp className="h-5 w-5 text-violet-300" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-white">Import data</span>
                  <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300">
                    Recommended
                  </span>
                </div>
                <p className="text-sm text-zinc-400">
                  Drop your resume, YAML, or files. Paste links to your site, LinkedIn, or GitHub.
                </p>
              </div>
            </button>

            <button
              onClick={chooseQuestions}
              className="flex w-full items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-left transition-colors hover:border-zinc-700"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-800">
                <MessageSquare className="h-5 w-5 text-zinc-400" />
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-white">Answer questions</span>
                <p className="text-sm text-zinc-400">
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
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to options
        </button>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Import your data</h1>
          <p className="text-sm text-zinc-500">
            Drop a resume, YAML, or any file. Paste links to your site, LinkedIn, or GitHub. No scraping — we pass URLs as context.
          </p>
        </div>

        {/* Prompt accordion */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <button
            onClick={() => setPromptExpanded(v => !v)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left"
          >
            <span className="text-sm font-semibold text-white">Use the Twinder prompt</span>
            {promptExpanded
              ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-zinc-500" />
              : <ChevronDown className="h-4 w-4 flex-shrink-0 text-zinc-500" />}
          </button>

          {promptExpanded && (
            <div className="space-y-4 border-t border-zinc-800 px-4 pb-4">
              <ol className="space-y-2 pt-3">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-500">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <a
                href="/twinder-intake-prompt.md"
                download="twinder-intake-prompt.md"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
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
              ? 'border-violet-500 bg-violet-500/10'
              : uploadedFileName
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-zinc-700 bg-zinc-950/50 hover:border-zinc-600'
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
              <CheckCircle className="h-7 w-7 text-emerald-400" />
              <p className="text-sm font-medium text-emerald-300">{uploadedFileName}</p>
              <p className="text-xs text-zinc-500">Tap to replace</p>
            </>
          ) : (
            <>
              <Upload className="h-7 w-7 text-zinc-500" />
              <p className="text-sm text-zinc-400">Drop resume, YAML, or any file</p>
              <p className="text-xs text-zinc-600">.yaml .yml .md .txt .pdf .docx</p>
            </>
          )}
        </div>

        {/* Links */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 px-4 py-3.5">
            <span className="text-sm font-semibold text-white">Profile links</span>
          </div>
          <div className="p-3">
            <textarea
              value={links}
              onChange={e => setLinks(e.target.value)}
              placeholder={'https://yoursite.com\nhttps://linkedin.com/in/you\nhttps://github.com/you'}
              rows={3}
              className="w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Freeform paste */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 px-4 py-3.5">
            <span className="text-sm font-semibold text-white">Or paste context</span>
          </div>
          <div className="p-3">
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
              className="w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3">
          <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
          <p className="text-xs leading-relaxed text-zinc-400">
            Your raw text is never shown to matches. Only a safe, human-readable twin summary appears in the app.
          </p>
        </div>

        <Link
          href="/integrations"
          className="-mt-2 inline-flex items-center gap-2 text-sm text-violet-400 transition-colors hover:text-violet-300"
        >
          <Link2 className="h-4 w-4" />
          Connect integrations (coming soon)
        </Link>

        <button
          onClick={chooseQuestions}
          className="text-center text-sm text-zinc-500 transition-colors hover:text-violet-400"
        >
          Skip to questions
        </button>

        <button
          onClick={proceedWithImport}
          disabled={!hasContent}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-40"
        >
          Build my twin
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </MobileShell>
  );
}
