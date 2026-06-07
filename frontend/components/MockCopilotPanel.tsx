'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { getCopilotPrompts } from '@/lib/copilot';
import type { CopilotSurface } from '@/lib/copilot';

interface MockCopilotPanelProps {
  open: boolean;
  onClose: () => void;
  surface: CopilotSurface;
  response: string | null;
  onPrompt: (prompt: string) => void;
}

export function MockCopilotPanel({
  open,
  onClose,
  surface,
  response,
  onPrompt,
}: MockCopilotPanelProps) {
  const prompts = getCopilotPrompts(surface);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md rounded-t-3xl bg-zinc-900 border border-zinc-800 p-6 pb-8 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-violet-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Agent Copilot</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-500">
              Mock Copilot — responses are built from your twin data, no extra LLM call.
            </p>

            <div className="flex flex-wrap gap-2">
              {prompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => onPrompt(prompt)}
                  className="text-xs px-3 py-2 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {response && (
              <div className="p-4 rounded-2xl bg-zinc-800/80 border border-zinc-700 text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {response}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
