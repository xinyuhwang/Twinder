'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { localStore } from '@/lib/local-store';
import { api, RoomRead, MessageRead } from '@/lib/api';
import { ArrowLeft, Send } from 'lucide-react';

interface WsMessage {
  type: 'message' | 'room_completed' | 'human_takeover' | 'vibe_score' | 'ping';
  data?: {
    sender_user_id?: string;
    sender_name?: string;
    role?: 'agent' | 'human';
    content?: string;
    timestamp?: string;
    room_id?: string;
    user_id?: string;
    user_name?: string;
    score?: number;
    summary?: string;
    common_interests?: string[];
  };
}

function AvatarBubble({
  color,
  initials,
  size = 'sm',
}: {
  color: string;
  initials: string;
  size?: 'sm' | 'md';
}) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-sm' };
  return (
    <div
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

function MessageBubble({ msg, isOwn }: { msg: MessageRead; isOwn: boolean }) {
  const isAgent = msg.role === 'agent';
  return (
    <div className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300 flex-shrink-0">
          {msg.sender_name?.[0] ?? '?'}
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isOwn
            ? 'bg-violet-600 text-white rounded-tr-sm'
            : isAgent
            ? 'bg-zinc-800 text-zinc-300 rounded-tl-sm border border-zinc-700'
            : 'bg-zinc-900 text-zinc-200 rounded-tl-sm border border-zinc-800'
        }`}
      >
        <p className="text-xs font-semibold mb-1 opacity-60">
          {msg.sender_name}{isAgent ? ' (twin)' : ''}
        </p>
        {msg.content}
      </div>
    </div>
  );
}

function VibeResults({
  room,
  commonInterests,
  onBack,
}: {
  room: RoomRead;
  commonInterests: string[];
  onBack: () => void;
}) {
  const score = room.vibe_score ?? 0;
  const color =
    score >= 80
      ? 'text-emerald-400'
      : score >= 60
      ? 'text-violet-400'
      : 'text-amber-400';

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0f]/95 flex flex-col items-center justify-center px-6 gap-6 text-center overflow-y-auto py-12">
      <div className="space-y-2">
        <div className="text-5xl">✨</div>
        <h2 className="text-3xl font-bold text-white">Vibe Score</h2>
        {room.vibe_score !== null ? (
          <p className={`text-6xl font-bold ${color}`}>{score}<span className="text-2xl text-zinc-500">/100</span></p>
        ) : (
          <p className="text-xl text-zinc-500 animate-pulse">Calculating...</p>
        )}
      </div>

      {room.vibe_summary && (
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left w-full max-w-sm">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">What your twins found</p>
          <p className="text-sm text-zinc-300 leading-relaxed">{room.vibe_summary}</p>
        </div>
      )}

      {commonInterests.length > 0 && (
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left w-full max-w-sm">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Common interests</p>
          <div className="flex flex-wrap gap-2">
            {commonInterests.map(interest => (
              <span key={interest} className="text-xs px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onBack}
        className="w-full max-w-sm py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 transition-colors"
      >
        Back to demo
      </button>
    </div>
  );
}

export default function RoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<RoomRead | null>(null);
  const [messages, setMessages] = useState<MessageRead[]>([]);
  const [tookOver, setTookOver] = useState(false);
  const [inputText, setInputText] = useState('');
  const [commonInterests, setCommonInterests] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [takingOver, setTakingOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const userId = localStore.getUserId();
  const token = localStore.getToken();

  // Load room + message history
  useEffect(() => {
    if (!token) {
      router.push('/demo');
      return;
    }

    async function load() {
      try {
        const [roomData, msgs] = await Promise.all([
          api.getRoom(token!, roomId),
          api.getMessages(token!, roomId),
        ]);
        setRoom(roomData);
        setMessages(msgs);
        if (roomData.status === 'completed') {
          setShowResults(true);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, roomId, router]);

  // WebSocket
  useEffect(() => {
    if (!token || !roomId) return;

    const url = api.wsUrl(roomId, token);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg: WsMessage = JSON.parse(event.data);
        if (msg.type === 'message' && msg.data) {
          const newMsg: MessageRead = {
            id: `ws-${Date.now()}-${Math.random()}`,
            sender_user_id: msg.data.sender_user_id ?? '',
            sender_name: msg.data.sender_name ?? '',
            role: msg.data.role ?? 'agent',
            content: msg.data.content ?? '',
            timestamp: msg.data.timestamp ?? new Date().toISOString(),
          };
          setMessages(prev => [...prev, newMsg]);
        } else if (msg.type === 'room_completed') {
          api.getRoom(token, roomId).then(r => {
            setRoom(r);
            setShowResults(true);
          });
        } else if (msg.type === 'vibe_score' && msg.data) {
          // Scorer finished — update room inline without a round-trip
          if (msg.data.common_interests) {
            setCommonInterests(msg.data.common_interests);
          }
          setRoom(prev => prev ? {
            ...prev,
            vibe_score: msg.data!.score ?? prev.vibe_score,
            vibe_summary: msg.data!.summary ?? prev.vibe_summary,
          } : prev);
          setShowResults(true);
        } else if (msg.type === 'human_takeover') {
          setTookOver(true);
        }
      } catch {
        // ignore parse errors
      }
    };

    // Ping keepalive
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      ws.close();
    };
  }, [token, roomId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTakeover = useCallback(async () => {
    if (!token || takingOver) return;
    setTakingOver(true);
    try {
      await api.takeover(token, roomId);
      setTookOver(true);
    } catch {
      // ignore
    } finally {
      setTakingOver(false);
    }
  }, [token, roomId, takingOver]);

  const handleWrapUp = useCallback(async () => {
    if (!token || completing) return;
    setCompleting(true);
    try {
      await api.completeRoom(token, roomId);
    } catch {
      // Room may already be completed — fetch current state and show results anyway
    }
    // Show results immediately; poll in background to fill in vibe score when ready
    const current = await api.getRoom(token, roomId).catch(() => null);
    if (current) setRoom(current);
    setShowResults(true);
    setCompleting(false);

    // Keep polling until vibe_score arrives (max 15s)
    let attempts = 0;
    const poll = setInterval(async () => {
      attempts++;
      try {
        const r = await api.getRoom(token, roomId);
        if (r.vibe_score !== null || attempts > 10) {
          clearInterval(poll);
          setRoom(r);
        }
      } catch {
        clearInterval(poll);
      }
    }, 1500);
  }, [token, roomId, completing]);

  const handleSend = useCallback(() => {
    if (!inputText.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: 'message', content: inputText.trim() }));
    setInputText('');
  }, [inputText]);

  if (!token) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500 text-sm">
        Loading room...
      </div>
    );
  }

  // Determine participant avatars
  const myUserId = userId?.toString();
  const participants = room?.participants ?? [];
  const me = participants.find(p => p.id.toString() === myUserId);
  const other = participants.find(p => p.id.toString() !== myUserId);

  function getInitials(name: string) {
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {showResults && room && (
        <VibeResults room={room} commonInterests={commonInterests} onBack={() => router.push('/demo')} />
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0f]/90 backdrop-blur px-4 py-3 flex items-center gap-3 border-b border-zinc-800/50">
        <button
          onClick={() => router.push('/demo')}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center gap-2">
          {participants.map(p => (
            <div
              key={p.id}
              className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white"
            >
              {getInitials(p.name)}
            </div>
          ))}
          {participants.length > 0 && (
            <span className="text-sm font-semibold text-white">
              {participants.map(p => p.name).join(' & ')}
            </span>
          )}
        </div>
        {tookOver && (
          <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
            Live
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && !loading && (
          <div className="text-center text-zinc-600 text-sm py-12">
            Your twins are connecting...
          </div>
        )}
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isOwn={msg.sender_user_id === myUserId && msg.role === 'human'}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Action bar */}
      <div className="border-t border-zinc-800 px-4 py-3 bg-[#0a0a0f] space-y-3">
        {!tookOver && (
          <div className="flex gap-2">
            <button
              onClick={handleTakeover}
              disabled={takingOver}
              className="flex-1 py-3 rounded-xl bg-zinc-800 text-white text-sm font-semibold hover:bg-zinc-700 disabled:opacity-60 border border-zinc-700 transition-colors"
            >
              {takingOver ? 'Taking over...' : 'Take Over'}
            </button>
            <button
              onClick={handleWrapUp}
              disabled={completing}
              className="flex-1 py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 disabled:opacity-60 transition-colors"
            >
              {completing ? 'Wrapping up...' : 'Wrap Up'}
            </button>
          </div>
        )}

        {tookOver && (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center hover:bg-violet-500 disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            <button
              onClick={handleWrapUp}
              disabled={completing}
              className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-400 text-sm font-semibold hover:bg-zinc-700 disabled:opacity-60 border border-zinc-700 transition-colors"
            >
              {completing ? 'Wrapping up...' : 'Wrap Up'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
