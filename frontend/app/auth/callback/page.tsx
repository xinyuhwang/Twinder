'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { localStore } from '@/lib/local-store';
import { api } from '@/lib/api';
import { consumePostAuthRedirect } from '@/lib/auth';

function AuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStore.setToken(token);
      localStore.setAuthMethod('google');
      api
        .getMe(token)
        .then(user => {
          localStore.setUserId(user.id);
          localStore.setUserName(user.name);
          router.push(consumePostAuthRedirect());
        })
        .catch(() => router.push('/demo'));
    } else {
      router.push('/demo');
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-muted">
      Signing in...
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Signing in...</div>}>
      <AuthCallbackInner />
    </Suspense>
  );
}
