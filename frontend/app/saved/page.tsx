'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/MobileShell';
import { Avatar } from '@/components/Avatar';
import { localStore } from '@/lib/local-store';
import type { MatchCard } from '@/types';
import { Bookmark, ChevronRight, Trophy } from 'lucide-react';

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'bg-success/20 text-success-fg border-success/30'
      : score >= 60
        ? 'badge-accent'
        : 'bg-surface-2 text-muted border-border-strong';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      <Trophy className="w-3 h-3" />
      {score}%
    </span>
  );
}

export default function SavedMatches() {
  const router = useRouter();
  const [savedCards, setSavedCards] = useState<MatchCard[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStore.getToken();
    if (!token) {
      router.replace('/demo');
      return;
    }

    const cards = localStore.getArenaCards() ?? [];
    const savedIds = localStore.getSavedMatchIds();
    setSavedCards(cards.filter(c => savedIds.includes(c.opponent_id)));
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <MobileShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="flex min-h-screen flex-col gap-4 px-6 py-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">Saved matches</h1>
          <p className="text-sm text-subtle">
            {savedCards.length > 0
              ? `${savedCards.length} people you want to revisit`
              : 'Matches you swipe right on appear here'}
          </p>
        </div>

        {savedCards.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Bookmark className="h-7 w-7 text-accent" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-primary">No saved matches yet</h2>
              <p className="text-sm text-subtle">
                Swipe right in the match queue to save someone for later.
              </p>
            </div>
            <button
              onClick={() => router.push('/matches')}
              className="rounded-2xl bg-accent-solid px-6 py-3 font-semibold text-accent-fg transition-colors hover:bg-accent-solid-hover"
            >
              Go to matches
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {savedCards.map(card => (
              <li key={card.opponent_id}>
                <button
                  onClick={() => router.push(`/matches/${card.opponent_id}/chat`)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-border bg-surface p-4 text-left transition-colors hover:border-border-strong"
                >
                  <Avatar name={card.opponent_name} size="md" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-primary">{card.opponent_name}</span>
                      <ScoreBadge score={card.score} />
                    </div>
                    <p className="line-clamp-2 text-sm text-muted">{card.headline}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-subtle" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MobileShell>
  );
}
