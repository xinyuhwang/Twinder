'use client';
import { useState } from 'react';
import { ArrowLeft, Check, Clock } from 'lucide-react';
import Link from 'next/link';

const INTEGRATIONS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    emoji: '🤖',
    description: 'Import conversation history to help your twin learn your voice, interests, and recurring obsessions.',
    status: 'available',
  },
  {
    id: 'notes',
    name: 'Apple Notes',
    emoji: '📝',
    description: 'Bring in notes, ideas, lists, and half-formed thoughts your twin can draw from.',
    status: 'available',
  },
  {
    id: 'files',
    name: 'Upload Files',
    emoji: '📁',
    description: 'Upload resumes, bios, essays, decks, or project notes for your twin to learn from.',
    status: 'available',
  },
];

export default function Integrations() {
  const [connected, setConnected] = useState<string[]>([]);

  return (
    <div className="flex flex-col min-h-screen px-6 py-10 gap-8">
      <Link href="/onboarding" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Connect your context</h1>
        <p className="text-zinc-400 text-sm">Import from your existing tools to give your twin more depth.</p>
      </div>

      <div className="space-y-4">
        {INTEGRATIONS.map(integration => (
          <div key={integration.id} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integration.emoji}</span>
                <div>
                  <p className="font-semibold text-white">{integration.name}</p>
                  {connected.includes(integration.id) ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs">
                      <Check className="w-3 h-3" />
                      <span>Connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-zinc-500 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>Coming soon</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setConnected(prev =>
                  prev.includes(integration.id)
                    ? prev.filter(id => id !== integration.id)
                    : [...prev, integration.id]
                )}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex-shrink-0 ${
                  connected.includes(integration.id)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {connected.includes(integration.id) ? 'Connected ✓' : 'Connect'}
              </button>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">{integration.description}</p>
          </div>
        ))}
      </div>

      <Link
        href="/onboarding"
        className="w-full block text-center py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 transition-colors mt-auto"
      >
        Done
      </Link>
    </div>
  );
}
