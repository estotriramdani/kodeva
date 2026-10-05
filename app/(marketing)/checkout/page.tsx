import type { Metadata } from 'next';
import { CheckoutPage } from '@/views/checkout';

export const metadata: Metadata = {
  title: 'Checkout Lisensi Software',
  description: 'Selesaikan pemesanan lisensi software bisnis Kodeva dengan simulasi pembayaran instan dan aktivasi lisensi otomatis.',
};

export default function Page() {
  return <CheckoutPage />;
}
