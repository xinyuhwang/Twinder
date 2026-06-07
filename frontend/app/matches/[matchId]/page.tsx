'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { localStore } from '@/lib/local-store';
import { Avatar } from '@/components/Avatar';
import { MatchCopilot } from '@/components/MatchCopilot';
import { AgentConversationViewer } from '@/components/AgentConversationViewer';
import { MeetConfirmationScreen } from '@/components/MeetConfirmationScreen';
import { MobileShell } from '@/components/MobileShell';
import { DEMO_PERSONAS } from '@/lib/personas';
import type { MatchCard } from '@/types';
import { sanitizeSummary } from '@/lib/sanitize';
import {
  ArrowLeft,
  Copy,
  Check,
  Bookmark,
  Heart,
  X,
  Sparkles,
  MessageSquare,
  Zap,
  Trophy,
  Eye,
  Shield,
} from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-subtle">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex text-xs px-2.5 py-1 rounded-full bg-surface-2 text-muted border border-border-strong">
      {label}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-success/20 text-success-fg border-success/30' :
    score >= 60 ? 'badge-accent' :
    'bg-surface-2 text-muted border-border-strong';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${color}`}>
      <Trophy className="w-3.5 h-3.5" />
      {score}% match
    </span>
  );
}

export default function MatchDetail() {
  const router = useRouter();
  const params = useParams();
  const matchId = Number(params.matchId);

  const [card, setCard] = useState<MatchCard | null>(null);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [eavesdropOpen, setEavesdropOpen] = useState(false);
  const [meetOpen, setMeetOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const savedIds = localStore.getSavedMatchIds();
  const passedIds = localStore.getPassedMatchIds();
  const metIds = localStore.getMetMatchIds();
  const isSaved = savedIds.includes(matchId);
  const isPassed = passedIds.includes(matchId);
  const isMet = metIds.includes(matchId);

  const personaId = localStore.getPersonaId();
  const myPersona = DEMO_PERSONAS.find(p => p.id === personaId) ?? DEMO_PERSONAS[0];

  useEffect(() => {
    async function init() {
      const token = localStore.getToken();
      if (!token) {
        router.push('/demo');
        return;
      }
      const cards = localStore.getArenaCards();
      if (!cards || cards.length === 0) {
        router.push('/matches');
        return;
      }
      const found = cards.find(c => c.opponent_id === matchId);
      if (!found) {
        router.push('/matches');
        return;
      }
      setCard(found);
    }
    init();
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

  async function handleCopy() {
    if (!card?.suggested_opener) return;
    await navigator.clipboard.writeText(card.suggested_opener);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function openCopilot(prompt?: string) {
    setPendingPrompt(prompt ?? null);
    setCopilotOpen(true);
  }

  if (!card) {
    return (
      <MobileShell>
        <div className="flex flex-col min-h-screen items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-nav-bg backdrop-blur px-4 py-3 flex items-center gap-3 border-b border-border/50">
          <button
            onClick={() => router.push('/matches')}
            className="text-muted hover:text-primary transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Avatar name={card.opponent_name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-primary truncate">{card.opponent_name}</p>
            <p className="text-xs text-subtle capitalize">{card.match_type.replace(/_/g, ' ')}</p>
          </div>
          <ScoreBadge score={card.score} />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 px-5 py-6 space-y-6 overflow-y-auto pb-28">
          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-primary leading-snug">{card.headline}</h1>
            <p className="text-sm text-muted leading-relaxed">{sanitizeSummary(card.summary, card.opponent_name)}</p>
          </div>

          {/* Why you should meet */}
          {card.strongest_overlap && (
            <Section title="Strongest overlap">
              <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
                <p className="text-sm text-secondary leading-relaxed">{card.strongest_overlap}</p>
              </div>
            </Section>
          )}

          {card.non_obvious_overlap && (
            <Section title="Non-obvious connection">
              <div className="p-4 rounded-2xl bg-surface border border-border">
                <p className="text-sm text-secondary leading-relaxed">{card.non_obvious_overlap}</p>
              </div>
            </Section>
          )}

          {card.complementary_dynamic && (
            <Section title="Complementary dynamic">
              <div className="p-4 rounded-2xl bg-surface border border-border">
                <p className="text-sm text-secondary leading-relaxed">{card.complementary_dynamic}</p>
              </div>
            </Section>
          )}

          {/* Suggested opener */}
          {card.suggested_opener && (
            <Section title="Suggested opener">
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
                <p className="text-sm text-secondary italic leading-relaxed">&quot;{card.suggested_opener}&quot;</p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-muted transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy opener'}
                </button>
              </div>
            </Section>
          )}

          {/* Follow-up questions */}
          {card.follow_up_questions.length > 0 && (
            <Section title="Follow-up questions">
              <ul className="space-y-2">
                {card.follow_up_questions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                    <MessageSquare className="w-3.5 h-3.5 text-subtle flex-shrink-0 mt-0.5" />
                    {q}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Common interests */}
          {card.common_interests.length > 0 && (
            <Section title="Common interests">
              <div className="flex flex-wrap gap-2">
                {card.common_interests.map(interest => (
                  <Tag key={interest} label={interest} />
                ))}
              </div>
            </Section>
          )}

          {/* Copilot prompts */}
          <Section title="Ask your agent">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openCopilot('Why should I meet this person?')}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-accent/10 text-accent-muted border border-accent/20 hover:bg-accent-solid-hover/20 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Ask my agent why
              </button>
              <button
                onClick={() => openCopilot('Give me a less awkward opener')}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-surface-2 text-muted border border-border-strong hover:bg-border-strong transition-colors"
              >
                <Zap className="w-3 h-3" />
                Less awkward opener
              </button>
            </div>
          </Section>

          {/* Eavesdrop */}
          <Section title="Agent conversation">
            <div className="rounded-2xl bg-surface border border-border overflow-hidden">
              {!eavesdropOpen ? (
                <button
                  onClick={() => setEavesdropOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-surface-2/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Eye className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-sm font-semibold text-primary">Eavesdrop</p>
                      <p className="text-xs text-subtle">
                        {card.conversation_highlights.length > 0
                          ? `${card.conversation_highlights.length} highlights`
                          : 'See what your twin said'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-accent">Show</span>
                </button>
              ) : (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-accent">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-semibold">Eavesdrop</span>
                    </div>
                    <button
                      onClick={() => setEavesdropOpen(false)}
                      className="text-xs text-subtle hover:text-secondary"
                    >
                      Hide
                    </button>
                  </div>
                  <AgentConversationViewer
                    conversationId={card.conversation_id}
                    highlights={card.conversation_highlights}
                    myName={myPersona.name}
                    opponentName={card.opponent_name}
                  />
                </div>
              )}
            </div>
          </Section>

          {/* Privacy note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface/60 border border-border/60">
            <Shield className="w-4 h-4 text-success-fg flex-shrink-0 mt-0.5" />
            <p className="text-xs text-subtle leading-relaxed">
              Your raw profile data and conversation context were never shared directly. Only a twin summary was used.
            </p>
          </div>
        </div>

        {/* Fixed action bar */}
        <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 px-5 py-4 bg-nav-bg backdrop-blur border-t border-border/50">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={handlePass}
              disabled={isPassed}
              className="flex flex-col items-center gap-1 py-3 rounded-2xl bg-surface-2 hover:bg-error/20 border border-border-strong hover:border-error/30 transition-colors group disabled:opacity-40"
              aria-label="Pass"
            >
              <X className="w-5 h-5 text-muted group-hover:text-error-fg" />
              <span className="text-xs text-subtle group-hover:text-error-fg">Pass</span>
            </button>
            <button
              onClick={() => openCopilot()}
              className="flex flex-col items-center gap-1 py-3 rounded-2xl bg-surface-2 hover:bg-accent-solid-hover/20 border border-border-strong hover:border-accent/30 transition-colors group"
              aria-label="Ask agent"
            >
              <Sparkles className="w-5 h-5 text-muted group-hover:text-accent" />
              <span className="text-xs text-subtle group-hover:text-accent">Copilot</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaved}
              className="flex flex-col items-center gap-1 py-3 rounded-2xl bg-surface-2 hover:bg-success/20 border border-border-strong hover:border-success/30 transition-colors group disabled:opacity-40"
              aria-label="Save"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'text-success-fg fill-success-fg' : 'text-muted group-hover:text-success-fg'}`} />
              <span className={`text-xs ${isSaved ? 'text-success-fg' : 'text-subtle group-hover:text-success-fg'}`}>Save</span>
            </button>
            <button
              onClick={() => setMeetOpen(true)}
              disabled={isMet}
              className="flex flex-col items-center gap-1 py-3 rounded-2xl bg-accent-solid hover:bg-accent-solid-hover border border-accent transition-colors group disabled:bg-surface-2 disabled:border-border-strong"
              aria-label="Meet"
            >
              <Heart className={`w-5 h-5 ${isMet ? 'text-success-fg' : 'text-accent-fg'}`} />
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

        {/* Meet confirmation */}
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
