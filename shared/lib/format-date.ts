/**
 * Format string tanggal ISO ke format Indonesia.
 * Contoh: "2026-10-05T19:00:00Z" -> "5 Oktober 2026"
 */
export function formatDateID(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}
