'use client';

import React, { useActionState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button, Input } from '@/shared/ui';
import { getStoredUtmParams } from '@/shared/lib/utm';
import { submitLeadAction, type SubmitLeadState } from '../api/submit-lead.action';

export interface LeadFormProps {
  sourceCta?: string;
  productId?: string;
  onSuccess?: () => void;
  submitButtonText?: string;
  className?: string;
}

const initialState: SubmitLeadState = {
  success: false,
};

const emptySubscribe = () => () => {};

export function LeadForm({
  sourceCta = 'website_cta',
  productId,
  onSuccess,
  submitButtonText = 'Minta Penawaran Harga',
  className,
}: LeadFormProps) {
  const [state, formAction, isPending] = useActionState(submitLeadAction, initialState);
  const utm = React.useSyncExternalStore<ReturnType<typeof getStoredUtmParams>>(
    emptySubscribe,
    getStoredUtmParams,
    () => ({})
  );

  const onSuccessRef = React.useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  });

  useEffect(() => {
    if (state.success && onSuccessRef.current) {
      const timer = setTimeout(() => {
        onSuccessRef.current?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

  if (state.success) {
    return (
      <div className="text-center py-6 px-4 bg-fresh-grass/15 rounded-[24px] border border-fresh-grass/40">
        <CheckCircle2 className="w-9 h-9 text-fresh-grass mx-auto mb-2" />
        <h4 className="text-[20px] font-semibold text-ink-black mb-1">
          Permintaan Terkirim!
        </h4>
        <p className="text-[14px] text-ink-black/80 max-w-sm mx-auto leading-relaxed">
          {state.message || 'Tim kami akan segera menghubungi Anda melalui kontak yang Anda cantumkan.'}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className={`space-y-4 ${className || ''}`}>
      <input type="hidden" name="source_cta" value={sourceCta} />
      <input type="hidden" name="product_id" value={productId || ''} />
      <input
        type="hidden"
        name="landing_path"
        value={typeof window !== 'undefined' ? window.location.pathname : ''}
      />
      <input
        type="hidden"
        name="referrer"
        value={typeof document !== 'undefined' ? document.referrer : ''}
      />
      <input type="hidden" name="utm_source" value={utm.utm_source || ''} />
      <input type="hidden" name="utm_medium" value={utm.utm_medium || ''} />
      <input type="hidden" name="utm_campaign" value={utm.utm_campaign || ''} />
      <input type="hidden" name="utm_term" value={utm.utm_term || ''} />
      <input type="hidden" name="utm_content" value={utm.utm_content || ''} />

      {state.message && !state.success && (
        <div className="p-3.5 rounded-[16px] bg-coral-pop/10 text-coral-pop text-[14px] border border-coral-pop/20 font-medium">
          {state.message}
        </div>
      )}

      {/* Nama Lengkap */}
      <Input
        name="name"
        label="Nama Lengkap *"
        placeholder="Contoh: Budi Pratama"
        required
        error={state.errors?.name}
        disabled={isPending}
      />

      {/* Nomor WhatsApp */}
      <Input
        name="whatsapp"
        type="tel"
        label="Nomor WhatsApp *"
        placeholder="Contoh: 081234567890"
        error={state.errors?.whatsapp || state.errors?.contact}
        disabled={isPending}
      />

      {/* Email */}
      <Input
        name="email"
        type="email"
        label="Alamat Email (Opsional)"
        placeholder="nama@perusahaan.com"
        error={state.errors?.email}
        disabled={isPending}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="coral-pill"
          size="lg"
          disabled={isPending}
          className="w-full justify-center"
        >
          {isPending ? 'Mengirimkan...' : submitButtonText}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[12px] text-stone-gray text-center leading-tight">
        <ShieldCheck className="w-3.5 h-3.5 text-stone-gray/80" />
        <span>Data kontak Anda aman dan hanya digunakan untuk keperluan penawaran resmi.</span>
      </div>
    </form>
  );
}
