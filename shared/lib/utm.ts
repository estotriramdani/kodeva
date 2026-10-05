'use client';

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_path?: string;
  captured_at?: string;
}

const STORAGE_KEY = 'kodeva_utm_attribution_v1';

/**
 * Tangkap parameter UTM dari URL saat ini dan simpan ke sessionStorage.
 * Jika parameter sudah tersimpan sebelumnya pada sesi ini, pertahankan sumber awal (first-touch attribution).
 */
export function captureUtmParams(): UtmParams | null {
  if (typeof window === 'undefined') return null;

  try {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');
    const utmTerm = searchParams.get('utm_term');
    const utmContent = searchParams.get('utm_content');

    // Cek apakah ada UTM baru di URL
    if (utmSource || utmMedium || utmCampaign || utmTerm || utmContent) {
      const newUtm: UtmParams = {
        utm_source: utmSource || undefined,
        utm_medium: utmMedium || undefined,
        utm_campaign: utmCampaign || undefined,
        utm_term: utmTerm || undefined,
        utm_content: utmContent || undefined,
        referrer: document.referrer || undefined,
        landing_path: window.location.pathname,
        captured_at: new Date().toISOString(),
      };

      // Simpan di sessionStorage
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newUtm));
      return newUtm;
    }

    // Jika tidak ada UTM di URL, ambil dari sessionStorage yang sudah tersimpan
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as UtmParams;
    }
  } catch (err) {
    console.error('Error handling UTM attribution:', err);
  }

  return null;
}

/**
 * Ambil parameter UTM aktif dari sessionStorage.
 */
export function getStoredUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as UtmParams;
    }
  } catch (err) {
    console.error('Error reading stored UTM params:', err);
  }

  return {};
}
