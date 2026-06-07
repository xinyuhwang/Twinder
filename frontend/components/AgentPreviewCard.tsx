'use client';
import { useState } from 'react';
import {
  useCopilotAction,
  useCopilotAdditionalInstructions,
  useCopilotReadable,
} from '@copilotkit/react-core';
import { Avatar } from '@/components/Avatar';
import { TwinderCopilotPanel } from '@/components/TwinderCopilotPanel';
import { PREVIEW_COPILOT_INSTRUCTIONS } from '@/lib/copilot';
import type { AgentPreviewDisplay } from '@/lib/preview';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';

interface AgentPreviewCardProps {
  preview: AgentPreviewDisplay;
  onPreviewChange?: (preview: AgentPreviewDisplay) => void;
  onApprove: () => void;
  loading?: boolean;
}

export function AgentPreviewCard({
  preview,
  onPreviewChange,
  onApprove,
  loading = false,
}: AgentPreviewCardProps) {
  const [patch, setPatch] = useState<Partial<AgentPreviewDisplay>>({});
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const display = { ...preview, ...patch };

  function updateDisplay(next: AgentPreviewDisplay) {
    onPreviewChange?.(next);
  }

  useCopilotReadable({
    description: 'Current twin preview display shown to the user',
    value: display,
  });

  useCopilotAdditionalInstructions({
    instructions: PREVIEW_COPILOT_INSTRUCTIONS,
    available: 'enabled',
  });

  useCopilotAction({
    name: 'apply_preview_edits',
    description: 'Apply edited twin preview fields to the UI after a backend edit action.',
    parameters: [
      {
        name: 'summary',
        type: 'string',
        description: 'Updated public-safe summary',
        required: false,
      },
      {
        name: 'agent_voice',
        type: 'string',
        description: 'Updated agent voice description',
        required: false,
      },
      {
        name: 'privacy_settings',
        type: 'string[]',
        description: 'Updated privacy settings list',
        required: false,
      },
    ],
    handler: async ({ summary, agent_voice, privacy_settings }) => {
      const nextPatch: Partial<AgentPreviewDisplay> = {};
      if (summary) nextPatch.summary = summary;
      if (agent_voice) nextPatch.agentVoice = agent_voice;
      if (privacy_settings?.length) nextPatch.privacySettings = privacy_settings;
      if (Object.keys(nextPatch).length === 0) return 'No changes to apply.';
      const next = { ...display, ...nextPatch };
      setPatch(prev => ({ ...prev, ...nextPatch }));
      updateDisplay(next);
      return 'Preview updated.';
    },
  });

  function openCopilot(prompt?: string) {
    setPendingPrompt(prompt ?? null);
    setCopilotOpen(true);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
        <p className="text-sm text-zinc-400">Building your twin preview...</p>
        <p className="text-xs text-zinc-600">Your raw text stays hidden. Only a safe summary is shown.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 card-glow space-y-4">
          <div className="flex items-center gap-4">
            <Avatar
              name={display.avatarName}
              initials={display.avatarInitials}
              color={display.avatarColor}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white">{display.agentName}</h2>
              <p className="text-sm text-violet-300">{display.agentVibe}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{display.completenessScore}%</p>
              <p className="text-xs text-zinc-500">complete</p>
            </div>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">{display.summary}</p>
        </div>

        <PreviewSection title="Looking for" items={display.lookingFor} />
        <PreviewSection title="Conversation bait" items={display.conversationBait} />
        <PreviewSection title="Can help with" items={display.canHelpWith} />
        <PreviewSection title="Wants help with" items={display.wantsHelpWith} />

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Agent voice</p>
          <p className="text-sm text-zinc-300">{display.agentVoice}</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wide">
            <Shield className="w-3.5 h-3.5" />
            Privacy settings
          </div>
          <ul className="space-y-1.5">
            {display.privacySettings.map(item => (
              <li key={item} className="text-xs text-zinc-400 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">-</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={onApprove}
            className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
          >
            Approve twin
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => openCopilot('Make this sound more like me')}
              className="py-3 rounded-xl bg-zinc-900 text-zinc-300 text-sm border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              Edit voice
            </button>
            <button
              onClick={() => openCopilot('Make my privacy stricter')}
              className="py-3 rounded-xl bg-zinc-900 text-zinc-300 text-sm border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              Edit privacy
            </button>
          </div>

          <button
            onClick={() => openCopilot('Ask my agent to improve this')}
            className="w-full py-3 rounded-xl text-zinc-500 text-sm hover:text-zinc-300 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Ask my agent to improve this
          </button>
        </div>
      </div>

      <TwinderCopilotPanel
        open={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        surface="preview"
        pendingPrompt={pendingPrompt}
      />
    </>
  );
}

function PreviewSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span
            key={item}
            className="text-xs px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
