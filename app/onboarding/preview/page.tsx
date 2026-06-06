'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserById } from '@/lib/mock-api';
import { localStore } from '@/lib/local-store';
import { DemoUser } from '@/types';
import { Check, Edit3, Shield, MessageSquare, ChevronRight } from 'lucide-react';

function AvatarCircle({ user }: { user: DemoUser }) {
  return (
    <div className={`w-20 h-20 ${user.avatarColor} rounded-full flex items-center justify-center text-2xl font-bold text-white`}>
      {user.avatarInitials}
    </div>
  );
}

export default function Preview() {
  const router = useRouter();
  const [user, setUser] = useState<DemoUser | null>(null);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotResponse, setCopilotResponse] = useState('');

  useEffect(() => {
    const id = localStore.getSelectedUser();
    const u = getUserById(id);
    if (u) setUser(u);
  }, []);

  const COPILOT_PROMPTS = [
    { label: 'Make this sound more like me', response: "I've softened the formal language and brought in more of your direct conversational style. The new version leads with curiosity instead of credentials." },
    { label: 'Make this less corporate', response: "Done. I removed the buzzwords and replaced them with specific things you actually care about. Much more you." },
    { label: 'Make my privacy stricter', response: "I've moved your project details to 'share after match only' and removed your current employer from the public profile. Your agent will still represent you fully — just more carefully." },
  ];

  function handleCopilot(prompt: typeof COPILOT_PROMPTS[0]) {
    setCopilotResponse(prompt.response);
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="text-zinc-500">Loading...</div></div>;

  const profile = user.twinProfile;

  return (
    <div className="flex flex-col min-h-screen px-6 py-10 gap-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Your twin</h1>
        <p className="text-zinc-400 text-sm">This is how your agent will represent you.</p>
      </div>

      {/* Twin card */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 card-glow space-y-5">
        {/* Identity */}
        <div className="flex items-center gap-4">
          <AvatarCircle user={user} />
          <div>
            <h2 className="text-xl font-bold text-white">{user.name} Twin</h2>
            <p className="text-sm text-zinc-400">{user.role}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 w-24 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-pink-400 rounded-full"
                  style={{ width: `${profile.completenessScore}%` }}
                />
              </div>
              <span className="text-xs text-zinc-500">{profile.completenessScore}% complete</span>
            </div>
          </div>
        </div>

        {/* Vibe */}
        <div className="space-y-1">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Agent vibe</p>
          <p className="text-sm text-zinc-300 leading-relaxed">{profile.vibe}</p>
        </div>

        {/* Looking for */}
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Looking for</p>
          <div className="flex flex-wrap gap-2">
            {profile.lookingFor.map(item => (
              <span key={item} className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">{item}</span>
            ))}
          </div>
        </div>

        {/* Conversation bait */}
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Conversation starters</p>
          <div className="space-y-1">
            {profile.conversationBait.map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-zinc-400">
                <MessageSquare className="w-3 h-3 mt-0.5 text-pink-400 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Help */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Can help with</p>
            <div className="space-y-1">
              {profile.canHelpWith.slice(0, 3).map(item => (
                <div key={item} className="text-xs text-zinc-400 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Wants help with</p>
            <div className="space-y-1">
              {profile.wantsHelpWith.slice(0, 3).map(item => (
                <div key={item} className="text-xs text-zinc-400 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-violet-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Voice */}
        <div className="space-y-1 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Agent voice</p>
          <p className="text-xs text-zinc-400 leading-relaxed italic">&quot;{profile.agentVoice}&quot;</p>
        </div>

        {/* Privacy */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 border-t border-zinc-800 pt-4">
          <Shield className="w-3 h-3" />
          <span>Your raw profile data is never shared. Matches only see what you approve.</span>
        </div>
      </div>

      {/* Copilot panel */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        <button
          onClick={() => setCopilotOpen(!copilotOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <span className="text-sm font-semibold text-white">Ask my agent to improve this</span>
          </div>
          <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${copilotOpen ? 'rotate-90' : ''}`} />
        </button>

        {copilotOpen && (
          <div className="px-4 pb-4 space-y-3 border-t border-zinc-800">
            <div className="flex flex-col gap-2 pt-3">
              {COPILOT_PROMPTS.map(p => (
                <button
                  key={p.label}
                  onClick={() => handleCopilot(p)}
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

      {/* Actions */}
      <div className="space-y-3 mt-auto">
        <button
          onClick={() => router.push('/arena')}
          className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Approve twin
        </button>
        <div className="flex gap-2">
          <button className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-400 text-sm font-semibold hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center gap-1">
            <Edit3 className="w-4 h-4" />
            Edit voice
          </button>
          <button className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-400 text-sm font-semibold hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center gap-1">
            <Shield className="w-4 h-4" />
            Edit privacy
          </button>
        </div>
      </div>
    </div>
  );
}
