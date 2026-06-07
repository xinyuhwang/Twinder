'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_PERSONAS } from '@/lib/personas';
import { localStore } from '@/lib/local-store';
import { api } from '@/lib/api';
import { Avatar } from '@/components/Avatar';
import { DemoLoadingScreen } from '@/components/DemoLoadingScreen';
import { MobileShell } from '@/components/MobileShell';
import { CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';

export default function Demo() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState('alexis');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPersona = DEMO_PERSONAS.find(p => p.id === selectedId)!;

  async function handleContinue() {
    setJoining(true);
    setError(null);
    try {
      const { token, user } = await api.devLogin(selectedPersona.name, selectedPersona.persona);
      localStore.setToken(token);
      localStore.setAuthMethod('demo');
      localStore.setUserId(user.id);
      localStore.setUserName(user.name);
      localStore.setPersonaId(selectedId);
      router.push('/arena');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Is the backend running?');
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <MobileShell>
        <DemoLoadingScreen onDone={() => setLoading(false)} />
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen px-6 py-10 gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium">
            HACK-AI-2026
          </div>
          <div className="flex items-center gap-2 text-emerald-400 text-sm pt-2">
            <CheckCircle className="w-4 h-4" />
            <span>7 pre-built twins ready</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Who are you today?</h1>
          <p className="text-zinc-500 text-sm">Select a pre-built twin to enter the arena.</p>
        </div>

        <div className="space-y-2 flex-1">
          {DEMO_PERSONAS.map(persona => (
            <button
              key={persona.id}
              onClick={() => setSelectedId(persona.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                selectedId === persona.id
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
              }`}
            >
              <Avatar
                name={persona.name}
                initials={persona.avatarInitials}
                color={persona.avatarColor}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white">{persona.name}</span>
                  {selectedId === persona.id && (
                    <span className="text-xs text-violet-400 bg-violet-500/20 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </div>
                <p className={`text-xs text-zinc-500 ${selectedId === persona.id ? '' : 'truncate'}`}>{persona.role}</p>
                {selectedId === persona.id && (
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{persona.tagline}</p>
                )}
              </div>
            </button>
          ))}
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            disabled={joining}
            className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {joining ? 'Signing in...' : `Continue as ${selectedPersona.name}`}
            {!joining && <ArrowRight className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              localStore.reset();
              setSelectedId('alexis');
              setError(null);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 text-zinc-600 text-xs hover:text-zinc-400 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Reset demo
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
