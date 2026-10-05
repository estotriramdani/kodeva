import React from 'react';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { CartDrawer, FloatingCartButton } from '@/widgets/cart-drawer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
    </div>
  );
}

