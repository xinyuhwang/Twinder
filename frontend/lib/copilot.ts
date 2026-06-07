import type { MatchCard } from '@/types';
import type { AgentPreviewDisplay } from '@/lib/preview';
import { applyWarmerVoice, getStrictPrivacySettings } from '@/lib/preview';

export type CopilotSurface = 'preview' | 'queue' | 'detail';

export interface CopilotResult {
  message: string;
  previewPatch?: Partial<AgentPreviewDisplay>;
}

export function composeMatchCopilot(prompt: string, card: MatchCard): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('awkward') || lower.includes('opener')) {
    const interest = card.common_interests[0];
    const soft = interest
      ? `Hey — I noticed we both care about ${interest}. ${card.suggested_opener ?? 'Worth a quick chat?'}`
      : card.suggested_opener ?? 'Worth a quick chat?';
    return soft;
  }

  if (lower.includes('ask next') || lower.includes('follow')) {
    return card.follow_up_questions.length > 0
      ? card.follow_up_questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
      : 'Ask what they are building right now and what kind of collaborator would actually help.';
  }

  const parts = [
    card.headline,
    card.summary,
    card.strongest_overlap ? `Strongest overlap: ${card.strongest_overlap}` : null,
    card.non_obvious_overlap ? `Non-obvious part: ${card.non_obvious_overlap}` : null,
  ].filter(Boolean);

  return parts.join('\n\n');
}

export function composePreviewCopilot(
  prompt: string,
  preview: AgentPreviewDisplay,
): CopilotResult {
  const lower = prompt.toLowerCase();

  if (lower.includes('privacy') || lower.includes('stricter')) {
    return {
      message: 'Done. Your agent will share less by default and wait for your approval before revealing specifics.',
      previewPatch: { privacySettings: getStrictPrivacySettings() },
    };
  }

  if (lower.includes('corporate') || lower.includes('more like me') || lower.includes('warmer')) {
    const warmer = applyWarmerVoice(preview);
    return {
      message: 'Got it. I loosened the corporate edges and made the voice sound more like you.',
      previewPatch: {
        summary: warmer.summary,
        agentVoice: warmer.agentVoice,
      },
    };
  }

  if (lower.includes('improve')) {
    return {
      message: `I would lean harder into: ${preview.conversationBait.slice(0, 2).join(' and ') || preview.agentVibe}. That is what makes you memorable in agent conversations.`,
    };
  }

  return {
    message: 'Tell me what to tweak — voice, privacy, or how bold the agent should be.',
  };
}

export function getCopilotPrompts(surface: CopilotSurface): string[] {
  if (surface === 'preview') {
    return [
      'Make my privacy stricter',
      'Make this sound more like me',
      'Ask my agent to improve this',
    ];
  }
  if (surface === 'queue') {
    return ['Why should I meet this person?', 'Give me a less awkward opener'];
  }
  return [
    'Why should I meet this person?',
    'Give me a less awkward opener',
    'What should I ask next?',
  ];
}
