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
    id: 'event_goals',
    text: 'What do you want from this event, and what should people know about you?',
  },
  {
    id: 'dat',
    text: 'Name 10 words as different from each other as you can — we use the spread to gauge creative range for better matches.',
    kind: 'dat',
  },
  {
    id: 'belief_changed',
    text: "What's something you were completely wrong about that changed how you think?",
  },
  {
    id: 'help_others',
    text: 'When someone around you is struggling, what do you actually do?',
  },
];

interface RequiredQuestionFlowProps {
  initialAnswers?: Record<string, string>;
  onComplete: (answers: Record<string, string>) => void;
  onFinishEarly?: (answers: Record<string, string>) => void;
  questions?: FlowQuestion[];
}

export function RequiredQuestionFlow({
  initialAnswers = {},
  onComplete,
  onFinishEarly,
  questions,
}: RequiredQuestionFlowProps) {
  const questionList = questions ?? REQUIRED_QUESTIONS;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [input, setInput] = useState(initialAnswers[questionList[0]?.id] ?? '');

  const current = questionList[step];
  const totalSteps = questionList.length;
  const progress = ((step + 1) / totalSteps) * 100;
  const isLast = step >= totalSteps - 1;
  const eventGoalsAnswered = (answers['event_goals'] ?? '').trim().length > 0;
  const currentIsEventGoals = current.id === 'event_goals' && input.trim().length > 0;
  const canFinish = eventGoalsAnswered || currentIsEventGoals;

  function advance(nextAnswers: Record<string, string>) {
    setAnswers(nextAnswers);
    if (step >= totalSteps - 1) {
      onComplete(nextAnswers);
      return;
    }
    const nextStep = step + 1;
    setStep(nextStep);
    setInput(nextAnswers[questionList[nextStep].id] ?? '');
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
    if (!canFinish) return;
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
        <div className="flex items-center justify-between text-xs text-subtle">
          <span>Question {step + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-solid to-aura-blush transition-all duration-300"
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
            <h2 className="text-xl font-semibold leading-snug text-primary">{current.text}</h2>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your answer..."
              rows={5}
              className="field-textarea"
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={handleContinue}
              disabled={!input.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-solid py-4 font-semibold text-accent-fg transition-colors hover:bg-accent-solid-hover disabled:opacity-40"
            >
              {isLast ? 'See twin preview' : 'Continue'}
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={handleSkip}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm text-subtle transition-colors hover:text-secondary"
            >
              <SkipForward className="h-4 w-4" />
              Skip this question
            </button>
          </div>
        </>
      )}

      <button
        onClick={handleFinishEarly}
        disabled={!canFinish}
        className="mt-auto w-full rounded-2xl border border-border bg-surface py-3.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-secondary disabled:opacity-40"
      >
        {canFinish ? 'Finish onboarding' : 'Answer the event question to continue'}
      </button>
    </div>
  );
}
