'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-black/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full bg-pure-white rounded-[32px] sm:rounded-[44px] z-10 transition-all transform scale-100 border border-hairline-mist shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150',
          maxWidthClasses[maxWidth]
        )}
      >
        {/* Modal Header (Sticky at top) */}
        {title || description ? (
          <div className="shrink-0 px-6 sm:px-10 pt-6 sm:pt-8 pb-4 border-b border-hairline-mist/60 bg-pure-white flex items-start justify-between gap-4">
            <div className="pr-2">
              {title && (
                <h3 className="text-[22px] sm:text-[28px] font-semibold leading-tight text-ink-black">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-[14px] sm:text-[15px] text-stone-gray mt-1.5 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              type="button"
              aria-label="Tutup"
              className="shrink-0 w-9 h-9 rounded-full bg-cream-paper text-ink-black hover:bg-sandstone flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="shrink-0 flex justify-end p-4 pb-0">
            <button
              onClick={onClose}
              type="button"
              aria-label="Tutup"
              className="w-9 h-9 rounded-full bg-cream-paper text-ink-black hover:bg-sandstone flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Body (Scrollable inside modal) */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
