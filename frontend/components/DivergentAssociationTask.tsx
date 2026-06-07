'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const TOTAL = 10;
const WORD_RE = /^[a-zA-Z][a-zA-Z'-]*[a-zA-Z]$/;

function isValid(w: string): boolean {
  const t = w.trim();
  return !t.includes(' ') && WORD_RE.test(t);
}

interface DivergentAssociationTaskProps {
  initialValue?: string;
  onComplete: (words: string[]) => void;
  onSkip: () => void;
}

export function DivergentAssociationTask({
  initialValue,
  onComplete,
  onSkip,
}: DivergentAssociationTaskProps) {
  const [words, setWords] = useState<string[]>(() => {
    if (!initialValue) return [];
    return initialValue
      .split(',')
      .map(w => w.trim())
      .filter(Boolean)
      .slice(0, TOTAL);
  });
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const count = words.length;
  const done = count >= TOTAL;
  const inputEmpty = !input.trim();

  // Arrow adds a word when the input has text, or advances when input is empty + words exist.
  const canAdvance = !done && count > 0 && inputEmpty;
  const canAddWord = !done && !inputEmpty && isValid(input.trim());
  const arrowEnabled = canAdvance || canAddWord;

  useEffect(() => {
    if (!done) inputRef.current?.focus();
  }, [count, done]);

  function handleArrow() {
    if (done) return;
    if (!inputEmpty) {
      // Add the word if valid.
      const word = input.trim().toLowerCase();
      if (!isValid(word)) return;
      const seen = new Set(words.map(w => w.toLowerCase()));
      if (seen.has(word)) {
        setInput('');
        return;
      }
      const next = [...words, word];
      setWords(next);
      setInput('');
      if (next.length >= TOTAL) onComplete(next);
    } else if (count > 0) {
      // Empty input, words exist — advance.
      onComplete(words);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleArrow();
    }
  }

  const prompt = count === 0 ? 'Enter a random word.' : 'Enter another random word.';

  return (
    <div className="flex flex-col gap-6 flex-1">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-primary leading-snug">
          {done ? 'Got all 10.' : prompt}
        </h2>
        {count > 0 && (
          <p className="text-sm text-subtle tabular-nums">
            {count} of {TOTAL}
          </p>
        )}
      </div>

      {!done && (
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="word"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="field-input flex-1"
          />
          <button
            onClick={handleArrow}
            disabled={!arrowEnabled}
            className="px-5 py-3.5 rounded-2xl bg-accent-solid text-accent-fg font-semibold hover:bg-accent-solid-hover disabled:opacity-40 transition-colors flex-shrink-0"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {count > 0 && (
        <div className="flex flex-wrap gap-2">
          {words.map((w, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-surface-2 text-secondary text-sm"
            >
              {w}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto space-y-2">
        {done && (
          <button
            onClick={() => onComplete(words)}
            className="w-full py-4 rounded-2xl bg-accent-solid text-accent-fg font-semibold hover:bg-accent-solid-hover transition-colors flex items-center justify-center gap-2"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={onSkip}
          className="w-full text-sm text-subtle hover:text-muted transition-colors py-2"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
