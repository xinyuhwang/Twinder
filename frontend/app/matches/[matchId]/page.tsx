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
      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
      {label}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
    score >= 60 ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' :
    'bg-zinc-800 text-zinc-400 border-zinc-700';
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
          <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-[#0a0a0f]/90 backdrop-blur px-4 py-3 flex items-center gap-3 border-b border-zinc-800/50">
          <button
            onClick={() => router.push('/matches')}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Avatar name={card.opponent_name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{card.opponent_name}</p>
            <p className="text-xs text-zinc-500 capitalize">{card.match_type}</p>
          </div>
          <ScoreBadge score={card.score} />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 px-5 py-6 space-y-6 overflow-y-auto pb-28">
          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white leading-snug">{card.headline}</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">{card.summary}</p>
          </div>

          {/* Why you should meet */}
          {card.strongest_overlap && (
            <Section title="Strongest overlap">
              <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20">
                <p className="text-sm text-zinc-200 leading-relaxed">{card.strongest_overlap}</p>
              </div>
            </Section>
          )}

          {card.non_obvious_overlap && (
            <Section title="Non-obvious connection">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <p className="text-sm text-zinc-300 leading-relaxed">{card.non_obvious_overlap}</p>
              </div>
            </Section>
          )}

          {card.complementary_dynamic && (
            <Section title="Complementary dynamic">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <p className="text-sm text-zinc-300 leading-relaxed">{card.complementary_dynamic}</p>
              </div>
            </Section>
          )}

          {/* Suggested opener */}
          {card.suggested_opener && (
            <Section title="Suggested opener">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <p className="text-sm text-zinc-200 italic leading-relaxed">&quot;{card.suggested_opener}&quot;</p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
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
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-0.5" />
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
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Ask my agent why
              </button>
              <button
                onClick={() => openCopilot('Give me a less awkward opener')}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 transition-colors"
              >
                <Zap className="w-3 h-3" />
                Less awkward opener
              </button>
            </div>
          </Section>

          {/* Eavesdrop */}
          <Section title="Agent conversation">
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
              {!eavesdropOpen ? (
                <button
                  onClick={() => setEavesdropOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Eye className="w-4 h-4 text-violet-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">Eavesdrop</p>
                      <p className="text-xs text-zinc-500">
                        {card.conversation_highlights.length > 0
                          ? `${card.conversation_highlights.length} highlights`
                          : 'See what your twin said'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-violet-400">Show</span>
                </button>
              ) : (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-violet-400">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-semibold">Eavesdrop</span>
                    </div>
                    <button
                      onClick={() => setEavesdropOpen(false)}
                      className="text-xs text-zinc-500 hover:text-zinc-300"
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
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
            <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-500 leading-relaxed">
              Your raw profile data and conversation context were never shared directly. Only a twin summary was used.
            </p>
          </div>
        </div>

        {/* Fixed action bar */}
        <div className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-md px-5 py-4 bg-[#0a0a0f]/95 backdrop-blur border-t border-zinc-800/50">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={handlePass}
              disabled={isPassed}
              className="flex flex-col items-center gap-1 py-3 rounded-2xl bg-zinc-800 hover:bg-red-500/20 border border-zinc-700 hover:border-red-500/30 transition-colors group disabled:opacity-40"
              aria-label="Pass"
            >
              <X className="w-5 h-5 text-zinc-400 group-hover:text-red-400" />
              <span className="text-xs text-zinc-500 group-hover:text-red-400">Pass</span>
            </button>
            <button
              onClick={() => openCopilot()}
              className="flex flex-col items-center gap-1 py-3 rounded-2xl bg-zinc-800 hover:bg-violet-500/20 border border-zinc-700 hover:border-violet-500/30 transition-colors group"
              aria-label="Ask agent"
            >
              <Sparkles className="w-5 h-5 text-zinc-400 group-hover:text-violet-400" />
              <span className="text-xs text-zinc-500 group-hover:text-violet-400">Copilot</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaved}
              className="flex flex-col items-center gap-1 py-3 rounded-2xl bg-zinc-800 hover:bg-emerald-500/20 border border-zinc-700 hover:border-emerald-500/30 transition-colors group disabled:opacity-40"
              aria-label="Save"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'text-emerald-400 fill-emerald-400' : 'text-zinc-400 group-hover:text-emerald-400'}`} />
              <span className={`text-xs ${isSaved ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-emerald-400'}`}>Save</span>
            </button>
            <button
              onClick={() => setMeetOpen(true)}
              disabled={isMet}
              className="flex flex-col items-center gap-1 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 border border-violet-500 transition-colors group disabled:bg-zinc-800 disabled:border-zinc-700"
              aria-label="Meet"
            >
              <Heart className={`w-5 h-5 ${isMet ? 'text-emerald-400' : 'text-white'}`} />
              <span className={`text-xs ${isMet ? 'text-emerald-400' : 'text-white'}`}>{isMet ? 'Sent' : 'Meet'}</span>
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
