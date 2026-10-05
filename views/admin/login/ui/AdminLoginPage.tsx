import React from 'react';
import { Card, Container } from '@/shared/ui';
import { LoginForm } from '@/features/auth';

export function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Container className="max-w-md">
        <Card surface="white" className="p-8 sm:p-10 border border-hairline-mist shadow-xs">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-[16px] bg-fresh-grass flex items-center justify-center font-bold text-ink-black text-2xl mx-auto mb-3">
              K
            </div>
            <h1 className="text-[26px] font-semibold text-ink-black">
              Login Admin Kodeva
            </h1>
            <p className="text-[14px] text-stone-gray mt-1">
              Masuk untuk mengelola data lead dan katalog produk.
            </p>
          </div>

          <LoginForm />
        </Card>
      </Container>
    </div>
  );
}
