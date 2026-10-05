'use server';

import crypto from 'node:crypto';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/api/supabase/server';
import { validateLeadInput, type CreateLeadInput } from '@/entities/lead';

export interface SubmitLeadState {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  remainingQuota?: number;
}

export async function submitLeadAction(
  prevState: SubmitLeadState | null,
  formData: FormData
): Promise<SubmitLeadState> {
  const name = formData.get('name') as string;
  const email = (formData.get('email') as string) || undefined;
  const whatsapp = (formData.get('whatsapp') as string) || undefined;
  const sourceCta = (formData.get('source_cta') as string) || undefined;
  const productId = (formData.get('product_id') as string)?.trim() || undefined;
  const utmSource = (formData.get('utm_source') as string) || undefined;
  const utmMedium = (formData.get('utm_medium') as string) || undefined;
  const utmCampaign = (formData.get('utm_campaign') as string) || undefined;
  const landingPath = (formData.get('landing_path') as string) || undefined;
  const referrer = (formData.get('referrer') as string) || undefined;

  const rawInput: CreateLeadInput = {
    name,
    email,
    whatsapp,
    source_cta: sourceCta,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    landing_path: landingPath,
    referrer,
  };

  // Validasi input
  const validation = validateLeadInput(rawInput);
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
      message: 'Mohon periksa kembali data yang Anda masukkan.',
    };
  }

  // Dapatkan IP pengguna untuk hashing anti-spam
  const headerList = await headers();
  const forwardedFor = headerList.get('x-forwarded-for');
  const realIp = headerList.get('x-real-ip');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

  // Buat IP Hash aman (sha256)
  const salt = process.env.LEAD_IP_SALT || 'kodeva-salt-secure-2026';
  const ipHash = crypto
    .createHash('sha256')
    .update(`${clientIp}:${salt}`)
    .digest('hex');

  const supabase = await createServerClient();

  // Pengurangan kuota promo atomik (mengatasi race condition di level DB) jika terkait produk promo
  let promoSuccessNote = '';
  let updatedRemaining: number | undefined;

  if (productId) {
    type ClaimRpcResponse = { success: boolean; remaining?: number; error?: string };
    const { data: claimData, error: claimError } = await supabase.rpc(
      'claim_product_promo_quota',
      {
        p_product_id: productId,
        p_qty: 1,
      }
    );

    if (claimError) {
      console.error('Error claiming promo quota RPC:', claimError.message);
    } else {
      const claimResult = claimData as unknown as ClaimRpcResponse;
      if (claimResult && !claimResult.success) {
        return {
          success: false,
          message: claimResult.error || 'Mohon maaf, kuota promo untuk produk ini baru saja habis.',
        };
      }
      if (claimResult?.remaining !== undefined) {
        updatedRemaining = claimResult.remaining;
        promoSuccessNote = ` 1 kuota promo berhasil diamankan untuk Anda (Sisa kuota: ${claimResult.remaining}).`;
      }
      revalidatePath('/');
      revalidatePath('/produk');
      revalidatePath('/produk/[slug]');
    }
  }

  const { error } = await supabase.from('leads').insert({
    name: rawInput.name.trim(),
    email: rawInput.email?.trim() || null,
    whatsapp: rawInput.whatsapp?.trim() || null,
    source_cta: rawInput.source_cta || 'landing_page',
    utm_source: rawInput.utm_source || null,
    utm_medium: rawInput.utm_medium || null,
    utm_campaign: rawInput.utm_campaign || null,
    landing_path: rawInput.landing_path || null,
    referrer: rawInput.referrer || null,
    ip_hash: ipHash,
  });

  if (error) {
    console.error('Lead submission error:', error.message);

    if (error.message.includes('lead_rate_limited')) {
      return {
        success: false,
        message:
          'Anda telah mencapai batas pengiriman penawaran (maks. 5 kali/jam). Silakan hubungi kami via WhatsApp langsung jika mendesak.',
      };
    }

    if (error.message.includes('lead_duplicate')) {
      return {
        success: true, // Beri feedback ramah
        message:
          'Permintaan penawaran dengan kontak Anda sudah terdaftar dalam 24 jam terakhir. Konsultan kami akan segera menghubungi Anda!',
      };
    }

    return {
      success: false,
      message: 'Terjadi kendala saat mengirimkan penawaran. Silakan coba kembali nanti.',
    };
  }

  return {
    success: true,
    message: `Terima kasih! Permintaan penawaran Anda telah berhasil kami terima.${promoSuccessNote}`,
    remainingQuota: updatedRemaining,
  };
}
