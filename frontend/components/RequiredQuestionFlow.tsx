'use client';
import { useState } from 'react';
import { ArrowRight, SkipForward } from 'lucide-react';
import { DivergentAssociationTask } from '@/components/DivergentAssociationTask';

export interface FlowQuestion {
  id: string;
  text: string;
  kind?: 'text' | 'dat';
}

export const REQUIRED_QUESTIONS: FlowQuestion[] = [
  {
    id: 'animal',
    text: 'If you could have an animal follow you around, what would it be and why?',
  },
  {
    id: 'dat',
    text: 'Quick creativity check: name 10 words as different from each other as possible.',
    kind: 'dat',
  },
  {
    id: 'event_goals',
    text: 'What do you want from this event, and what should people know about you?',
  },
];

interface RequiredQuestionFlowProps {
  initialAnswers?: Record<string, string>;
  onComplete: (answers: Record<string, string>) => void;
  onFinishEarly?: (answers: Record<string, string>) => void;
}

export function RequiredQuestionFlow({
  initialAnswers = {},
  onComplete,
  onFinishEarly,
}: RequiredQuestionFlowProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [input, setInput] = useState(initialAnswers[REQUIRED_QUESTIONS[0]?.id] ?? '');

  const current = REQUIRED_QUESTIONS[step];
  const totalSteps = REQUIRED_QUESTIONS.length;
  const progress = ((step + 1) / totalSteps) * 100;
  const isLast = step >= totalSteps - 1;

  function advance(nextAnswers: Record<string, string>) {
    setAnswers(nextAnswers);
    if (step >= totalSteps - 1) {
      onComplete(nextAnswers);
      return;
    }
    const nextStep = step + 1;
    setStep(nextStep);
    setInput(nextAnswers[REQUIRED_QUESTIONS[nextStep].id] ?? '');
  }

  function handleContinue() {
    const trimmed = input.trim();
    if (!trimmed) return;
    advance({ ...answers, [current.id]: trimmed });
  }

  function handleSkip() {
    advance({ ...answers, [current.id]: answers[current.id] ?? '' });
  }

  function handleFinishEarly() {
    const payload = { ...answers, [current.id]: input.trim() || answers[current.id] || '' };
    if (onFinishEarly) {
      onFinishEarly(payload);
    } else {
      onComplete(payload);
    }
  }

  function handleDatComplete(words: string[]) {
    advance({ ...answers, [current.id]: words.join(', ') });
  }

  function handleDatSkip() {
    handleSkip();
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Question {step + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-pink-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {current.kind === 'dat' ? (
        <DivergentAssociationTask
          key={current.id}
          initialValue={answers[current.id]}
          onComplete={handleDatComplete}
          onSkip={handleDatSkip}
        />
      ) : (
        <>
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-semibold leading-snug text-white">{current.text}</h2>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your answer..."
              rows={5}
              className="w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={handleContinue}
              disabled={!input.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-4 font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-40"
            >
              {isLast ? 'See twin preview' : 'Continue'}
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={handleSkip}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <SkipForward className="h-4 w-4" />
              Skip this question
            </button>
          </div>
        </>
      )}

      <button
        onClick={handleFinishEarly}
        className="mt-auto w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-3.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
      >
        Finish onboarding
      </button>
    </div>
  );
}
