'use client';

import React, { useState } from 'react';
import { Button, Modal } from '@/shared/ui';
import { LeadForm } from '@/features/submit-lead';

export interface ClaimPromoButtonProps {
  productName: string;
  planTier?: string;
  quotaRemaining?: number;
  className?: string;
}

export function ClaimPromoButton({
  productName,
  planTier,
  quotaRemaining,
  className,
}: ClaimPromoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tierTitle = planTier ? `Paket ${planTier.toUpperCase()}` : '';
  const sourceCta = `promo_${productName.toLowerCase().replace(/\s+/g, '_')}${planTier ? `_${planTier}` : ''}`;

  return (
    <>
      <Button
        variant="coral-pill"
        size="md"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        Klaim Promo {tierTitle}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Klaim Promo ${productName}`}
        description={
          quotaRemaining && quotaRemaining > 0
            ? `Tersisa ${quotaRemaining} kuota diskon untuk promo ini. Isi kontak Anda di bawah:`
            : `Dapatkan penawaran harga diskon khusus untuk ${productName} ${tierTitle}:`
        }
      >
        <LeadForm
          sourceCta={sourceCta}
          onSuccess={() => setIsOpen(false)}
          submitButtonText="Amankan Kuota Promo Sekarang"
        />
      </Modal>
    </>
  );
}
