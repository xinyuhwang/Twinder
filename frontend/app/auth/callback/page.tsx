'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { localStore } from '@/lib/local-store';
import { api } from '@/lib/api';

function AuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStore.setToken(token);
      api
        .getMe(token)
        .then(user => {
          localStore.setUserId(user.id);
          localStore.setUserName(user.name);
          router.push('/arena');
        })
        .catch(() => router.push('/demo'));
    } else {
      router.push('/demo');
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-zinc-400">
      Signing in...
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-zinc-400">Signing in...</div>}>
      <AuthCallbackInner />
    </Suspense>
  );
}
