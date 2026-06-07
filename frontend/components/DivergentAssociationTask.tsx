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
}

export function DivergentAssociationTask({
  initialValue,
  onComplete,
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

  useEffect(() => {
    if (!done) inputRef.current?.focus();
  }, [count, done]);

  function submit() {
    const word = input.trim().toLowerCase();
    if (!word || !isValid(word)) return;
    const seen = new Set(words.map(w => w.toLowerCase()));
    if (seen.has(word)) {
      setInput('');
      return;
    }
    const next = [...words, word];
    setWords(next);
    setInput('');
    if (next.length >= TOTAL) {
      onComplete(next);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  }

  const prompt = count === 0 ? 'Enter a random word.' : 'Enter another random word.';

  return (
    <div className="flex flex-col gap-6 flex-1">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white leading-snug">{prompt}</h2>
        {count > 0 && (
          <p className="text-sm text-zinc-500 tabular-nums">
            {count} of {TOTAL}
          </p>
        )}
      </div>

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
          disabled={done}
          className="flex-1 px-4 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors text-base"
        />
        <button
          onClick={submit}
          disabled={done || !input.trim()}
          className="px-5 py-3.5 rounded-2xl bg-violet-600 text-white font-semibold hover:bg-violet-500 disabled:opacity-40 transition-colors flex-shrink-0"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {count > 0 && (
        <div className="flex flex-wrap gap-2">
          {words.map((w, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm"
            >
              {w}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
