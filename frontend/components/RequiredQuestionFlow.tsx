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
    text: 'If you could have an animal follow you around, what kind of animal would it be and why?',
  },
  {
    id: 'dat',
    text: 'Quick creativity check: name 10 words as different from each other as possible.',
    kind: 'dat',
  },
  {
    id: 'color',
    text: "What's your favorite color, why, and how does it make you feel?",
  },
  {
    id: 'event_goals',
    text: 'What do you want from this event/profile, and what should people know about you?',
  },
];

export const FOLLOW_UP_QUESTIONS: FlowQuestion[] = [
  {
    id: 'hope_to_find',
    text: 'Who are you hoping your agent finds for you?',
  },
  {
    id: 'can_help_15min',
    text: 'What can you help people with in 15 minutes?',
  },
  {
    id: 'never_share',
    text: 'What should your agent never share?',
  },
];

interface RequiredQuestionFlowProps {
  initialAnswers?: Record<string, string>;
  hasPastedContext: boolean;
  skippedIntake: boolean;
  onComplete: (answers: Record<string, string>) => void;
}

export function RequiredQuestionFlow({
  initialAnswers = {},
  hasPastedContext,
  skippedIntake,
  onComplete,
}: RequiredQuestionFlowProps) {
  const allQuestions = [...REQUIRED_QUESTIONS, ...FOLLOW_UP_QUESTIONS];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [input, setInput] = useState(initialAnswers[allQuestions[0]?.id] ?? '');

  const current = allQuestions[step];
  const isFollowUp = step >= REQUIRED_QUESTIONS.length;
  const canSkipFollowUp = hasPastedContext && !skippedIntake;
  const totalSteps = allQuestions.length;
  const progress = ((step + 1) / totalSteps) * 100;

  function handleContinue() {
    const trimmed = input.trim();
    if (!trimmed && !(isFollowUp && canSkipFollowUp)) return;
    advance({ ...answers, [current.id]: trimmed });
  }

  function advance(nextAnswers: Record<string, string>) {
    setAnswers(nextAnswers);
    if (step >= totalSteps - 1) {
      onComplete(nextAnswers);
      return;
    }
    const nextStep = step + 1;
    setStep(nextStep);
    setInput(nextAnswers[allQuestions[nextStep].id] ?? '');
  }

  function handleDatComplete(words: string[]) {
    advance({ ...answers, [current.id]: words.join(', ') });
  }

  function handleDatSkip() {
    advance({ ...answers });
  }

  function handleSkipFollowUp() {
    if (!isFollowUp || !canSkipFollowUp) return;
    advance({ ...answers });
  }

  return (
    <div className="flex flex-col gap-6 flex-1">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>
            Question {step + 1} of {totalSteps}
            {step < REQUIRED_QUESTIONS.length ? ' (required)' : ' (follow-up)'}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
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
            <h2 className="text-xl font-semibold text-white leading-snug">{current.text}</h2>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your answer..."
              rows={5}
              className="w-full px-4 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={handleContinue}
              disabled={!input.trim() && !(isFollowUp && canSkipFollowUp)}
              className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold hover:bg-violet-500 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
            >
              {step >= totalSteps - 1 ? 'See twin preview' : 'Next'}
              <ArrowRight className="w-5 h-5" />
            </button>

            {isFollowUp && canSkipFollowUp && (
              <button
                onClick={handleSkipFollowUp}
                className="w-full py-3 rounded-2xl text-zinc-500 text-sm hover:text-zinc-300 transition-colors flex items-center justify-center gap-2"
              >
                <SkipForward className="w-4 h-4" />
                Skip this question
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
