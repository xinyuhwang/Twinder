'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@/components/Avatar';
import { DEMO_PERSONAS } from '@/lib/personas';

const INGESTION_MESSAGES = [
  'Integrating chat history from ChatGPT...',
  'Bringing in your Notes...',
  'Reading old essays...',
  'Reviewing your resume...',
  'Looking through your GitHub...',
  'Connecting your LinkedIn...',
  'Finding recurring obsessions...',
  'Identifying weird niche interests...',
  'Snooping your texts — just kidding... probably.',
  'Teaching your agent how you think...',
  'Building your digital twin...',
];

const DURATION_MS = 6000;

interface DemoLoadingScreenProps {
  onDone: () => void;
}

export function DemoLoadingScreen({ onDone }: DemoLoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const startRef = useRef(0);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setReady(true);
    setProgress(100);
    setTimeout(onDone, 800);
  }, [onDone]);

  useEffect(() => {
    startRef.current = Date.now();

    const messageInterval = setInterval(() => {
      setMessageIndex(i => (i + 1) % INGESTION_MESSAGES.length);
    }, 900);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(95, (elapsed / DURATION_MS) * 100);
      setProgress(pct);
      if (elapsed >= DURATION_MS) {
        clearInterval(progressInterval);
        finish();
      }
    }, 50);

    const timeout = setTimeout(finish, DURATION_MS + 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [finish]);

  const previewPersonas = DEMO_PERSONAS.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen px-6 py-10 items-center justify-center gap-8">
      {/* Orbit animation */}
      <div className="relative w-48 h-48">
        <motion.div
          className="absolute inset-0 rounded-full border border-accent/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border border-accent/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Avatar name="You" size="lg" color="bg-accent-solid" />
          </motion.div>
        </div>
        {previewPersonas.map((p, i) => {
          const angle = (i / previewPersonas.length) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 42 * Math.cos(rad);
          const y = 50 + 42 * Math.sin(rad);
          return (
            <motion.div
              key={p.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ delay: i * 0.3, duration: 0.5 }}
            >
              <Avatar
                name={p.name}
                initials={p.avatarInitials}
                color={p.avatarColor}
                size="sm"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Floating integration cards */}
      <div className="flex gap-2 flex-wrap justify-center">
        {['ChatGPT', 'Notes', 'GitHub', 'LinkedIn'].map((label, i) => (
          <motion.div
            key={label}
            className="px-3 py-1.5 rounded-full bg-surface border border-border text-xs text-muted"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.15 }}
          >
            {label}
          </motion.div>
        ))}
      </div>

      {/* Rotating message */}
      <div className="h-12 flex items-center justify-center text-center px-4">
        <AnimatePresence mode="wait">
          {ready ? (
            <motion.p
              key="ready"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-semibold text-success-fg"
            >
              Twin ready.
            </motion.p>
          ) : (
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-muted"
            >
              {INGESTION_MESSAGES[messageIndex]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs space-y-2">
        <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent-solid to-aura-blush"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="text-xs text-subtle text-center">
          {ready ? 'Ready to continue' : 'Building your twin...'}
        </p>
      </div>

      {!ready && (
        <button
          onClick={finish}
          className="text-xs text-subtle hover:text-muted transition-colors"
        >
          Skip
        </button>
      )}
    </div>
  );
}
