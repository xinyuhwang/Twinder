'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { localStore } from '@/lib/local-store';
import { api } from '@/lib/api';
import { DEMO_PERSONAS, arenaRoster } from '@/lib/personas';
import { Avatar } from '@/components/Avatar';
import { MobileShell } from '@/components/MobileShell';
import { Zap, Trophy, Users, Star, ArrowRight, RefreshCw } from 'lucide-react';
import type { MatchCard } from '@/types';

const FEED_MESSAGES: ((me: string, other: string) => string)[] = [
  (me) => `${me} Twin entered the arena`,
  (me, other) => `${me} Twin is meeting ${other} Twin`,
  (_, other) => `${other} Twin is sizing up the competition`,
  (me) => `${me} Twin found a promising signal`,
  (me, other) => `${me} and ${other} exchanging ideas`,
  (_, other) => `${other} Twin asked a great question`,
  (me) => `${me} Twin uncovered a non-obvious overlap`,
  (me, other) => `${me} Twin wrapping up with ${other}`,
  (me) => `${me} Twin scoring all connections`,
  (me) => `${me} Twin found the best matches`,
];

export default function Arena() {
  const router = useRouter();
  const [feedItems, setFeedItems] = useState<string[]>([]);
  const [agentsMet, setAgentsMet] = useState(0);
  const [matchesFound, setMatchesFound] = useState(0);
  const [topScore, setTopScore] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const feedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedIndexRef = useRef(0);
  const opponentIndexRef = useRef(0);

  const token = localStore.getToken();
  const personaId = localStore.getPersonaId();
  const myPersona = DEMO_PERSONAS.find(p => p.id === personaId) ?? DEMO_PERSONAS[0];
  const opponents = arenaRoster().filter(p => p.id !== personaId);
  const eventMode = localStore.getEventMode();

  function startFeedAnimation() {
    feedIndexRef.current = 0;
    opponentIndexRef.current = 0;

    feedTimerRef.current = setInterval(() => {
      const msgFn = FEED_MESSAGES[feedIndexRef.current % FEED_MESSAGES.length];
      const opponent = opponents[opponentIndexRef.current % opponents.length];
      const msg = msgFn(myPersona.name, opponent.name);
      setFeedItems(prev => [msg, ...prev].slice(0, 6));
      feedIndexRef.current += 1;
      if (feedIndexRef.current % 2 === 0) {
        opponentIndexRef.current += 1;
        setAgentsMet(prev => Math.min(prev + 1, opponents.length));
      }
    }, 2200);
  }

  async function runArena(isRetry = false) {
    if (!token) {
      router.push('/demo');
      return;
    }
    setError(null);
    if (isRetry) setRetrying(true);

    startFeedAnimation();

    try {
      const response = await api.startArena(token, eventMode);
      if (feedTimerRef.current) clearInterval(feedTimerRef.current);

      const cards: MatchCard[] = response.match_cards ?? [];
      localStore.setArenaCards(cards);
      setAgentsMet(opponents.length);
      setMatchesFound(cards.length);
      setTopScore(cards[0]?.score ?? null);
      setFeedItems(prev => [`${myPersona.name} Twin finished — ${cards.length} matches ranked`, ...prev].slice(0, 6));
      setDone(true);
    } catch (err) {
      if (feedTimerRef.current) clearInterval(feedTimerRef.current);
      // Try falling back to cached results
      try {
        const cached = await api.getArenaResults(token);
        const cards: MatchCard[] = cached.match_cards ?? [];
        if (cards.length > 0) {
          localStore.setArenaCards(cards);
          setAgentsMet(opponents.length);
          setMatchesFound(cards.length);
          setTopScore(cards[0]?.score ?? null);
          setFeedItems(prev => [`Loaded previous arena results — ${cards.length} matches`, ...prev].slice(0, 6));
          setDone(true);
          return;
        }
      } catch {
        // fall through to error
      }
      setError(err instanceof Error ? err.message : 'Arena run failed. Is the backend running?');
    } finally {
      setRetrying(false);
    }
  }

  useEffect(() => {
    if (!token) {
      router.push('/demo');
      return;
    }
    async function init() {
      const cached = localStore.getArenaCards();
      if (cached && cached.length > 0) {
        setAgentsMet(opponents.length);
        setMatchesFound(cached.length);
        setTopScore(cached[0]?.score ?? null);
        setFeedItems([`${myPersona.name} Twin — ${cached.length} matches ready`]);
        setDone(true);
        return;
      }
      await runArena();
    }
    init();
    return () => {
      if (feedTimerRef.current) clearInterval(feedTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token) return null;

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen px-6 py-10 gap-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium">
            <Zap className="w-3 h-3" />
            Arena — {eventMode}
          </div>
          <h1 className="text-2xl font-bold text-white">Your twin is in the room</h1>
          <p className="text-zinc-500 text-sm">
            {done ? 'Conversations complete. Your matches are ranked.' : 'Conversations happening now...'}
          </p>
        </div>

        {/* Avatar constellation */}
        <div className="flex items-center justify-center py-2">
          <div className="relative w-52 h-52">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={done ? {} : { scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Avatar
                  name={myPersona.name}
                  initials={myPersona.avatarInitials}
                  color={myPersona.avatarColor}
                  size="lg"
                  pulse={!done}
                />
              </motion.div>
            </div>

            {opponents.map((p, i) => {
              const angle = (i / opponents.length) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const x = 50 + 46 * Math.cos(rad);
              const y = 50 + 46 * Math.sin(rad);
              const hasMet = i < agentsMet;
              return (
                <motion.div
                  key={p.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: hasMet ? 0.9 : 0.3 }}
                  transition={{ duration: 0.6 }}
                >
                  <Avatar
                    name={p.name}
                    initials={p.avatarInitials}
                    color={p.avatarColor}
                    size="sm"
                  />
                </motion.div>
              );
            })}

            {!done && (
              <div
                className="absolute inset-6 rounded-full border border-violet-500/20 animate-ping"
                style={{ animationDuration: '2.5s' }}
              />
            )}
          </div>
        </div>

        {/* Live feed */}
        <div className="space-y-2 min-h-[8rem]">
          <AnimatePresence mode="popLayout">
            {feedItems.map((item, i) => (
              <motion.div
                key={item + i}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: i === 0 ? 1 : 0.4 - i * 0.06 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm"
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i === 0 ? 'bg-violet-400' : 'bg-zinc-700'}`} />
                <span className={i === 0 ? 'text-zinc-200' : 'text-zinc-600'}>{item}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {!done && feedItems.length === 0 && (
            <p className="text-zinc-600 text-sm">Starting conversations...</p>
          )}
        </div>

        {/* Counters */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Agents met', value: agentsMet > 0 ? String(agentsMet) : '...', icon: Users },
            { label: 'Matches', value: matchesFound > 0 ? String(matchesFound) : done ? '0' : '...', icon: Trophy },
            { label: 'Top score', value: topScore !== null ? `${topScore}%` : '...', icon: Star },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
              <Icon className="w-4 h-4 text-violet-400 mx-auto" />
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm space-y-2">
            <p>{error}</p>
            <button
              onClick={() => runArena(true)}
              disabled={retrying}
              className="flex items-center gap-1.5 text-xs text-red-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${retrying ? 'animate-spin' : ''}`} />
              {retrying ? 'Retrying...' : 'Try again'}
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="flex-1" />
        {done ? (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => router.push('/matches')}
            className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
          >
            View matches
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        ) : (
          <div className="flex items-center justify-center gap-2 py-3 text-zinc-600 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            Conversations in progress — this takes about 30-60s
          </div>
        )}

        <button
          onClick={() => router.push('/demo')}
          className="text-center text-xs text-zinc-700 hover:text-zinc-500 transition-colors"
        >
          Back to demo
        </button>
      </div>
    </MobileShell>
  );
}
