'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { localStore } from '@/lib/local-store';
import { OnboardingAnswers } from '@/types';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'animal' as keyof OnboardingAnswers,
    question: 'If you could have an animal follow you around, what kind of animal would it be and why?',
    placeholder: 'A crow, because they remember faces and hold grudges. Same energy.',
    required: true,
  },
  {
    id: 'color' as keyof OnboardingAnswers,
    question: "What's your favorite color, why, and how does it make you feel?",
    placeholder: 'Deep navy. It feels like the moment before something important happens.',
    required: true,
  },
  {
    id: 'eventGoal' as keyof OnboardingAnswers,
    question: "What do you want from this event, and what should people know about you?",
    placeholder: "I'm building agent infrastructure for social apps and I want collaborators who move fast.",
    required: true,
  },
  {
    id: 'lookingFor' as keyof OnboardingAnswers,
    question: 'Who are you hoping your agent finds for you?',
    placeholder: 'Designers with product taste, or builders who care about emotional UX.',
    required: false,
  },
  {
    id: 'canHelp' as keyof OnboardingAnswers,
    question: 'What can you help someone with in 15 minutes?',
    placeholder: 'I can turn a vague product idea into a demo pitch.',
    required: false,
  },
  {
    id: 'neverShare' as keyof OnboardingAnswers,
    question: "What should your agent never share?",
    placeholder: 'Anything about my current employer or ongoing contract work.',
    required: false,
  },
];

export default function Questions() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(localStore.getOnboardingAnswers());

  const q = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const isRequired = q.required;
  const currentAnswer = (answers[q.id] as string) ?? '';
  const canProceed = !isRequired || currentAnswer.trim().length > 0;

  function handleNext() {
    localStore.setOnboardingAnswers(answers);
    if (isLast) {
      router.push('/onboarding/preview');
    } else {
      setStep(s => s + 1);
    }
  }

  function handleSkip() {
    if (isLast) {
      router.push('/onboarding/preview');
    } else {
      setStep(s => s + 1);
    }
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-10">
        <button
          onClick={() => step > 0 ? setStep(s => s - 1) : router.back()}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex gap-1">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-violet-500' : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-zinc-500">{step + 1}/{QUESTIONS.length}</span>
      </div>

      {/* Question */}
      <div className="flex-1 space-y-8">
        <div className="space-y-2">
          {isRequired && (
            <span className="text-xs text-violet-400 uppercase tracking-wider">Required</span>
          )}
          {!isRequired && (
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Optional</span>
          )}
          <h2 className="text-xl font-semibold text-white leading-snug">{q.question}</h2>
        </div>

        <textarea
          value={currentAnswer}
          onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
          placeholder={q.placeholder}
          rows={5}
          autoFocus
          className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors resize-none text-sm leading-relaxed"
        />

        <p className="text-xs text-zinc-600">
          Your answer helps your twin understand how you think and communicate — not just what you do.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-8">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="w-full py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLast ? 'Preview my twin' : 'Next'}
          <ArrowRight className="w-5 h-5" />
        </button>
        {!isRequired && (
          <button
            onClick={handleSkip}
            className="w-full py-3 text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
          >
            Skip this question
          </button>
        )}
      </div>
    </div>
  );
}
