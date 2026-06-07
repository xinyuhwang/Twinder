'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/MobileShell';
import { RequiredQuestionFlow } from '@/components/RequiredQuestionFlow';
import { localStore } from '@/lib/local-store';

export default function OnboardingQuestions() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStore.getToken()) {
      router.replace('/demo');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return (
      <MobileShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
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
    router.push('/arena');
  }

  return (
    <MobileShell>
      <div className="flex min-h-screen flex-col gap-4 px-6 py-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">A few quick questions</h1>
          <p className="text-sm text-zinc-500">
            Playful, fast, and revealing. Your agent uses these to sound like you.
          </p>
        </div>

        <RequiredQuestionFlow
          initialAnswers={localStore.getOnboardingAnswers() ?? undefined}
          onComplete={handleComplete}
          onFinishEarly={handleFinishEarly}
        />
      </div>
    </MobileShell>
  );
}
