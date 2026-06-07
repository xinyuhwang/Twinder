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

  if (!ready) return null;

  const hasPastedContext = Boolean(localStore.getRawContext()?.trim());
  const skippedIntake = localStore.getSkippedIntake();

  function handleComplete(answers: Record<string, string>) {
    localStore.setOnboardingAnswers(answers);
    router.push('/onboarding/preview');
  }

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen px-6 py-10 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">A few quick questions</h1>
          <p className="text-zinc-500 text-sm">
            Playful, fast, and revealing. Your agent uses these to sound like you.
          </p>
        </div>

        <RequiredQuestionFlow
          initialAnswers={localStore.getOnboardingAnswers() ?? undefined}
          hasPastedContext={hasPastedContext}
          skippedIntake={skippedIntake}
          onComplete={handleComplete}
        />
      </div>
    </MobileShell>
  );
}
