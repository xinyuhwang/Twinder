'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getMatchesForUser, getMatchedUser } from '@/lib/mock-api';
import { localStore } from '@/lib/local-store';
import { Match, DemoUser } from '@/types';
import { X, Heart, Bookmark, ChevronRight } from 'lucide-react';
import Link from 'next/link';

function AvatarCircle({ user }: { user: DemoUser }) {
  return (
    <div className={`w-20 h-20 ${user.avatarColor} rounded-full flex items-center justify-center text-2xl font-bold text-white`}>
      {user.avatarInitials}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' :
    score >= 80 ? 'text-violet-400 bg-violet-400/10 border-violet-400/20' :
    'text-amber-400 bg-amber-400/10 border-amber-400/20';
  return (
    <span className={`text-sm font-bold px-3 py-1 rounded-full border ${color}`}>
      {score}% match
    </span>
  );
}

export default function Matches() {
  const router = useRouter();
  const userId = localStore.getSelectedUser();
  const allMatches = getMatchesForUser(userId);
  const [matches, setMatches] = useState(allMatches);
  const [meetConfirm, setMeetConfirm] = useState<Match | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const current = matches[0];

  function handlePass() {
    if (!current) return;
    localStore.passMatch(current.id);
    setMatches(prev => prev.slice(1));
    setDragX(0);
  }

  function handleSave() {
    if (!current) return;
    localStore.saveMatch(current.id);
    setMatches(prev => prev.slice(1));
    setDragX(0);
  }

  function handleMeet() {
    if (!current) return;
    localStore.addMeetRequest(current.id);
    setMeetConfirm(current);
  }

  function handleDragStart(clientX: number) {
    startX.current = clientX;
    setIsDragging(true);
  }

  function handleDragMove(clientX: number) {
    if (!isDragging) return;
    setDragX(clientX - startX.current);
  }

  function handleDragEnd() {
    setIsDragging(false);
    if (dragX > 80) handleSave();
    else if (dragX < -80) handlePass();
    else setDragX(0);
  }

  if (meetConfirm) {
    const user = getMatchedUser(meetConfirm)!;
    return (
      <div className="flex flex-col min-h-screen px-6 py-10 items-center justify-center gap-8 text-center">
        <div className={`w-24 h-24 ${user.avatarColor} rounded-full flex items-center justify-center text-3xl font-bold text-white ring-4 ring-emerald-400/30`}>
          {user.avatarInitials}
        </div>
        <div className="space-y-2">
          <div className="text-4xl">🎉</div>
          <h2 className="text-2xl font-bold text-white">Meet request sent!</h2>
          <p className="text-zinc-400 leading-relaxed">
            In the real app, <span className="text-white font-semibold">{user.name}</span> would be notified that you&apos;re interested in meeting.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left space-y-2 w-full">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Suggested opener</p>
          <p className="text-sm text-zinc-300 italic">&quot;{meetConfirm.suggestedOpener}&quot;</p>
        </div>
        <div className="space-y-2 w-full">
          <button
            onClick={() => { setMeetConfirm(null); setMatches(prev => prev.slice(1)); }}
            className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors"
          >
            Back to matches
          </button>
          <Link
            href={`/matches/${meetConfirm.id}`}
            className="block w-full py-3 text-center rounded-2xl bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700 border border-zinc-700 transition-colors"
          >
            View match detail
          </Link>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col min-h-screen px-6 py-10 items-center justify-center gap-6 text-center">
        <div className="text-5xl">✨</div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">That&apos;s everyone</h2>
          <p className="text-zinc-400">Your agent reviewed {allMatches.length} potential matches.</p>
        </div>
        <button onClick={() => setMatches(allMatches)} className="px-6 py-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 transition-colors">
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-10 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Your matches</h1>
        <span className="text-sm text-zinc-500">{matches.length} remaining</span>
      </div>

      {/* Stack preview */}
      <div className="relative h-[460px]">
        {matches.slice(0, 3).reverse().map((match, i, arr) => {
          const isTop = i === arr.length - 1;
          const offset = (arr.length - 1 - i) * 8;
          const user = getMatchedUser(match);
          if (!user) return null;

          return (
            <div
              key={match.id}
              className={`absolute inset-0 rounded-3xl bg-zinc-900 border card-glow transition-transform duration-200 overflow-hidden ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
              style={{
                transform: isTop
                  ? `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`
                  : `translateY(-${offset}px) scale(${1 - offset * 0.003})`,
                zIndex: i,
                borderColor: isTop && dragX > 60 ? 'rgb(52 211 153 / 0.5)' : isTop && dragX < -60 ? 'rgb(239 68 68 / 0.5)' : undefined,
              }}
              onMouseDown={isTop ? e => handleDragStart(e.clientX) : undefined}
              onMouseMove={isTop ? e => handleDragMove(e.clientX) : undefined}
              onMouseUp={isTop ? handleDragEnd : undefined}
              onMouseLeave={isTop ? handleDragEnd : undefined}
              onTouchStart={isTop ? e => handleDragStart(e.touches[0].clientX) : undefined}
              onTouchMove={isTop ? e => handleDragMove(e.touches[0].clientX) : undefined}
              onTouchEnd={isTop ? handleDragEnd : undefined}
            >
              {isTop && (
                <div className="p-6 pb-4 h-full flex flex-col gap-3 select-none">
                  {/* Swipe indicators */}
                  {dragX > 60 && (
                    <div className="absolute top-6 right-6 text-emerald-400 font-bold text-lg border-2 border-emerald-400 rounded-xl px-3 py-1 rotate-12">SAVE</div>
                  )}
                  {dragX < -60 && (
                    <div className="absolute top-6 left-6 text-red-400 font-bold text-lg border-2 border-red-400 rounded-xl px-3 py-1 -rotate-12">PASS</div>
                  )}

                  {/* User */}
                  <div className="flex items-center gap-4">
                    <AvatarCircle user={user} />
                    <div>
                      <h2 className="text-xl font-bold text-white">{user.name}</h2>
                      <p className="text-sm text-zinc-400">{user.role}</p>
                      <ScoreBadge score={match.score} />
                    </div>
                  </div>

                  {/* Match type */}
                  <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 self-start">
                    {match.matchType}
                  </span>

                  {/* Headline */}
                  <p className="text-base font-semibold text-white leading-snug">{match.headline}</p>

                  {/* Summary */}
                  <p className="text-sm text-zinc-400 leading-relaxed flex-1">{match.summary}</p>

                  {/* Opener */}
                  <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700">
                    <p className="text-xs text-zinc-500 mb-1">Suggested opener</p>
                    <p className="text-sm text-zinc-300 italic leading-snug">{match.suggestedOpener}</p>
                  </div>

                  {/* Detail link */}
                  <Link
                    href={`/matches/${match.id}`}
                    onClick={e => e.stopPropagation()}
                    className="flex items-center justify-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors py-1"
                  >
                    See full match detail
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePass}
          className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/50 transition-colors"
        >
          <X className="w-6 h-6 text-zinc-400 hover:text-red-400 transition-colors" />
        </button>
        <button
          onClick={handleMeet}
          className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/25"
        >
          <Heart className="w-7 h-7 text-white" />
        </button>
        <button
          onClick={handleSave}
          className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-colors"
        >
          <Bookmark className="w-6 h-6 text-zinc-400 hover:text-emerald-400 transition-colors" />
        </button>
      </div>

      <div className="flex justify-center gap-6 text-xs text-zinc-600">
        <span>← Pass</span>
        <span className="text-violet-400">Meet</span>
        <span>Save →</span>
      </div>
    </div>
  );
}
