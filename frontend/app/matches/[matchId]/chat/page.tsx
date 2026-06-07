'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { localStore } from '@/lib/local-store';
import { api } from '@/lib/api';
import { Avatar } from '@/components/Avatar';
import { MobileShell } from '@/components/MobileShell';
import { DEMO_PERSONAS } from '@/lib/personas';
import type { MatchCard, ConversationHighlight } from '@/types';
import type { MessageRead } from '@/lib/api';
import { ArrowLeft, ArrowRight, Trophy } from 'lucide-react';

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
    score >= 60 ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' :
    'bg-zinc-800 text-zinc-400 border-zinc-700';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${color}`}>
      <Trophy className="h-3.5 w-3.5" />
      {score}%
    </span>
  );
}

export default function MatchChatReplay() {
  const router = useRouter();
  const params = useParams();
  const matchId = Number(params.matchId);

  const [card, setCard] = useState<MatchCard | null>(null);
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const personaId = localStore.getPersonaId();
  const myPersona = DEMO_PERSONAS.find(p => p.id === personaId) ?? DEMO_PERSONAS[0];

  useEffect(() => {
    async function init() {
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

      let transcript: { sender: string; content: string }[] = [];
      if (found.conversation_id) {
        try {
          const msgs: MessageRead[] = await api.getArenaConversation(token, found.conversation_id);
          transcript = msgs.map(m => ({
            sender: m.sender_name ?? 'Twin',
            content: m.content,
          }));
        } catch {
          transcript = highlightsToMessages(found.conversation_highlights, myPersona.name, found.opponent_name);
        }
      } else {
        transcript = highlightsToMessages(found.conversation_highlights, myPersona.name, found.opponent_name);
      }
      setMessages(transcript);
      setLoading(false);
    }
    init();
  }, [matchId, router, myPersona.name]);

  useEffect(() => {
    if (messages.length === 0) return;
    if (visibleCount >= messages.length) return;
    const timer = setTimeout(() => setVisibleCount(v => v + 1), 100);
    return () => clearTimeout(timer);
  }, [visibleCount, messages]);

  function isMyMessage(sender: string) {
    return sender.toLowerCase().includes(myPersona.name.toLowerCase());
  }

  if (!card || loading) {
    return (
      <MobileShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="flex min-h-screen flex-col pb-24">
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-800/50 bg-[#0a0a0f]/90 px-4 py-3 backdrop-blur">
          <button
            onClick={() => router.push('/matches')}
            className="text-zinc-400 transition-colors hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Avatar name={card.opponent_name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{card.opponent_name}</p>
            <p className="text-xs capitalize text-zinc-500">{card.match_type.replace(/_/g, ' ')}</p>
          </div>
          <ScoreBadge score={card.score} />
        </div>

        <div className="flex-1 space-y-3 px-4 py-6">
          {messages.slice(0, visibleCount).map((msg, i) => {
            const isMe = isMyMessage(msg.sender);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                <Avatar name={msg.sender} size="xs" />
                <div className={`max-w-[78%] space-y-0.5 ${isMe ? 'flex flex-col items-end' : ''}`}>
                  <p className="px-1 text-xs text-zinc-500">{msg.sender}</p>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      isMe
                        ? 'rounded-tr-sm bg-violet-500/20 text-violet-100'
                        : 'rounded-tl-sm bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {visibleCount < messages.length && (
            <p className="text-center text-xs text-zinc-600">Replay in progress...</p>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-md border-t border-zinc-800/50 bg-[#0a0a0f]/95 px-5 py-4 backdrop-blur">
          <button
            onClick={() => router.push(`/matches/${matchId}/summary`)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-4 font-semibold text-white transition-colors hover:bg-violet-500"
          >
            View Summary
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

function highlightsToMessages(
  highlights: ConversationHighlight[],
  myName: string,
  opponentName: string,
): { sender: string; content: string }[] {
  return highlights.map(h => ({
    sender: h.speaker.toLowerCase().includes(opponentName.toLowerCase())
      ? `${opponentName} Twin`
      : `${myName} Twin`,
    content: h.text,
  }));
}
