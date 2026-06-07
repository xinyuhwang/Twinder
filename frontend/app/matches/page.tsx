'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { localStore } from '@/lib/local-store';
import { api } from '@/lib/api';
import { Avatar } from '@/components/Avatar';
import { MeetConfirmationScreen } from '@/components/MeetConfirmationScreen';
import { MobileShell } from '@/components/MobileShell';
import type { MatchCard } from '@/types';
import {
  Heart,
  X,
  MessageCircle,
  ChevronRight,
  Trophy,
  Radio,
} from 'lucide-react';

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
    score >= 60 ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' :
    'bg-zinc-800 text-zinc-400 border-zinc-700';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}>
      <Trophy className="w-3 h-3" />
      {score}%
    </span>
  );
}

function SwipeCard({
  card,
  isTop,
  onPass,
  onSave,
  onMeet,
  onOpen,
  saved,
  met,
}: {
  card: MatchCard;
  isTop: boolean;
  onPass: () => void;
  onSave: () => void;
  onMeet: () => void;
  onOpen: () => void;
  saved: boolean;
  met: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const passOpacity = useTransform(x, [-100, -20], [1, 0]);
  const saveOpacity = useTransform(x, [20, 100], [0, 1]);

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x < -80) {
      onPass();
    } else if (info.offset.x > 80) {
      onSave();
    }
  }

  return (
    <motion.div
      style={isTop ? { x, rotate } : {}}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={`absolute inset-0 cursor-grab active:cursor-grabbing select-none ${isTop ? 'z-10' : 'z-0'}`}
    >
      <div className="h-full rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col shadow-xl">
        {isTop && (
          <>
            <motion.div
              style={{ opacity: passOpacity }}
              className="absolute top-6 left-6 z-20 px-3 py-1.5 rounded-xl border-2 border-red-400 text-red-400 text-sm font-bold rotate-[-12deg]"
            >
              PASS
            </motion.div>
            <motion.div
              style={{ opacity: saveOpacity }}
              className="absolute top-6 right-6 z-20 px-3 py-1.5 rounded-xl border-2 border-emerald-400 text-emerald-400 text-sm font-bold rotate-[12deg]"
            >
              SAVE
            </motion.div>
          </>
        )}

        <div className="p-5 flex items-start gap-4">
          <Avatar name={card.opponent_name} size="lg" />
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white">{card.opponent_name}</h2>
              {met && (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Meet sent
                </span>
              )}
              {saved && !met && (
                <span className="text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">
                  Saved
                </span>
              )}
            </div>
            <ScoreBadge score={card.score} />
            <p className="text-xs text-zinc-500 capitalize">{card.match_type}</p>
          </div>
        </div>

        <div className="px-5 pb-3 flex-1 space-y-3 overflow-hidden">
          <p className="text-sm font-semibold text-violet-300 leading-snug">{card.headline}</p>
          <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">{card.summary}</p>

          {(card.tip || card.suggested_opener) && (
            <div className="p-3 rounded-2xl bg-zinc-800/60 border border-zinc-700/50">
              <p className="text-xs text-zinc-500 mb-1">Tip</p>
              <p className="text-sm text-zinc-300 leading-snug">{card.tip ?? card.suggested_opener}</p>
            </div>
          )}

          {card.common_interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {card.common_interests.slice(0, 4).map(interest => (
                <span key={interest} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onOpen}
          className="mx-5 mb-3 flex items-center justify-center gap-1.5 py-2 text-xs text-zinc-500 hover:text-violet-400 transition-colors"
        >
          Watch agent conversation
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <div className="px-5 pb-5 grid grid-cols-2 gap-3">
          <button
            onClick={onPass}
            className="flex flex-col items-center gap-1 py-3 rounded-2xl bg-zinc-800 hover:bg-red-500/20 border border-zinc-700 hover:border-red-500/30 transition-colors group"
            aria-label="Pass"
          >
            <X className="w-5 h-5 text-zinc-400 group-hover:text-red-400" />
            <span className="text-xs text-zinc-500 group-hover:text-red-400">Pass</span>
          </button>
          <button
            onClick={onMeet}
            className="flex flex-col items-center gap-1 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 border border-violet-500 transition-colors group"
            aria-label="Meet"
          >
            <Heart className="w-5 h-5 text-white" />
            <span className="text-xs text-white">Meet</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SwipeHintOverlay({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex items-end rounded-3xl bg-black/70 p-6">
      <div className="w-full space-y-4 rounded-2xl border border-zinc-700 bg-zinc-900 p-5 text-center">
        <p className="text-lg font-semibold text-white">Swipe to decide</p>
        <p className="text-sm text-zinc-400">
          Swipe right to save, left to pass. Tap the card for full details and to ask your agent why.
        </p>
        <button
          onClick={onDismiss}
          className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition-colors hover:bg-violet-500"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export default function Matches() {
  const router = useRouter();
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [meetCard, setMeetCard] = useState<MatchCard | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const savedIds = localStore.getSavedMatchIds();
  const metIds = localStore.getMetMatchIds();

  useEffect(() => {
    const token = localStore.getToken();
    if (!token) {
      router.push('/demo');
      return;
    }

    async function load() {
      const cached = localStore.getArenaCards();
      if (cached && cached.length > 0) {
        setCards(cached);
        setLoading(false);
        return;
      }
      try {
        const res = await api.getArenaResults(token!);
        if (res.match_cards.length > 0) {
          localStore.setArenaCards(res.match_cards);
          setCards(res.match_cards);
        } else {
          router.push('/arena');
        }
      } catch {
        router.push('/arena');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  useEffect(() => {
    const token = localStore.getToken();
    if (!token || loading) return;

    async function poll() {
      try {
        const [results, status] = await Promise.all([
          api.getArenaResults(token!),
          api.getArenaStatus(token!),
        ]);
        const incoming = results.match_cards ?? [];
        if (incoming.length > 0) {
          localStore.setArenaCards(incoming);
          setCards(incoming);
        }
        if (status.status === 'completed' && pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      } catch {
        // keep polling while arena may still be running
      }
    }

    poll();
    pollRef.current = setInterval(poll, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loading]);

  useEffect(() => {
    if (!loading && cards.length > 0 && !localStore.getSeenSwipeHint()) {
      setShowSwipeHint(true);
    }
  }, [loading, cards.length]);

  function dismissSwipeHint() {
    localStore.setSeenSwipeHint(true);
    setShowSwipeHint(false);
  }

  function handlePass(id: number) {
    const ids = localStore.getPassedMatchIds();
    if (!ids.includes(id)) localStore.setPassedMatchIds([...ids, id]);
    setCurrentIndex(i => i + 1);
  }

  function handleSave(id: number) {
    const ids = localStore.getSavedMatchIds();
    if (!ids.includes(id)) localStore.setSavedMatchIds([...ids, id]);
    setCurrentIndex(i => i + 1);
  }

  function handleMeet(card: MatchCard) {
    setMeetCard(card);
  }

  const activeCard = cards[currentIndex] ?? null;
  const nextCard = cards[currentIndex + 1] ?? null;

  if (loading) {
    return (
      <MobileShell>
        <div className="flex flex-col min-h-screen items-center justify-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-zinc-500 text-sm">Loading your matches...</p>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen px-4 py-10 gap-4">
        <div className="flex items-center justify-between px-2">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold text-white">Your matches</h1>
            <p className="text-zinc-500 text-sm">
              {cards.length} ranked by your twin
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{currentIndex} / {cards.length}</span>
          </div>
        </div>

        {activeCard ? (
          <div className="relative flex-1 min-h-[520px]">
            {nextCard && (
              <div
                className="absolute inset-0 rounded-3xl bg-zinc-900 border border-zinc-800"
                style={{ transform: 'scale(0.96) translateY(8px)', zIndex: 0 }}
              />
            )}
            <AnimatePresence mode="popLayout">
              <SwipeCard
                key={activeCard.opponent_id}
                card={activeCard}
                isTop
                saved={savedIds.includes(activeCard.opponent_id)}
                met={metIds.includes(activeCard.opponent_id)}
                onPass={() => handlePass(activeCard.opponent_id)}
                onSave={() => handleSave(activeCard.opponent_id)}
                onMeet={() => handleMeet(activeCard)}
                onOpen={() => router.push(`/matches/${activeCard.opponent_id}/chat`)}
              />
            </AnimatePresence>
            {showSwipeHint && <SwipeHintOverlay onDismiss={dismissSwipeHint} />}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-12">
            <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-violet-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-white">You&apos;ve seen all your matches</h2>
              <p className="text-zinc-500 text-sm">
                {savedIds.length > 0
                  ? `${savedIds.length} saved. Run the arena again to find more.`
                  : 'Run the arena again to find more connections.'}
              </p>
            </div>
            <div className="flex w-full max-w-xs flex-col gap-2">
              <button
                onClick={() => {
                  localStore.setArenaCards([]);
                  router.push('/arena');
                }}
                className="rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-violet-500"
              >
                Run arena again
              </button>
              {savedIds.length > 0 && (
                <button
                  onClick={() => router.push('/saved')}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  View saved ({savedIds.length})
                </button>
              )}
              <button
                onClick={() => router.push('/live')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-6 py-3 text-sm font-medium text-violet-300 transition-colors hover:bg-violet-500/20"
              >
                <Radio className="h-4 w-4" />
                Try a live conversation
              </button>
              <p className="text-xs text-zinc-600">
                Live pairs you one-on-one in real time. Arena ranks everyone at once.
              </p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {meetCard && (
            <MeetConfirmationScreen
              opponentName={meetCard.opponent_name}
              opponentId={meetCard.opponent_id}
              onBack={() => setMeetCard(null)}
              onViewDetail={() => {
                setMeetCard(null);
                router.push(`/matches/${meetCard.opponent_id}`);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </MobileShell>
  );
}
