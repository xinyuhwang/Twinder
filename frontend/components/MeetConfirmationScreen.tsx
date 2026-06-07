'use client';
import { motion } from 'framer-motion';
import { Avatar } from '@/components/Avatar';
import { localStore } from '@/lib/local-store';
import { CheckCircle, ArrowLeft, Eye } from 'lucide-react';

interface MeetConfirmationScreenProps {
  opponentName: string;
  opponentId: number;
  onBack: () => void;
  onViewDetail: () => void;
}

export function MeetConfirmationScreen({
  opponentName,
  opponentId,
  onBack,
  onViewDetail,
}: MeetConfirmationScreenProps) {
  // Record on render
  const mets = localStore.getMetMatchIds();
  if (!mets.includes(opponentId)) {
    localStore.setMetMatchIds([...mets, opponentId]);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="fixed inset-0 z-50 bg-nav-bg flex flex-col items-center justify-center px-6 py-10 text-center gap-6"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 260, delay: 0.1 }}
        className="relative"
      >
        <Avatar name={opponentName} size="xl" />
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-success flex items-center justify-center border-2 border-bg">
          <CheckCircle className="w-4 h-4 text-primary" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-bold text-primary">Meet request saved</h2>
        <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
          In the real app, {opponentName} would be notified that you are interested in meeting.
          For now, your intent is saved locally.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-full max-w-xs p-4 rounded-2xl bg-surface border border-border text-left space-y-1.5"
      >
        <p className="text-xs font-medium text-muted uppercase tracking-wide">What would happen next</p>
        <ul className="space-y-1 text-sm text-muted">
          <li className="flex items-start gap-2">
            <span className="w-1 h-1 mt-2 rounded-full bg-accent flex-shrink-0" />
            Both twins confirm the introduction is wanted
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1 h-1 mt-2 rounded-full bg-accent flex-shrink-0" />
            A suggested meeting time and place surfaces
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1 h-1 mt-2 rounded-full bg-accent flex-shrink-0" />
            Your agent prepares a short brief for the real conversation
          </li>
        </ul>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-subtle italic max-w-xs leading-relaxed"
      >
        The agents do not replace the human conversation. They make sure the right human conversations actually happen.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-2 w-full max-w-xs"
      >
        <button
          onClick={onViewDetail}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-accent-solid text-accent-fg font-semibold hover:bg-accent-solid-hover transition-colors"
        >
          <Eye className="w-4 h-4" />
          View match detail
        </button>
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-surface text-secondary text-sm font-medium hover:bg-surface-2 border border-border transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to matches
        </button>
      </motion.div>
    </motion.div>
  );
}
