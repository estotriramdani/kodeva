import type { CreateLeadInput } from './types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateLeadInput(input: CreateLeadInput): ValidationResult {
  const errors: Record<string, string> = {};

  const name = input.name?.trim() || '';
  if (name.length < 2 || name.length > 80) {
    errors.name = 'Nama harus memiliki panjang antara 2 hingga 80 karakter.';
  }

  const email = input.email?.trim();
  const whatsapp = input.whatsapp?.trim();

  if (!email && !whatsapp) {
    errors.contact = 'Harap isi minimal nomor WhatsApp atau alamat Email.';
  }

  if (email) {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (email.length > 254 || !emailRegex.test(email)) {
      errors.email = 'Format alamat email tidak valid.';
    }
  }

  if (whatsapp) {
    const waRegex = /^\+?[0-9]{8,15}$/;
    if (!waRegex.test(whatsapp)) {
      errors.whatsapp = 'Format nomor WhatsApp tidak valid (contoh: 08123456789 atau +628123456789).';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
