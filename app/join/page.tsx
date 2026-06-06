'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EventMode } from '@/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const MODES: { id: EventMode; label: string; emoji: string; desc: string }[] = [
  { id: 'HACKATHON', label: 'Hackathon', emoji: '⚡', desc: 'Find collaborators and builders' },
  { id: 'NETWORKING', label: 'Networking', emoji: '🤝', desc: 'Professional discovery and warm intros' },
  { id: 'DATING', label: 'Dating', emoji: '💫', desc: 'Compatibility and emotional alignment' },
  { id: 'GENERAL', label: 'General', emoji: '🌐', desc: 'Open-ended social discovery' },
];

export default function Join() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<EventMode>('HACKATHON');

  return (
    <div className="flex flex-col min-h-screen px-6 py-10 gap-8">
      <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Join an event</h1>
        <p className="text-zinc-400 text-sm">Enter an event code or try the demo</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs text-zinc-500 uppercase tracking-wider">Event code</label>
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. HACK-AI-2026"
            className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors font-mono"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-500 uppercase tracking-wider">Mode</label>
          <div className="grid grid-cols-2 gap-2">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === m.id ? 'border-violet-500 bg-violet-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
                }`}
              >
                <div className="text-lg mb-1">{m.emoji}</div>
                <div className="text-sm font-semibold text-white">{m.label}</div>
                <div className="text-xs text-zinc-500">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-auto">
        <button
          onClick={() => router.push('/demo')}
          className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 transition-colors"
        >
          Try demo event →
        </button>
        <button
          disabled={!code}
          className="w-full py-4 rounded-2xl bg-zinc-800 text-white font-semibold disabled:opacity-40 hover:bg-zinc-700 disabled:cursor-not-allowed transition-colors border border-zinc-700"
        >
          Join {code || 'event'}
        </button>
      </div>
    </div>
  );
}
