'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getArenaEvents, getUserById, getAllUsers } from '@/lib/mock-api';
import { localStore } from '@/lib/local-store';
import { ArenaEvent, DemoUser } from '@/types';
import { Zap, Wifi } from 'lucide-react';

interface LiveParticipant {
  userId: string;
  name: string;
  role: string;
  avatarColor: string;
  avatarInitials: string;
  joinedAt: number;
  isLive: true;
}

function AvatarDot({
  color, initials, size = 'md', live = false,
}: {
  color: string; initials: string; size?: 'sm' | 'md'; live?: boolean;
}) {
  const sizes = { sm: 'w-10 h-10 text-xs', md: 'w-14 h-14 text-sm' };
  return (
    <div className="relative">
      <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center font-bold text-white`}>
        {initials}
      </div>
      {live && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0a0f]" />
      )}
    </div>
  );
}

export default function Arena() {
  const router = useRouter();
  const [visibleEvents, setVisibleEvents] = useState<ArenaEvent[]>([]);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState({ met: 0, matches: 0, topScore: 0 });
  const [liveParticipants, setLiveParticipants] = useState<LiveParticipant[]>([]);
  const doneRef = useRef(false);

  const events = getArenaEvents();
  const userId = localStore.getSelectedUser();
  const currentUser = getUserById(userId);
  const mockOthers = getAllUsers().filter(u => u.id !== userId).slice(0, 4);

  // Poll for live LAN participants every 4 seconds
  useEffect(() => {
    async function fetchPresence() {
      try {
        const res = await fetch('/api/presence');
        const data = await res.json();
        const others = (data.users as LiveParticipant[]).filter(u => u.userId !== userId);
        setLiveParticipants(others);
      } catch {
        // Redis unavailable — show no live participants
      }
    }

    fetchPresence();
    const poll = setInterval(fetchPresence, 4000);
    return () => clearInterval(poll);
  }, [userId]);

  // Arena event feed animation
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= events.length) {
        clearInterval(interval);
        if (!doneRef.current) {
          doneRef.current = true;
          setDone(true);
          setStats({ met: 4, matches: 4, topScore: 94 });
        }
        return;
      }
      const ev = events[i];
      i++;
      setVisibleEvents(prev => [...prev, ev]);
      if (ev.type === 'meeting') setStats(s => ({ ...s, met: s.met + 1 }));
      if (ev.type === 'highlight') setStats(s => ({
        ...s,
        matches: s.matches + 1,
        topScore: Math.max(s.topScore, 76 + s.matches * 6),
      }));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Decide which avatars to show in the ring
  const ringUsers: Array<{ id: string; color: string; initials: string; live: boolean; matchedId?: string }> =
    liveParticipants.length > 0
      ? liveParticipants.slice(0, 6).map(p => ({
          id: p.userId,
          color: p.avatarColor,
          initials: p.avatarInitials,
          live: true,
        }))
      : mockOthers.map(u => ({
          id: u.id,
          color: u.avatarColor,
          initials: u.avatarInitials,
          live: false,
          matchedId: u.id,
        }));

  return (
    <div className="flex flex-col min-h-screen px-6 py-10 gap-6">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Agent Arena</h1>
          {liveParticipants.length > 0 && (
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
              <Wifi className="w-3 h-3" />
              <span>{liveParticipants.length} live</span>
            </div>
          )}
        </div>
        <p className="text-zinc-400 text-sm">HACK-AI-2026 · Your twin is working the room.</p>
      </div>

      {/* Avatar ring */}
      {currentUser && (
        <div className="flex items-center justify-center py-4">
          <div className="relative w-44 h-44">
            {/* Center — you */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-20 h-20 ${currentUser.avatarColor} rounded-full flex items-center justify-center text-2xl font-bold text-white ring-4 ring-violet-500/50 ring-offset-4 ring-offset-[#0a0a0f]`}>
                {currentUser.avatarInitials}
              </div>
            </div>

            {/* Orbiting twins */}
            {ringUsers.map((u, i) => {
              const angle = (i / ringUsers.length) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const x = 50 + 44 * Math.cos(rad);
              const y = 50 + 44 * Math.sin(rad);
              const isActive = visibleEvents.some(e => e.matchedUserId === u.id || (u.live));
              return (
                <div
                  key={u.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
                  style={{ left: `${x}%`, top: `${y}%`, opacity: isActive ? 1 : 0.25 }}
                >
                  <AvatarDot color={u.color} initials={u.initials} size="sm" live={u.live} />
                </div>
              );
            })}

            {/* Pulse ring when active */}
            {!done && (
              <div className="absolute inset-4 rounded-full border border-violet-500/20 animate-ping" style={{ animationDuration: '2s' }} />
            )}
          </div>
        </div>
      )}

      {/* Live participants banner */}
      {liveParticipants.length > 0 && (
        <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
          <Wifi className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-emerald-300">
              {liveParticipants.length} {liveParticipants.length === 1 ? 'person is' : 'people are'} live in this room
            </p>
            <p className="text-xs text-emerald-500">
              {liveParticipants.map(p => p.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Agents met', value: stats.met },
          { label: 'Matches', value: stats.matches },
          { label: 'Top score', value: stats.topScore > 0 ? `${stats.topScore}` : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Event feed */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-72">
        {visibleEvents.map(event => (
          <div
            key={event.id}
            className={`p-3 rounded-xl text-sm transition-all ${
              event.type === 'highlight'
                ? 'bg-violet-500/10 border border-violet-500/20 text-violet-300'
                : event.type === 'complete'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
            }`}
          >
            {event.type === 'highlight' && <Zap className="w-3 h-3 inline mr-1" />}
            {event.text}
          </div>
        ))}
        {!done && visibleEvents.length === 0 && (
          <div className="text-center text-zinc-600 text-sm py-8">Entering arena...</div>
        )}
      </div>

      {done && (
        <button
          onClick={() => router.push('/matches')}
          className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 transition-colors"
        >
          View matches →
        </button>
      )}
    </div>
  );
}
