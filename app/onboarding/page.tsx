'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { localStore } from '@/lib/local-store';
import { ArrowRight, SkipForward, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Onboarding() {
  const router = useRouter();
  const [context, setContext] = useState('');

  function handlePaste() {
    const answers = localStore.getOnboardingAnswers();
    localStore.setOnboardingAnswers({ ...answers, pastedContext: context });
    router.push('/onboarding/questions');
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-10 gap-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Build your twin</h1>
        <p className="text-zinc-400 text-sm">Give us context, or we&apos;ll ask you questions instead.</p>
      </div>

      {/* Paste context */}
      <div className="space-y-3">
        <label className="text-xs text-zinc-500 uppercase tracking-wider">Paste context</label>
        <textarea
          value={context}
          onChange={e => setContext(e.target.value)}
          placeholder="Paste your LinkedIn summary, bio, resume, or anything that describes you. Your agent will learn from it."
          rows={6}
          className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors resize-none text-sm leading-relaxed"
        />
        <div className="flex items-center gap-2 text-zinc-600 text-xs">
          <Lock className="w-3 h-3" />
          <span>Your raw context is never shown to other users</span>
        </div>
      </div>

      {/* Mock integrations link */}
      <Link
        href="/integrations"
        className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
      >
        <div>
          <p className="text-sm font-semibold text-white">Connect integrations</p>
          <p className="text-xs text-zinc-500">ChatGPT, Apple Notes, file upload</p>
        </div>
        <ArrowRight className="w-4 h-4 text-zinc-500" />
      </Link>

      <div className="space-y-3 mt-auto">
        {context.trim() ? (
          <button
            onClick={handlePaste}
            className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
          >
            Continue with context
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : null}
        <button
          onClick={() => router.push('/onboarding/questions')}
          className="w-full py-4 rounded-2xl bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-colors border border-zinc-700 flex items-center justify-center gap-2"
        >
          <SkipForward className="w-5 h-5" />
          Skip this — ask me questions instead
        </button>
      </div>
    </div>
  );
}
