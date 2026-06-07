'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { CopilotChat } from '@copilotkit/react-ui';
import { useCopilotChat } from '@copilotkit/react-core';
import { TextMessage, Role } from '@copilotkit/runtime-client-gql';
import { getCopilotPrompts, type CopilotSurface } from '@/lib/copilot';

interface TwinderCopilotPanelProps {
  open: boolean;
  onClose: () => void;
  surface: CopilotSurface;
  pendingPrompt?: string | null;
}

export function TwinderCopilotPanel({
  open,
  onClose,
  surface,
  pendingPrompt,
}: TwinderCopilotPanelProps) {
  const prompts = getCopilotPrompts(surface);
  const { appendMessage } = useCopilotChat();
  const lastPromptRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open || !pendingPrompt || pendingPrompt === lastPromptRef.current) return;
    lastPromptRef.current = pendingPrompt;
    void appendMessage(
      new TextMessage({
        content: pendingPrompt,
        role: Role.User,
      }),
    );
  }, [open, pendingPrompt, appendMessage]);

  useEffect(() => {
    if (!open) {
      lastPromptRef.current = null;
    }
  }, [open]);

  function handlePrompt(prompt: string) {
    void appendMessage(
      new TextMessage({
        content: prompt,
        role: Role.User,
      }),
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-h-[85vh] max-w-md flex-col rounded-t-3xl border border-zinc-800 bg-zinc-900"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <div className="flex items-center gap-2 text-violet-400">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Agent Copilot</span>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-colors hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 px-6 py-3">
              {prompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handlePrompt(prompt)}
                  className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-xs text-violet-300 transition-colors hover:bg-violet-500/20"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-hidden px-2 pb-4">
              <CopilotChat
                className="h-[50vh]"
                labels={{
                  title: 'Agent Copilot',
                  initial: 'Tell me what to tweak about your twin or this match.',
                  placeholder: 'Ask your agent...',
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
