'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getMatchById, getMatchedUser } from '@/lib/mock-api';
import { localStore } from '@/lib/local-store';
import { Match, DemoUser } from '@/types';
import { ArrowLeft, Copy, Heart, Bookmark, X, ChevronDown, ChevronUp } from 'lucide-react';

function AvatarCircle({ user }: { user: DemoUser }) {
  return (
    <div className={`w-14 h-14 ${user.avatarColor} rounded-full flex items-center justify-center text-lg font-bold text-white`}>
      {user.avatarInitials}
    </div>
  );
}

const COPILOT_PROMPTS = [
  { label: 'Why should I meet this person?', response: (m: Match, u: DemoUser) => `Your twin found ${m.strongestOverlap} — that's rare signal. Most people at this event share surface-level interests. You two share a specific problem orientation. The conversation will go somewhere.` },
  { label: 'Give me a less awkward opener', response: (m: Match, u: DemoUser) => `Try: "I keep running into the same walls building [thing]. Your agent mentioned you've hit them too — where did you end up?" Much lower pressure than leading with credentials.` },
  { label: 'What should I ask next?', response: (m: Match, u: DemoUser) => `Ask them: "${m.followUpQuestions[0]}" — it'll reveal whether they think about this structurally or instinctively. Both are valuable, but knowing which helps you calibrate.` },
];

export default function MatchDetail() {
  const params = useParams();
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [matchedUser, setMatchedUser] = useState<DemoUser | null>(null);
  const [eavesdropOpen, setEavesdropOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotResponse, setCopilotResponse] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const m = getMatchById(params.matchId as string);
    if (m) {
      setMatch(m);
      setMatchedUser(getMatchedUser(m) ?? null);
    }
  }, [params.matchId]);

  if (!match || !matchedUser) {
    return <div className="min-h-screen flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  function copyOpener() {
    navigator.clipboard.writeText(match!.suggestedOpener.replace(/^"|"$/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0f]/90 backdrop-blur px-6 py-4 flex items-center gap-3 border-b border-zinc-800/50">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-white flex-1">Match Detail</h1>
        <span className="text-sm font-bold text-violet-400">{match.score}%</span>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Identity */}
        <div className="flex items-center gap-4">
          <AvatarCircle user={matchedUser} />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{matchedUser.name}</h2>
            <p className="text-sm text-zinc-400">{matchedUser.role}</p>
            <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 inline-block mt-1">
              {match.matchType}
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20">
          <p className="text-white font-semibold leading-snug">{match.headline}</p>
        </div>

        {/* Why meet */}
        <div className="space-y-3">
          <h3 className="text-xs text-zinc-500 uppercase tracking-wider">Why you should meet</h3>
          <div className="space-y-2">
            {match.whyMeet.map((reason, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-violet-400 text-sm font-bold mt-0.5">{i + 1}</span>
                <p className="text-sm text-zinc-300 leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Overlap */}
        <div className="space-y-3">
          <h3 className="text-xs text-zinc-500 uppercase tracking-wider">Match evidence</h3>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-xs text-emerald-400 mb-1">Strongest overlap</p>
              <p className="text-sm text-zinc-300">{match.strongestOverlap}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-xs text-violet-400 mb-1">Non-obvious overlap</p>
              <p className="text-sm text-zinc-300">{match.nonObviousOverlap}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-xs text-amber-400 mb-1">Complementary dynamic</p>
              <p className="text-sm text-zinc-300">{match.complementaryDynamic}</p>
            </div>
          </div>
        </div>

        {/* Help exchange */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <p className="text-xs text-zinc-500">You can help them with</p>
            <p className="text-sm text-zinc-300">{match.canHelpThem}</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <p className="text-xs text-zinc-500">They can help you with</p>
            <p className="text-sm text-zinc-300">{match.theyCanHelpYou}</p>
          </div>
        </div>

        {/* Possible mismatch */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400 mb-1">Possible friction</p>
          <p className="text-sm text-zinc-300">{match.possibleMismatch}</p>
        </div>

        {/* Suggested opener */}
        <div className="space-y-2">
          <h3 className="text-xs text-zinc-500 uppercase tracking-wider">Suggested opener</h3>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700 flex items-start gap-3">
            <p className="text-sm text-zinc-300 italic flex-1 leading-relaxed">{match.suggestedOpener}</p>
            <button onClick={copyOpener} className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && <p className="text-xs text-emerald-400">Copied to clipboard!</p>}
        </div>

        {/* Follow-up questions */}
        <div className="space-y-2">
          <h3 className="text-xs text-zinc-500 uppercase tracking-wider">Follow-up questions</h3>
          <div className="space-y-2">
            {match.followUpQuestions.map((q, i) => (
              <div key={i} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 italic">
                &quot;{q}&quot;
              </div>
            ))}
          </div>
        </div>

        {/* Eavesdrop */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          <button
            onClick={() => setEavesdropOpen(!eavesdropOpen)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-white text-left">🎧 Eavesdrop on agents</p>
              <p className="text-xs text-zinc-500 text-left">Hear how they found each other</p>
            </div>
            {eavesdropOpen ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
          </button>

          {eavesdropOpen && (
            <div className="px-4 pb-4 space-y-3 border-t border-zinc-800">
              <div className="pt-3 space-y-3">
                {match.conversation.map((turn, i) => (
                  <div key={i} className={`flex gap-2 ${turn.speaker === 'A' ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        turn.speaker === 'A'
                          ? 'bg-zinc-800 text-zinc-300 rounded-tl-sm'
                          : 'bg-violet-600/80 text-white rounded-tr-sm'
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1 opacity-70">{turn.speakerName}</p>
                      {turn.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Highlights */}
              <div className="pt-2 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 mb-2">Key moments</p>
                <div className="space-y-1">
                  {match.conversationHighlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                      <span className="text-violet-400">⚡</span>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Copilot */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          <button
            onClick={() => setCopilotOpen(!copilotOpen)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-white text-left">🤖 Ask my agent</p>
              <p className="text-xs text-zinc-500 text-left">Get context-aware guidance</p>
            </div>
            {copilotOpen ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
          </button>

          {copilotOpen && (
            <div className="px-4 pb-4 space-y-3 border-t border-zinc-800">
              <div className="flex flex-col gap-2 pt-3">
                {COPILOT_PROMPTS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => setCopilotResponse(p.response(match, matchedUser))}
                    className="text-left text-sm text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3 py-2 rounded-xl hover:bg-violet-500/20 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {copilotResponse && (
                <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 leading-relaxed">
                  {copilotResponse}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Privacy note */}
        <div className="text-xs text-zinc-600 flex items-start gap-2 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
          <span>🔒</span>
          <span>{match.privacyNote}</span>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => { localStore.addMeetRequest(match.id); router.push('/matches'); }}
            className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            Meet {matchedUser.name}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => { localStore.saveMatch(match.id); router.back(); }}
              className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center gap-1 transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => { localStore.passMatch(match.id); router.back(); }}
              className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center gap-1 transition-colors"
            >
              <X className="w-4 h-4" />
              Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
