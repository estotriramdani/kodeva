'use client';

import React, { useState, useCallback } from 'react';
import { Tag } from 'lucide-react';
import { Button, Modal } from '@/shared/ui';
import { LeadForm } from '@/features/submit-lead';
import { trackLandingCta } from '@/shared/lib/analytics';

export interface ClaimPromoButtonProps {
  productName: string;
  productId?: string;
  planTier?: string;
  quotaRemaining?: number;
  className?: string;
}

export function ClaimPromoButton({
  productName,
  productId,
  planTier,
  quotaRemaining,
  className,
}: ClaimPromoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    trackLandingCta(`Klaim Promo: ${productName}${planTier ? ` (${planTier})` : ''}`, 'claim_promo_button', '#promo_modal');
    setIsOpen(true);
  }, [productName, planTier]);
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
        <span className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" />
          <span>Klaim Promo {tierTitle}</span>
        </span>
      </Button>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={handleClose}
          title={`Klaim Promo ${productName}`}
          description={
            quotaRemaining && quotaRemaining > 0
              ? `Tersisa ${quotaRemaining} kuota diskon untuk promo ini. Isi kontak Anda di bawah untuk mengamankan 1 kuota promo:`
              : `Dapatkan penawaran harga diskon khusus untuk ${productName} ${tierTitle}:`
          }
        >
          <LeadForm
            sourceCta={sourceCta}
            productId={productId}
            onSuccess={handleClose}
            submitButtonText="Amankan Kuota Promo Sekarang"
          />
        </Modal>
      )}
    </>
  );
}
