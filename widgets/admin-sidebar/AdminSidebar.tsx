'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  Package,
  FileText,
  Tag,
  ExternalLink,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { cn } from '@/shared/lib';
import { logoutAction } from '@/features/auth';

export interface AdminSidebarProps {
  adminEmail?: string;
  adminRole?: string;
}

export function AdminSidebar({
  adminEmail = 'admin@kodeva.id',
  adminRole = 'Administrator',
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      href: '/admin/dashboard',
      label: 'Prospek & Leads',
      icon: LayoutDashboard,
      badge: 'Utama',
    },
    {
      href: '/admin/landing',
      label: 'Konten Landing',
      icon: Palette,
    },
    {
      href: '/admin/products',
      label: 'Katalog Produk',
      icon: Package,
    },
    {
      href: '/admin/articles',
      label: 'Artikel & Blog',
      icon: FileText,
    },
    {
      href: '/admin/categories',
      label: 'Kategori',
      icon: Tag,
    },
  ];

  return (
    <>
      {/* Top Mobile Bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-pure-white border-b border-hairline-mist">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] bg-fresh-grass flex items-center justify-center font-bold text-ink-black text-sm">
            K
          </div>
          <span className="font-semibold text-ink-black text-[16px]">
            Kodeva Admin
          </span>
        </Link>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-9 h-9 rounded-full bg-cream-paper text-ink-black flex items-center justify-center transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-ink-black/40 backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-screen w-72 p-5 flex flex-col justify-between bg-pure-white border-r border-hairline-mist transition-transform duration-200 ease-in-out lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div>
          {/* Brand Logo & Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-hairline-mist/70">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 group"
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="w-10 h-10 rounded-[14px] bg-fresh-grass flex items-center justify-center font-bold text-ink-black text-lg transition-transform group-hover:scale-105">
                K
              </div>
              <div>
                <span className="text-[17px] font-bold text-ink-black block leading-none">
                  Kodeva
                </span>
                <span className="text-[12px] text-stone-gray font-medium">
                  Admin Workspace
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-stone-gray hover:text-ink-black transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-gray/80 px-3 block mb-2">
              Menu Utama
            </span>
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin/dashboard'
                  ? pathname === '/admin/dashboard'
                  : pathname.startsWith(item.href);

              const IconComponent = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-[18px] text-[15px] font-medium transition-all',
                    isActive
                      ? 'bg-ink-black text-pure-white font-semibold'
                      : 'text-ink-black/80 hover:bg-cream-paper hover:text-ink-black'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        'text-[11px] px-2 py-0.5 rounded-full font-medium',
                        isActive
                          ? 'bg-fresh-grass text-ink-black'
                          : 'bg-sandstone text-ink-black'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="pt-6 border-t border-hairline-mist/70 space-y-4">
          {/* Quick link to public website */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-[16px] text-[13px] text-ink-black/80 bg-cream-paper/70 hover:bg-cream-paper transition-colors font-medium"
          >
            <span className="inline-flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-stone-gray" />
              <span>Buka Website Publik</span>
            </span>
            <span className="text-[11px] text-stone-gray">Tab Baru</span>
          </Link>

          {/* Profile Card */}
          <div className="p-3 bg-sandstone/40 rounded-[20px] border border-hairline-mist/50">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-full bg-fresh-grass text-ink-black flex items-center justify-center font-bold text-xs uppercase">
                {adminEmail.slice(0, 2)}
              </div>
              <div className="overflow-hidden">
                <span className="text-[13px] font-semibold text-ink-black block truncate">
                  {adminEmail}
                </span>
                <span className="text-[11px] text-stone-gray font-medium capitalize">
                  {adminRole}
                </span>
              </div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-[12px] bg-pure-white text-[13px] font-medium text-coral-pop hover:bg-coral-pop/10 border border-hairline-mist transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar (Logout)</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
