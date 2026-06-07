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
import { ArrowRight, ChevronDown, ChevronUp, Shield, Sparkles } from 'lucide-react';

interface AgentPreviewCardProps {
  preview: AgentPreviewDisplay;
  twinPrompt?: string | null;
  onPreviewChange?: (preview: AgentPreviewDisplay) => void;
  onApprove: () => void;
  loading?: boolean;
}

export function AgentPreviewCard({
  preview,
  twinPrompt,
  onPreviewChange,
  onApprove,
  loading = false,
}: AgentPreviewCardProps) {
  const [patch, setPatch] = useState<Partial<AgentPreviewDisplay>>({});
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [promptExpanded, setPromptExpanded] = useState(false);
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
        <div className="w-12 h-12 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
        <p className="text-sm text-muted">Building your twin preview...</p>
        <p className="text-xs text-subtle">Your raw text stays hidden. Only a safe summary is shown.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-surface border border-border card-glow space-y-4">
          <div className="flex items-center gap-4">
            <Avatar
              name={display.avatarName}
              initials={display.avatarInitials}
              color={display.avatarColor}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-primary">{display.agentName}</h2>
              <p className="text-sm text-accent-muted">{display.agentVibe}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{display.completenessScore}%</p>
              <p className="text-xs text-subtle">complete</p>
            </div>
          </div>

          <p className="text-sm text-secondary leading-relaxed">{display.summary}</p>
        </div>

        <PreviewSection title="Looking for" items={display.lookingFor} />
        <PreviewSection title="Conversation bait" items={display.conversationBait} />
        <PreviewSection title="Can help with" items={display.canHelpWith} />
        <PreviewSection title="Wants help with" items={display.wantsHelpWith} />

        <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">Agent voice</p>
          <p className="text-sm text-secondary">{display.agentVoice}</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted uppercase tracking-wide">
            <Shield className="w-3.5 h-3.5" />
            Privacy settings
          </div>
          <ul className="space-y-1.5">
            {display.privacySettings.map(item => (
              <li key={item} className="text-xs text-muted flex items-start gap-2">
                <span className="text-success mt-0.5 flex-shrink-0">-</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {twinPrompt && (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <button
              onClick={() => setPromptExpanded(v => !v)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left"
            >
              <span className="text-sm font-semibold text-primary">Agent system prompt</span>
              {promptExpanded
                ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-subtle" />
                : <ChevronDown className="h-4 w-4 flex-shrink-0 text-subtle" />}
            </button>
            {promptExpanded && (
              <div className="border-t border-border px-4 pb-4 pt-3">
                <p className="mb-2 text-xs text-subtle">
                  This is what your twin actually sees in arena conversations. Review it before approving.
                </p>
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-bg p-3 text-xs leading-relaxed text-secondary">
                  {twinPrompt}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2 pt-2">
          <button
            onClick={onApprove}
            className="w-full py-4 rounded-2xl bg-accent-solid text-accent-fg font-semibold text-lg hover:bg-accent-solid-hover transition-colors flex items-center justify-center gap-2"
          >
            Approve twin
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => openCopilot('Make this sound more like me')}
              className="py-3 rounded-xl bg-surface text-secondary text-sm border border-border hover:border-border-strong transition-colors"
            >
              Edit voice
            </button>
            <button
              onClick={() => openCopilot('Make my privacy stricter')}
              className="py-3 rounded-xl bg-surface text-secondary text-sm border border-border hover:border-border-strong transition-colors"
            >
              Edit privacy
            </button>
          </div>

          <button
            onClick={() => openCopilot('Ask my agent to improve this')}
            className="w-full py-3 rounded-xl text-subtle text-sm hover:text-secondary transition-colors flex items-center justify-center gap-2"
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
    <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span
            key={item}
            className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent-muted border border-accent/20"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
