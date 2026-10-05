'use client';

import React, { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Input } from '@/shared/ui';
import { loginAction, type AuthState } from '../api/auth.actions';

const initialState: AuthState = {};

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin/dashboard';
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      {state?.error && (
        <div className="p-3.5 rounded-[16px] bg-coral-pop/10 text-coral-pop text-[14px] border border-coral-pop/20 font-medium">
          {state.error}
        </div>
      )}

      <Input
        name="email"
        type="email"
        label="Alamat Email"
        placeholder="admin@kodeva.id"
        required
        disabled={isPending}
      />

      <Input
        name="password"
        type="password"
        label="Kata Sandi"
        placeholder="••••••••"
        required
        disabled={isPending}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="grass-pill"
          size="lg"
          disabled={isPending}
          className="w-full justify-center"
        >
          {isPending ? 'Memproses Masuk...' : 'Masuk ke Dashboard'}
        </Button>
      </div>
    </form>
  );
}
