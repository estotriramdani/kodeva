import React from 'react';
import { cn } from '@/shared/lib';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[14px] font-medium text-ink-black"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'w-full bg-pure-white text-ink-black placeholder:text-stone-gray/60 px-4 py-3 rounded-[20px] border border-hairline-mist focus:border-fresh-grass focus:outline-none focus:ring-2 focus:ring-fresh-grass/20 transition-all text-[15px]',
            error && 'border-coral-pop focus:border-coral-pop focus:ring-coral-pop/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[13px] text-coral-pop font-medium mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, rows = 4, ...props }, ref) => {
    const textareaId = id || React.useId();

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-[14px] font-medium text-ink-black"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          rows={rows}
          ref={ref}
          className={cn(
            'w-full bg-pure-white text-ink-black placeholder:text-stone-gray/60 px-4 py-3 rounded-[20px] border border-hairline-mist focus:border-fresh-grass focus:outline-none focus:ring-2 focus:ring-fresh-grass/20 transition-all text-[15px] resize-y',
            error && 'border-coral-pop focus:border-coral-pop focus:ring-coral-pop/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[13px] text-coral-pop font-medium mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
