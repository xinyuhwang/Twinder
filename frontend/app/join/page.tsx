'use client';
import { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MobileShell } from '@/components/MobileShell';
import { GoogleAuthGate } from '@/components/GoogleAuthGate';
import { localStore } from '@/lib/local-store';
import { isGoogleAuthed } from '@/lib/auth';
import type { EventMode } from '@/types';
import {
  ArrowRight,
  Code2,
  Heart,
  Network,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';

const MODES: {
  id: EventMode;
  label: string;
  icon: typeof Trophy;
  headline: string;
  description: string;
}[] = [
  {
    id: 'hackathon',
    label: 'Hackathon',
    icon: Trophy,
    headline: 'Find your build crew',
    description: 'Your twin scouts for teammates, complementary skills, and late-night builders.',
  },
  {
    id: 'networking',
    label: 'Networking',
    icon: Network,
    headline: 'Work the room smarter',
    description: 'Surface the people worth a real conversation, not just another LinkedIn swap.',
  },
  {
    id: 'dating',
    label: 'Dating',
    icon: Heart,
    headline: 'Meet with intention',
    description: 'Let agents find chemistry and shared values before the awkward small talk.',
  },
  {
    id: 'custom',
    label: 'Custom',
    icon: Sparkles,
    headline: 'Your event, your rules',
    description: 'Bring any gathering. Your twin adapts to whatever you are here for.',
  },
];

function subscribeAuth(onChange: () => void) {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

export default function JoinEvent() {
  const router = useRouter();
  const authed = useSyncExternalStore(subscribeAuth, isGoogleAuthed, () => false);
  const [eventCode, setEventCode] = useState(() =>
    typeof window !== 'undefined' ? (localStore.getEventCode() ?? '') : '',
  );
  const [mode, setMode] = useState<EventMode>(() =>
    typeof window !== 'undefined' ? localStore.getEventMode() : 'hackathon',
  );

  if (!authed) {
    return <GoogleAuthGate returnTo="/join" />;
  }

  const selectedMode = MODES.find(m => m.id === mode)!;

  function handleContinue() {
    localStore.setEventCode(eventCode.trim() || 'HACK-AI-2026');
    localStore.setEventMode(mode);
    router.push('/onboarding');
  }

  function handleDemoShortcut() {
    localStore.setEventCode('HACK-AI-2026');
    localStore.setEventMode('hackathon');
    router.push('/demo');
  }

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen px-6 py-10 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-violet-400 text-sm">
            <Zap className="w-4 h-4" />
            <span>Join an event</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Where are your agents meeting?</h1>
          <p className="text-zinc-500 text-sm">
            Enter a code and pick a mode. Your twin uses this to shape matches and conversation tone.
          </p>
          {localStore.getUserName() && (
            <p className="text-xs text-zinc-600 pt-1">
              Signed in as {localStore.getUserName()}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="event-code" className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            Event code
          </label>
          <div className="relative">
            <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              id="event-code"
              type="text"
              value={eventCode}
              onChange={e => setEventCode(e.target.value)}
              placeholder="e.g. HACK-AI-2026"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Mode</p>
          <div className="grid grid-cols-2 gap-2">
            {MODES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`flex items-center gap-2.5 p-3.5 rounded-2xl border transition-all text-left ${
                  mode === id
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    mode === id ? 'bg-violet-500/20' : 'bg-zinc-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${mode === id ? 'text-violet-400' : 'text-zinc-500'}`} />
                </div>
                <span className={`text-sm font-medium ${mode === id ? 'text-white' : 'text-zinc-400'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-sm font-semibold text-white">{selectedMode.headline}</p>
          <p className="text-xs text-zinc-500 leading-relaxed">{selectedMode.description}</p>
        </div>

        <div className="flex-1" />

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleDemoShortcut}
            className="w-full py-3.5 rounded-2xl bg-zinc-900 text-zinc-300 text-sm font-medium hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            Use demo shortcut
          </button>

          <p className="text-center text-xs text-zinc-600">
            Demo shortcut loads HACK-AI-2026 with pre-built twins.
          </p>

          <Link
            href="/"
            className="block text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors pt-1"
          >
            Back to home
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
