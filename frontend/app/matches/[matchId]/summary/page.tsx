'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { localStore } from '@/lib/local-store';
import { Avatar } from '@/components/Avatar';
import { MatchCopilot } from '@/components/MatchCopilot';
import { MeetConfirmationScreen } from '@/components/MeetConfirmationScreen';
import { MobileShell } from '@/components/MobileShell';
import type { MatchCard } from '@/types';
import {
  ArrowLeft,
  Bookmark,
  Heart,
  X,
  Sparkles,
  MessageSquare,
  Trophy,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react';

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-success/20 text-success-fg border-success/30' :
    score >= 60 ? 'badge-accent' :
    'bg-surface-2 text-muted border-border-strong';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${color}`}>
      <Trophy className="h-3.5 w-3.5" />
      {score}%
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-subtle">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

export default function MatchSummary() {
  const router = useRouter();
  const params = useParams();
  const matchId = Number(params.matchId);

  const [card, setCard] = useState<MatchCard | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [meetOpen, setMeetOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const savedIds = localStore.getSavedMatchIds();
  const passedIds = localStore.getPassedMatchIds();
  const metIds = localStore.getMetMatchIds();
  const isSaved = savedIds.includes(matchId);
  const isPassed = passedIds.includes(matchId);
  const isMet = metIds.includes(matchId);

  useEffect(() => {
    const token = localStore.getToken();
    if (!token) {
      router.replace('/demo');
      return;
    }
    const cards = localStore.getArenaCards();
    const found = cards?.find(c => c.opponent_id === matchId);
    if (!found) {
      router.replace('/matches');
      return;
    }
    setCard(found);
  }, [matchId, router]);

  function handleSave() {
    const ids = localStore.getSavedMatchIds();
    if (!ids.includes(matchId)) localStore.setSavedMatchIds([...ids, matchId]);
  }

  function handlePass() {
    const ids = localStore.getPassedMatchIds();
    if (!ids.includes(matchId)) localStore.setPassedMatchIds([...ids, matchId]);
    router.push('/matches');
  }

  function openCopilot(prompt?: string) {
    setPendingPrompt(prompt ?? null);
    setCopilotOpen(true);
  }

  async function handleCopy() {
    if (!card?.suggested_opener) return;
    await navigator.clipboard.writeText(card.suggested_opener);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!card) {
    return (
      <MobileShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </MobileShell>
    );
  }

  const funFacts = card.fun_facts?.length ? card.fun_facts : [];

  return (
    <MobileShell>
      <div className="flex min-h-screen flex-col">
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border/50 bg-nav-bg px-4 py-3 backdrop-blur">
          <button
            onClick={() => router.push(`/matches/${matchId}/chat`)}
            className="text-muted transition-colors hover:text-primary"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Avatar name={card.opponent_name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-primary">{card.opponent_name}</p>
            <p className="text-xs capitalize text-subtle">{card.match_type.replace(/_/g, ' ')}</p>
          </div>
          <ScoreBadge score={card.score} />
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 pb-28">
          {(card.tip || card.headline) && (
            <Section title="Tip">
              <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4">
                <p className="text-sm leading-relaxed text-secondary">
                  {card.tip ?? card.headline}
                </p>
              </div>
            </Section>
          )}

          {funFacts.length > 0 && (
            <Section title="Fun facts">
              <ul className="space-y-2">
                {funFacts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                    <span className="text-accent">•</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {card.strongest_overlap && (
            <Section title="Strongest overlap">
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-sm leading-relaxed text-secondary">{card.strongest_overlap}</p>
              </div>
            </Section>
          )}

          {card.follow_up_questions.length > 0 && (
            <Section title="Follow-up questions">
              <ul className="space-y-2">
                {card.follow_up_questions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                    <MessageSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-subtle" />
                    {q}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            <button
              onClick={() => setMoreOpen(v => !v)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left"
            >
              <span className="text-sm font-semibold text-primary">More details</span>
              {moreOpen ? <ChevronUp className="h-4 w-4 text-subtle" /> : <ChevronDown className="h-4 w-4 text-subtle" />}
            </button>
            {moreOpen && (
              <div className="space-y-4 border-t border-border px-4 py-4">
                {card.suggested_opener && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase text-subtle">Suggested opener</p>
                    <p className="text-sm italic text-secondary">&quot;{card.suggested_opener}&quot;</p>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-muted"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copied' : 'Copy opener'}
                    </button>
                  </div>
                )}
                {card.non_obvious_overlap && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase text-subtle">Non-obvious connection</p>
                    <p className="text-sm text-secondary">{card.non_obvious_overlap}</p>
                  </div>
                )}
                {card.complementary_dynamic && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase text-subtle">Complementary dynamic</p>
                    <p className="text-sm text-secondary">{card.complementary_dynamic}</p>
                  </div>
                )}
                {card.common_interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {card.common_interests.map(interest => (
                      <span key={interest} className="rounded-full border border-border-strong bg-surface-2 px-2.5 py-1 text-xs text-muted">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
                {card.openness_compatibility != null && (
                  <p className="text-xs text-subtle">
                    Openness compatibility: {Math.round(card.openness_compatibility)}%
                  </p>
                )}
                <button
                  onClick={() => router.push(`/matches/${matchId}`)}
                  className="text-xs text-accent hover:text-accent-muted"
                >
                  View full detail page
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-border/50 bg-nav-bg px-5 py-4 backdrop-blur">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={handlePass}
              disabled={isPassed}
              className="flex flex-col items-center gap-1 rounded-2xl border border-border-strong bg-surface-2 py-3 transition-colors hover:border-error/30 hover:bg-error/20 disabled:opacity-40"
            >
              <X className="h-5 w-5 text-muted" />
              <span className="text-xs text-subtle">Pass</span>
            </button>
            <button
              onClick={() => openCopilot('Why should I meet this person?')}
              className="flex flex-col items-center gap-1 rounded-2xl border border-border-strong bg-surface-2 py-3 transition-colors hover:border-accent/30 hover:bg-accent-solid-hover/20"
            >
              <Sparkles className="h-5 w-5 text-muted" />
              <span className="text-xs text-subtle">Ask why</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaved}
              className="flex flex-col items-center gap-1 rounded-2xl border border-border-strong bg-surface-2 py-3 transition-colors hover:border-success/30 hover:bg-success/20 disabled:opacity-40"
            >
              <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-success-fg text-success-fg' : 'text-muted'}`} />
              <span className="text-xs text-subtle">Save</span>
            </button>
            <button
              onClick={() => setMeetOpen(true)}
              disabled={isMet}
              className="flex flex-col items-center gap-1 rounded-2xl border border-accent bg-accent-solid py-3 transition-colors hover:bg-accent-solid-hover disabled:border-border-strong disabled:bg-surface-2"
            >
              <Heart className={`h-5 w-5 ${isMet ? 'text-success-fg' : 'text-accent-fg'}`} />
              <span className={`text-xs ${isMet ? 'text-success-fg' : 'text-accent-fg'}`}>{isMet ? 'Sent' : 'Meet'}</span>
            </button>
          </div>
        </div>

        <MatchCopilot
          card={card}
          open={copilotOpen}
          onClose={() => setCopilotOpen(false)}
          pendingPrompt={pendingPrompt}
        />

        <AnimatePresence>
          {meetOpen && (
            <MeetConfirmationScreen
              opponentName={card.opponent_name}
              opponentId={card.opponent_id}
              onBack={() => setMeetOpen(false)}
              onViewDetail={() => setMeetOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </MobileShell>
  );
}
