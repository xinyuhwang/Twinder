'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/MobileShell';
import { RequiredQuestionFlow, type FlowQuestion } from '@/components/RequiredQuestionFlow';
import { localStore } from '@/lib/local-store';

const DAT_QUESTION: FlowQuestion = {
  id: 'dat',
  text: 'Quick creativity check: name 10 words as different from each other as possible.',
  kind: 'dat',
};

function buildDynamicQuestions(preflightQuestions: string[]): FlowQuestion[] {
  const textQuestions: FlowQuestion[] = preflightQuestions.map((q, i) => ({
    id: `q${i + 1}`,
    text: q,
  }));
  return [...textQuestions, DAT_QUESTION];
}

export default function OnboardingQuestions() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [dynamicQuestions, setDynamicQuestions] = useState<FlowQuestion[] | undefined>(undefined);

  useEffect(() => {
    if (!localStore.getToken()) {
      router.replace('/demo');
      return;
    }
    const preflight = localStore.getPreflightQuestions();
    if (preflight && preflight.length > 0) {
      setDynamicQuestions(buildDynamicQuestions(preflight));
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <MobileShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </MobileShell>
    );
  }

  function handleComplete(answers: Record<string, string>) {
    localStore.setOnboardingAnswers(answers);
    router.push('/onboarding/preview');
  }

  function handleFinishEarly(answers: Record<string, string>) {
    localStore.setOnboardingAnswers(answers);
    router.push('/onboarding/preview');
  }

  return (
    <MobileShell>
      <div className="flex min-h-screen flex-col gap-4 px-6 py-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">A few quick questions</h1>
          <p className="text-sm text-subtle">
            Playful, fast, and revealing. Your agent uses these to sound like you.
          </p>
        </div>

        <RequiredQuestionFlow
          initialAnswers={localStore.getOnboardingAnswers() ?? undefined}
          onComplete={handleComplete}
          onFinishEarly={handleFinishEarly}
          questions={dynamicQuestions}
        />
      </div>
    </MobileShell>
  );
}
