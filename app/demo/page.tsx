'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllUsers } from '@/lib/mock-api';
import { localStore } from '@/lib/local-store';
import { DemoUser } from '@/types';
import { CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';

const LOADING_MESSAGES = [
  'Loading twin profiles...',
  'Connecting to event room...',
  'Twins ready.',
];

function AvatarCircle({ user, size = 'md' }: { user: DemoUser; size?: 'sm' | 'md' }) {
  const sizes = { sm: 'w-10 h-10 text-sm', md: 'w-14 h-14 text-base' };
  return (
    <div className={`${sizes[size]} ${user.avatarColor} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {user.avatarInitials}
    </div>
  );
}

export default function Demo() {
  const router = useRouter();
  const [phase, setPhase] = useState<'loading' | 'select'>('loading');
  const [msgIndex, setMsgIndex] = useState(0);
  const [selectedId, setSelectedId] = useState('alexis');
  const [joining, setJoining] = useState(false);
  const users = getAllUsers();

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setMsgIndex(i);
      if (i >= LOADING_MESSAGES.length - 1) {
        clearInterval(interval);
        setTimeout(() => setPhase('select'), 600);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  async function handleContinue() {
    setJoining(true);
    localStore.setSelectedUser(selectedId);

    const user = users.find(u => u.id === selectedId)!;
    // Register presence so other LAN participants see this user in the room
    try {
      await fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedId,
          name: user.name,
          role: user.role,
          avatarColor: user.avatarColor,
          avatarInitials: user.avatarInitials,
          tagline: user.tagline,
          twinProfile: user.twinProfile,
        }),
      });
    } catch {
      // offline — fine, demo still works with mock data
    }

    router.push('/arena');
  }

  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 gap-8">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-violet-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-pink-400 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          {['Alexis', 'Haley', 'Leo', 'Maya', 'Jordan', 'Priya', 'Marcus'].map((name, i) => (
            <span
              key={name}
              className="text-xs px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {name}
            </span>
          ))}
        </div>

        <p className="text-zinc-400 text-sm min-h-5 transition-all duration-300">
          {LOADING_MESSAGES[Math.min(msgIndex, LOADING_MESSAGES.length - 1)]}
        </p>
      </div>
    );
  }

  const selectedUser = users.find(u => u.id === selectedId)!;

  return (
    <div className="flex flex-col min-h-screen px-6 py-10 gap-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>7 twins ready · HACK-AI-2026</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Who are you today?</h1>
        <p className="text-zinc-500 text-sm">Select a pre-built twin to enter the arena.</p>
      </div>

      {/* User grid */}
      <div className="space-y-2 flex-1">
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => setSelectedId(user.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
              selectedId === user.id
                ? 'border-violet-500 bg-violet-500/10'
                : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
            }`}
          >
            <AvatarCircle user={user} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white">{user.name}</span>
                {selectedId === user.id && (
                  <span className="text-xs text-violet-400 bg-violet-500/20 px-2 py-0.5 rounded-full">You</span>
                )}
              </div>
              <p className="text-xs text-zinc-500 truncate">{user.role}</p>
            </div>
            {/* Completeness ring */}
            <div className="flex-shrink-0 text-right">
              <span className="text-xs text-zinc-600">{user.twinProfile.completenessScore}%</span>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <button
          onClick={handleContinue}
          disabled={joining}
          className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
        >
          {joining ? 'Entering arena...' : `Enter as ${selectedUser.name}`}
          {!joining && <ArrowRight className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs text-zinc-600">or</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <button
          onClick={() => { localStore.setSelectedUser(selectedId); router.push('/onboarding'); }}
          className="w-full py-3 rounded-2xl bg-zinc-900 text-zinc-400 text-sm font-medium hover:bg-zinc-800 border border-zinc-800 transition-colors"
        >
          Build my own twin →
        </button>

        <button
          onClick={() => { localStore.reset(); setPhase('loading'); setMsgIndex(0); }}
          className="w-full flex items-center justify-center gap-2 py-2 text-zinc-600 text-xs hover:text-zinc-400 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Reset demo
        </button>
      </div>
    </div>
  );
}
