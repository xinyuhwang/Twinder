'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MobileShell } from '@/components/MobileShell';
import { Bot, FileText, Upload, ArrowLeft, CheckCircle2 } from 'lucide-react';

const INTEGRATIONS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: Bot,
    color: 'bg-emerald-500',
    description:
      'Import your ChatGPT memory, project notes, and self-descriptions so your twin sounds like you already do.',
  },
  {
    id: 'apple-notes',
    name: 'Apple Notes',
    icon: FileText,
    color: 'bg-amber-500',
    description:
      'Pull in scattered thoughts, event prep, and half-finished bios from the notes app you actually use.',
  },
  {
    id: 'upload-files',
    name: 'Upload Files',
    icon: Upload,
    color: 'bg-blue-500',
    description:
      'Drop a resume, LinkedIn export, or personal doc. Your twin reads it behind the scenes, never shows raw files.',
  },
] as const;

type IntegrationId = (typeof INTEGRATIONS)[number]['id'];

export default function Integrations() {
  const [connected, setConnected] = useState<Set<IntegrationId>>(new Set());

  function toggleConnection(id: IntegrationId) {
    setConnected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen px-6 py-10 gap-6">
        <div className="space-y-1">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 text-zinc-500 text-sm hover:text-zinc-300 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to intake
          </Link>
          <h1 className="text-2xl font-bold text-white">Connect your context</h1>
          <p className="text-zinc-500 text-sm">
            Future import options for building your twin faster. All integrations are visual-only in this demo.
          </p>
        </div>

        <div className="space-y-3 flex-1">
          {INTEGRATIONS.map(({ id, name, icon: Icon, color, description }) => {
            const isConnected = connected.has(id);
            return (
              <div
                key={id}
                className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">{name}</span>
                      {isConnected && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Connected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleConnection(id)}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isConnected
                      ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                      : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:border-zinc-600'
                  }`}
                >
                  {isConnected ? 'Disconnect' : 'Connect — Coming soon'}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-zinc-600 leading-relaxed">
          Nothing is imported in this demo. Use paste context on the intake screen instead.
        </p>
      </div>
    </MobileShell>
  );
}
