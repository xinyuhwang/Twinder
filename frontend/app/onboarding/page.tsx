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
  Download,
  Upload,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const STEPS = [
  'Download the prompt below',
  'Paste it into ChatGPT, Claude, or Gemini',
  'Answer its questions — briefly or in detail',
  'Copy or download the YAML it outputs',
  'Upload the file or paste the YAML here',
];

export default function OnboardingIntake() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [context, setContext] = useState(() =>
    typeof window !== 'undefined' ? (localStore.getRawContext() ?? '') : '',
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [promptExpanded, setPromptExpanded] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  const [ready] = useState(
    () => typeof window !== 'undefined' && Boolean(localStore.getToken()),
  );

  useEffect(() => {
    if (!localStore.getToken()) {
      router.replace('/demo');
    }
  }, [router]);

  if (!ready) return null;

  function loadFile(file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      setContext(text);
      setUploadedFileName(file.name);
    };
    reader.readAsText(file);
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

  function proceedToQuestions(withContext: boolean) {
    if (withContext) {
      localStore.setRawContext(context.trim());
      localStore.setSkippedIntake(false);
    } else {
      localStore.clearRawContext();
      localStore.setSkippedIntake(true);
    }
    router.push('/onboarding/questions');
  }

  const hasContent = context.trim().length > 0;

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen px-6 py-10 gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Build your twin</h1>
          <p className="text-zinc-500 text-sm">
            Give your agent something to work with. It builds a hidden profile — your raw text is never shown to matches.
          </p>
        </div>

        {/* Prompt-driven path */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          <button
            onClick={() => setPromptExpanded(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-violet-300">1</span>
              </div>
              <span className="text-sm font-semibold text-white">
                Use the Twinder prompt
                <span className="ml-2 text-xs font-normal text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </span>
            </div>
            {promptExpanded
              ? <ChevronUp className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              : <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />}
          </button>

          {promptExpanded && (
            <div className="px-4 pb-4 space-y-4 border-t border-zinc-800">
              <ol className="pt-3 space-y-2">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                    <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-500 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>

              <a
                href="/twinder-intake-prompt.md"
                download="twinder-intake-prompt.md"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download prompt
              </a>

              {/* File upload dropzone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
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
                  accept=".yaml,.yml,.md,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {uploadedFileName ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <p className="text-sm font-medium text-emerald-300">{uploadedFileName}</p>
                    <p className="text-xs text-zinc-500">Tap to replace</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-zinc-500" />
                    <p className="text-sm text-zinc-400">Upload YAML file</p>
                    <p className="text-xs text-zinc-600">.yaml .yml .md .txt</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-zinc-600 text-xs">
          <div className="flex-1 h-px bg-zinc-800" />
          or paste directly
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Direct paste path */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-zinc-800">
            <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-zinc-400">2</span>
            </div>
            <span className="text-sm font-semibold text-white">Paste any context</span>
          </div>
          <div className="p-3 space-y-2">
            <textarea
              id="context"
              value={context}
              onChange={e => {
                setContext(e.target.value);
                if (uploadedFileName) setUploadedFileName(null);
              }}
              placeholder="LinkedIn summary, resume, personal bio, YAML from the prompt, or freeform notes..."
              rows={6}
              className="w-full px-4 py-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none text-sm"
            />
          </div>
        </div>

        {/* Privacy note */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 leading-relaxed">
            Your raw text is never shown to matches. Only a safe, human-readable twin summary appears in the app.
          </p>
        </div>

        <Link
          href="/integrations"
          className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors -mt-2"
        >
          <Link2 className="w-4 h-4" />
          Connect integrations (coming soon)
        </Link>

        {/* CTAs */}
        <div className="space-y-3">
          <button
            onClick={() => proceedToQuestions(true)}
            disabled={!hasContent}
            className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
          >
            Build my twin
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => proceedToQuestions(false)}
            className="w-full py-3.5 rounded-2xl bg-zinc-900 text-zinc-300 text-sm font-medium hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            Skip this — ask me questions instead
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
