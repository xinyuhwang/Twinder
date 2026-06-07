'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { localStore } from '@/lib/local-store';
import { api } from '@/lib/api';
import type { MessageRead } from '@/lib/api';
import type { ConversationHighlight } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Avatar } from '@/components/Avatar';

interface AgentConversationViewerProps {
  conversationId: string | null;
  highlights: ConversationHighlight[];
  myName: string;
  opponentName: string;
}

export function AgentConversationViewer({
  conversationId,
  highlights,
  myName,
  opponentName,
}: AgentConversationViewerProps) {
  const [expanded, setExpanded] = useState(false);
  const [fullMessages, setFullMessages] = useState<MessageRead[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadFullTranscript() {
    if (!conversationId) return;
    const token = localStore.getToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const msgs = await api.getArenaConversation(token, conversationId);
      setFullMessages(msgs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load transcript.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function maybeLoad() {
      if (expanded && !fullMessages && conversationId) {
        await loadFullTranscript();
      }
    }
    maybeLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  function getSpeakerName(speaker: string): string {
    if (!speaker) return 'Twin';
    const lower = speaker.toLowerCase();
    if (lower.includes(myName.toLowerCase())) return `${myName} Twin`;
    if (lower.includes(opponentName.toLowerCase())) return `${opponentName} Twin`;
    return speaker;
  }

  const displayMessages: { sender: string; content: string }[] =
    expanded && fullMessages
      ? fullMessages.map(m => ({ sender: m.sender_name ?? 'Twin', content: m.content }))
      : highlights.map(h => ({ sender: getSpeakerName(h.speaker), content: h.text }));

  const isMyMessage = (sender: string) =>
    sender.toLowerCase().includes(myName.toLowerCase());

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {displayMessages.map((msg, i) => {
          const isMe = isMyMessage(msg.sender);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              <Avatar name={msg.sender} size="xs" />
              <div
                className={`max-w-[78%] space-y-0.5 ${isMe ? 'items-end flex flex-col' : ''}`}
              >
                <p className="text-xs text-muted px-1">{msg.sender}</p>
                <div
                  className={`rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'chat-bubble-self rounded-tr-sm'
                      : 'chat-bubble-other rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-error-fg px-1">{error}</p>
      )}

      {conversationId && (
        <button
          onClick={() => setExpanded(v => !v)}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-muted transition-colors px-1"
        >
          {loading ? (
            <span>Loading full transcript...</span>
          ) : expanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              Show highlights only
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              See full conversation
            </>
          )}
        </button>
      )}
    </div>
  );
}
