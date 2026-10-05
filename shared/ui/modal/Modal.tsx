'use client';

import React, { useEffect } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-black/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full bg-pure-white rounded-[50px] p-6 sm:p-10 z-10 transition-all transform scale-100 border border-hairline-mist',
          maxWidthClasses[maxWidth]
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Tutup"
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-cream-paper text-ink-black hover:bg-sandstone flex items-center justify-center text-lg font-medium transition-colors"
        >
          ✕
        </button>

        {title && (
          <div className="mb-6 pr-8">
            <h3 className="text-[26px] sm:text-[30px] font-medium leading-tight text-ink-black">
              {title}
            </h3>
            {description && (
              <p className="text-[15px] text-stone-gray mt-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
