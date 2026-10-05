'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/shared/ui';

export interface ProductSearchBarProps {
  placeholder?: string;
  defaultValue?: string;
}

export function ProductSearchBar({
  placeholder = 'Cari software, ERP, POS, CRM...',
  defaultValue = '',
}: ProductSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    } else {
      params.delete('q');
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md">
      <div className="relative flex items-center">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="pr-12"
        />
        <button
          type="submit"
          aria-label="Cari"
          className="absolute right-3.5 text-stone-gray hover:text-ink-black transition-colors flex items-center justify-center cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
