import React from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { FloatingCartButton } from '@/widgets/cart-drawer';

const CartDrawer = dynamic(
  () => import('@/widgets/cart-drawer').then((m) => m.CartDrawer)
);

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

