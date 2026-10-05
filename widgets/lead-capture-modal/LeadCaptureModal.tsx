'use client';

import React from 'react';
import { Modal } from '@/shared/ui';
import { LeadForm } from '@/features/submit-lead';

export interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  sourceCta?: string;
  productName?: string;
}

export function LeadCaptureModal({
  isOpen,
  onClose,
  title = 'Minta Penawaran Resmi',
  description = 'Isi formulir singkat ini, konsultan Kodeva akan segera mengirimkan estimasi biaya lisensi dan diskon yang tersedia.',
  sourceCta = 'general_modal',
  productName,
}: LeadCaptureModalProps) {
  const dynamicTitle = productName ? `Penawaran untuk ${productName}` : title;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dynamicTitle}
      description={description}
    >
      <LeadForm
        sourceCta={sourceCta}
        onSuccess={onClose}
        submitButtonText="Kirim Permintaan Sekarang"
      />
    </Modal>
  );
}
