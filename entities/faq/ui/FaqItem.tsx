'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib';
import type { Faq } from '../model/types';

export interface FaqItemProps {
  faq: Faq;
  defaultOpen?: boolean;
}

export function FaqItem({ faq, defaultOpen = false }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-pure-white rounded-[30px] p-6 sm:p-7 border border-hairline-mist transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center justify-between gap-4 cursor-pointer select-none"
        aria-expanded={isOpen}
      >
        <span className="text-[18px] sm:text-[20px] font-medium text-ink-black leading-snug">
          {faq.question}
        </span>
        <span
          className={cn(
            'w-8 h-8 rounded-full bg-cream-paper flex items-center justify-center text-lg text-ink-black shrink-0 transition-transform duration-200',
            isOpen && 'rotate-45'
          )}
        >
          +
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-hairline-mist/50 text-[15px] sm:text-[16px] text-stone-gray leading-relaxed">
          {faq.answer}
        </div>
      )}
    </div>
  );
}
