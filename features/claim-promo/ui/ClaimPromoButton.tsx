'use client';

import React, { useState, useCallback } from 'react';
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

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const tierTitle = planTier ? `Paket ${planTier.toUpperCase()}` : '';
  const sourceCta = `promo_${productName.toLowerCase().replace(/\s+/g, '_')}${planTier ? `_${planTier}` : ''}`;

  return (
    <>
      <Button
        variant="coral-pill"
        size="md"
        onClick={handleOpen}
        className={className}
      >
        Klaim Promo {tierTitle}
      </Button>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={handleClose}
          title={`Klaim Promo ${productName}`}
          description={
            quotaRemaining && quotaRemaining > 0
              ? `Tersisa ${quotaRemaining} kuota diskon untuk promo ini. Isi kontak Anda di bawah:`
              : `Dapatkan penawaran harga diskon khusus untuk ${productName} ${tierTitle}:`
          }
        >
          <LeadForm
            sourceCta={sourceCta}
            onSuccess={handleClose}
            submitButtonText="Amankan Kuota Promo Sekarang"
          />
        </Modal>
      )}
    </>
  );
}
