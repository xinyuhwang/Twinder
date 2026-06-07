'use client';

import { useCopilotAdditionalInstructions, useCopilotReadable } from '@copilotkit/react-core';
import { TwinderCopilotPanel } from '@/components/TwinderCopilotPanel';
import { MATCH_COPILOT_INSTRUCTIONS } from '@/lib/copilot';
import type { MatchCard } from '@/types';

interface MatchCopilotProps {
  card: MatchCard;
  open: boolean;
  onClose: () => void;
  pendingPrompt?: string | null;
}

export function MatchCopilot({ card, open, onClose, pendingPrompt }: MatchCopilotProps) {
  useCopilotReadable({
    description: 'Current match card for the opponent',
    value: card,
  });

  useCopilotAdditionalInstructions({
    instructions: MATCH_COPILOT_INSTRUCTIONS,
    available: open ? 'enabled' : 'disabled',
  });

  return (
    <TwinderCopilotPanel
      open={open}
      onClose={onClose}
      surface="detail"
      pendingPrompt={pendingPrompt}
    />
  );
}
