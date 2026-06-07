'use client';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { localStore } from '@/lib/local-store';

const WORD_COUNT = 10;
const MIN_VALID = 7;

const WORD_RE = /^[a-z][a-z'-]*[a-z]$/i;

function isWordValid(raw: string): boolean {
  const w = raw.trim();
  return !w.includes(' ') && WORD_RE.test(w);
}

function interpret(score: number): string {
  if (score >= 80) return 'Strongly divergent. Your mind ranges far and wide.';
  if (score >= 70) return 'High openness. You reach for ideas that do not usually sit together.';
  if (score >= 55) return 'Balanced. A healthy mix of range and focus.';
  return 'More convergent. You tend to stay within a coherent space.';
}

interface DivergentAssociationTaskProps {
  prompt: string;
  initialValue?: string;
  onComplete: (words: string[], score: number | null) => void;
}

export function DivergentAssociationTask({
  prompt,
  initialValue,
  onComplete,
}: DivergentAssociationTaskProps) {
  const [words, setWords] = useState<string[]>(() => {
    const base = Array.from({ length: WORD_COUNT }, () => '');
    if (initialValue) {
      initialValue
        .split(',')
        .map(w => w.trim())
        .slice(0, WORD_COUNT)
        .forEach((w, i) => (base[i] = w));
    }
    return base;
  });
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validWords = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const w of words) {
      const t = w.trim().toLowerCase();
      if (t && isWordValid(t) && !seen.has(t)) {
        seen.add(t);
        out.push(t);
      }
    }
    return out;
  }, [words]);

  const canScore = validWords.length >= MIN_VALID;

  function updateWord(i: number, value: string) {
    setWords(prev => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
    if (score !== null) setScore(null); // editing invalidates a prior score
  }

  async function handleScore() {
    const token = localStore.getToken();
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('not authenticated');
      const result = await api.dat(token, validWords);
      setScore(result.score);
    } catch {
      // Backend unavailable: let the user continue without a computed score.
      setError('Could not reach the scoring service. You can continue without a score.');
      setScore(null);
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    onComplete(validWords, score);
  }

  return (
    <div className="flex flex-col gap-5 flex-1">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white leading-snug">{prompt}</h2>
        <p className="text-sm text-zinc-500">
          List {WORD_COUNT} nouns that are as different from each other as
          possible. Single words only, no proper nouns or places. We measure how
          far apart they are to gauge your openness to experience.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {words.map((w, i) => {
          const filled = w.trim().length > 0;
          const valid = filled && isWordValid(w);
          return (
            <div key={i} className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-600 tabular-nums">
                {i + 1}
              </span>
              <input
                value={w}
                onChange={e => updateWord(i, e.target.value)}
                placeholder="word"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className={`w-full pl-7 pr-3 py-2.5 rounded-xl bg-zinc-900 border text-white placeholder:text-zinc-700 text-sm focus:outline-none transition-colors ${
                  !filled
                    ? 'border-zinc-800 focus:border-violet-500/50'
                    : valid
                      ? 'border-emerald-600/40 focus:border-emerald-500/60'
                      : 'border-amber-600/40 focus:border-amber-500/60'
                }`}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-500">
          {validWords.length}/{WORD_COUNT} valid words
        </span>
        {!canScore && (
          <span className="text-zinc-600">Enter at least {MIN_VALID}</span>
        )}
      </div>

      <AnimatePresence>
        {score !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-gradient-to-br from-violet-600/15 to-pink-500/15 border border-violet-500/30 p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Openness score
              </span>
              <span className="text-2xl font-bold text-white tabular-nums">
                {Math.round(score)}
                <span className="text-sm text-zinc-500">/100</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(score)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
              />
            </div>
            <p className="text-xs text-zinc-400">{interpret(score)}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-xs text-amber-400/80">{error}</p>
      )}

      <div className="mt-auto space-y-2">
        {score === null ? (
          <button
            onClick={handleScore}
            disabled={!canScore || loading}
            className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold hover:bg-violet-500 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Measuring divergence...' : 'Reveal my openness score'}
            {!loading && <Sparkles className="w-5 h-5" />}
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {error && (
          <button
            onClick={handleContinue}
            className="w-full py-3 rounded-2xl text-zinc-500 text-sm hover:text-zinc-300 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Continue without a score
          </button>
        )}
      </div>
    </div>
  );
}
