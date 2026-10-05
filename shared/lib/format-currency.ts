/**
 * Format angka ke format mata uang Rupiah (IDR).
 * Contoh: 150000 -> "Rp 150.000"
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format harga paket dengan unit.
 * Contoh: (150000, 'user') -> "Rp 150.000 / user / bulan"
 */
export function formatPlanPrice(amount: number, unit: string = 'user'): string {
  return `${formatIDR(amount)} / ${unit} / bulan`;
}
