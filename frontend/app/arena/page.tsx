'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { localStore } from '@/lib/local-store';
import { api } from '@/lib/api';
import { DEMO_PERSONAS } from '@/lib/personas';
import { Zap } from 'lucide-react';

function AvatarDot({
  color,
  initials,
  size = 'md',
  pulse = false,
}: {
  color: string;
  initials: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}) {
  const sizes = { sm: 'w-10 h-10 text-xs', md: 'w-14 h-14 text-sm' };
  return (
    <div className="relative">
      <div
        className={`${sizes[size]} ${color} rounded-full flex items-center justify-center font-bold text-white`}
      >
        {initials}
      </div>
      {pulse && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-violet-400 rounded-full border-2 border-[#0a0a0f] animate-pulse" />
      )}
    </div>
  );
}

export default function Arena() {
  const router = useRouter();
  const [position, setPosition] = useState<number | null>(null);
  const [secondsWaiting, setSecondsWaiting] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const failureCount = useRef(0);

  const token = localStore.getToken();
  const personaId = localStore.getPersonaId();
  const currentPersona = DEMO_PERSONAS.find(p => p.id === personaId) ?? DEMO_PERSONAS[0];
  const otherPersonas = DEMO_PERSONAS.filter(p => p.id !== personaId).slice(0, 5);

  useEffect(() => {
    if (!token) {
      router.push('/demo');
      return;
    }

    // Start matchmaking — ignore 4xx (already queued is fine)
    api.matchmake(token).catch(err => {
      const msg = err instanceof Error ? err.message : '';
      if (!msg.includes('4')) setErrorMsg('Could not reach backend. Is it running?');
    });

    // Poll status every 2 seconds
    async function checkStatus() {
      try {
        const res = await api.matchmakeStatus(token!);
        failureCount.current = 0;
        if (res.status === 'matched' && res.room_id) {
          // Guard: skip rooms that are already completed (stale Redis result)
          const room = await api.getRoom(token!, res.room_id).catch(() => null);
          if (room && room.status === 'completed') {
            // Stale result — re-enqueue
            await api.matchmake(token!).catch(() => {});
            return;
          }
          localStore.setCurrentRoomId(res.room_id);
          clearIntervals();
          router.push(`/room/${res.room_id}`);
        } else {
          setPosition(res.position ?? null);
        }
      } catch {
        failureCount.current += 1;
        if (failureCount.current >= 3) {
          clearIntervals();
          setErrorMsg('Lost connection to backend. Make sure it is running at http://localhost:8000.');
        }
      }
    }

    function clearIntervals() {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    pollRef.current = setInterval(checkStatus, 2000);
    checkStatus();

    // Seconds counter
    timerRef.current = setInterval(() => {
      setSecondsWaiting(s => s + 1);
    }, 1000);

    return clearIntervals;
  }, [token, router]);

  if (!token) return null;

  if (errorMsg) {
    return (
      <div className="flex flex-col min-h-screen px-6 py-10 items-center justify-center gap-6 text-center">
        <div className="text-5xl">!</div>
        <h2 className="text-xl font-bold text-white">Something went wrong</h2>
        <p className="text-zinc-400 text-sm">{errorMsg}</p>
        <button
          onClick={() => router.push('/demo')}
          className="px-6 py-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 transition-colors"
        >
          Back to demo
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-10 gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Agent Arena</h1>
        <p className="text-zinc-400 text-sm">Your twin is looking for a match...</p>
      </div>

      {/* Avatar ring */}
      <div className="flex items-center justify-center py-4">
        <div className="relative w-44 h-44">
          {/* Center — you */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-20 h-20 ${currentPersona.avatarColor} rounded-full flex items-center justify-center text-2xl font-bold text-white ring-4 ring-violet-500/50 ring-offset-4 ring-offset-[#0a0a0f]`}
            >
              {currentPersona.avatarInitials}
            </div>
          </div>

          {/* Orbiting others */}
          {otherPersonas.map((p, i) => {
            const angle = (i / otherPersonas.length) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const x = 50 + 44 * Math.cos(rad);
            const y = 50 + 44 * Math.sin(rad);
            return (
              <div
                key={p.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
                style={{ left: `${x}%`, top: `${y}%`, opacity: 0.4 }}
              >
                <AvatarDot color={p.avatarColor} initials={p.avatarInitials} size="sm" />
              </div>
            );
          })}

          {/* Pulse ring */}
          <div
            className="absolute inset-4 rounded-full border border-violet-500/30 animate-ping"
            style={{ animationDuration: '2s' }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2 text-violet-400">
          <Zap className="w-4 h-4 animate-pulse" />
          <span className="font-semibold">Finding your match...</span>
        </div>

        {position !== null && (
          <p className="text-zinc-500 text-sm">Position in queue: #{position}</p>
        )}

        <div className="flex items-center gap-2 text-zinc-600 text-xs">
          <span>Waiting</span>
          <span className="font-mono text-zinc-400">{secondsWaiting}s</span>
        </div>
      </div>

      {/* Stats placeholder */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'In queue', value: position !== null ? `#${position}` : '...' },
          { label: 'Status', value: 'Live' },
          { label: 'Waiting', value: `${secondsWaiting}s` },
        ].map(({ label, value }) => (
          <div key={label} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
        <p className="text-zinc-600 text-sm">
          Hang tight — your digital twin is working the room.
        </p>
        <p className="text-zinc-700 text-xs">You&apos;ll be redirected automatically when matched.</p>
      </div>

      <button
        onClick={() => router.push('/demo')}
        className="w-full py-3 rounded-2xl bg-zinc-900 text-zinc-500 text-sm font-medium hover:bg-zinc-800 border border-zinc-800 transition-colors"
      >
        Cancel and go back
      </button>
    </div>
  );
}
