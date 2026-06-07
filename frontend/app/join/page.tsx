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
          <div className="flex items-center gap-2 text-accent text-sm">
            <Zap className="w-4 h-4" />
            <span>Join an event</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Where are your agents meeting?</h1>
          <p className="text-subtle text-sm">
            Enter a code and pick a mode. Your twin uses this to shape matches and conversation tone.
          </p>
          {localStore.getUserName() && (
            <p className="text-xs text-subtle pt-1">
              Signed in as {localStore.getUserName()}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="event-code" className="text-xs font-medium text-muted uppercase tracking-wide">
            Event code
          </label>
          <div className="relative">
            <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
            <input
              id="event-code"
              type="text"
              value={eventCode}
              onChange={e => setEventCode(e.target.value)}
              placeholder="e.g. HACK-AI-2026"
              className="field-input field-input-icon"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">Mode</p>
          <div className="grid grid-cols-2 gap-2">
            {MODES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`flex items-center gap-2.5 p-3.5 rounded-2xl border transition-all text-left ${
                  mode === id
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-surface hover:border-border-strong'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    mode === id ? 'bg-accent/20' : 'bg-surface-2'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${mode === id ? 'text-accent' : 'text-subtle'}`} />
                </div>
                <span className={`text-sm font-medium ${mode === id ? 'text-primary' : 'text-muted'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface/80 border border-border space-y-1">
          <p className="text-sm font-semibold text-primary">{selectedMode.headline}</p>
          <p className="text-xs text-subtle leading-relaxed">{selectedMode.description}</p>
        </div>

        <div className="flex-1" />

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl bg-accent-solid text-accent-fg font-semibold text-lg hover:bg-accent-solid-hover transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleDemoShortcut}
            className="w-full py-3.5 rounded-2xl bg-surface text-secondary text-sm font-medium hover:bg-surface-2 border border-border transition-colors"
          >
            Use demo shortcut
          </button>

          <p className="text-center text-xs text-subtle">
            Demo shortcut loads HACK-AI-2026 with pre-built twins.
          </p>

          <Link
            href="/"
            className="block text-center text-xs text-subtle hover:text-muted transition-colors pt-1"
          >
            Back to home
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
