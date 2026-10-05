'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/entities/cart';
import { formatIDR } from '@/shared/lib';
import { Container, Button, Input, Badge } from '@/shared/ui';
import { getStoredUtmParams, type UtmParams } from '@/shared/lib/utm';
import { sendGA4Event } from '@/shared/lib/analytics';

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export function CheckoutPage() {
  const { items, summary, validation, clearCart, isHydrated } = useCart();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [company, setCompany] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'card'>('qris');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState<string | null>(null);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [orderResult, setOrderResult] = useState<{
    orderId: string;
    paidAt: string;
    totalPaid: number;
    buyer: { name: string; email: string; whatsapp: string; company?: string };
    items: typeof items;
    utm: UtmParams;
    paymentMethod: string;
  } | null>(null);

  const [utmParams, setUtmParams] = useState<UtmParams>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setUtmParams(getStoredUtmParams());
  }, []);

  // Voucher validation (Bonus feature)
  const handleApplyVoucher = () => {
    setVoucherMessage(null);
    const code = voucherCode.trim().toUpperCase();
    if (code === 'KODEVAHEMAT' || code === 'DISKONUMKM') {
      const discount = 50000;
      setVoucherDiscount(discount);
      setVoucherMessage(`Voucher ${code} berhasil diterapkan! Diskon Rp 50.000`);
    } else if (code === '') {
      setVoucherDiscount(0);
      setVoucherMessage(null);
    } else {
      setVoucherDiscount(0);
      setVoucherMessage('Kode voucher tidak valid atau sudah kadaluarsa.');
    }
  };

  const finalGrandTotal = Math.max(0, summary.grandTotal - voucherDiscount);

  // Form Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Nama lengkap wajib diisi (minimal 2 karakter).';
    }
    if (!email.trim() || !email.includes('@')) {
      errs.email = 'Alamat email bisnis valid wajib diisi.';
    }
    if (!whatsapp.trim() || whatsapp.trim().length < 9) {
      errs.whatsapp = 'Nomor WhatsApp aktif wajib diisi (minimal 9 digit).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Simulasi Pembayaran
  const handleSimulatePayment = (outcome: 'success' | 'failed') => {
    if (!validateForm()) {
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    if (!validation.isValid) {
      alert('Terdapat kelebihan kuota promo. Harap sesuaikan pesanan lisensi.');
      return;
    }

    setPaymentStatus('processing');

    setTimeout(() => {
      if (outcome === 'success') {
        const orderId = `KD-${Date.now().toString().slice(-6)}-${Math.floor(
          1000 + Math.random() * 9000
        )}`;
        const orderPayload = {
          orderId,
          paidAt: new Date().toISOString(),
          totalPaid: finalGrandTotal,
          buyer: { name, email, whatsapp, company },
          items: [...items],
          utm: utmParams,
          paymentMethod,
        };

        setOrderResult(orderPayload);
        setPaymentStatus('success');

        // GA4 purchase tracking event
        sendGA4Event('purchase', {
          ecommerce: {
            transaction_id: orderId,
            value: finalGrandTotal,
            currency: 'IDR',
            items: items.map((i) => ({
              item_id: i.id,
              item_name: `${i.productName} (${i.planName})`,
              price: i.effectivePrice,
              quantity: i.quantity,
            })),
          },
          utm: utmParams,
        });

        // Kosongkan keranjang setelah berhasil
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setPaymentStatus('failed');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 1200);
  };

  // Skenario 1: Keranjang Kosong
  if (isHydrated && items.length === 0 && paymentStatus !== 'success') {
    return (
      <div className="py-16 sm:py-24">
        <Container>
          <div className="max-w-md mx-auto text-center bg-pure-white rounded-[50px] p-8 sm:p-12 border border-hairline-mist">
            <div className="w-20 h-20 rounded-full bg-sandstone/70 flex items-center justify-center text-4xl mx-auto mb-5">
              🛒
            </div>
            <h1 className="text-[28px] font-medium text-ink-black">
              Keranjang Masih Kosong
            </h1>
            <p className="text-[15px] text-stone-gray mt-2 leading-relaxed">
              Anda belum memilih lisensi software untuk diproses checkout. Silakan pilih solusi bisnis yang Anda butuhkan di katalog kami.
            </p>
            <Link href="/produk" className="mt-8 inline-block">
              <Button variant="coral-pill" size="lg">
                Jelajahi Solusi Software
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Skenario 2: Pembayaran Sukses
  if (paymentStatus === 'success' && orderResult) {
    return (
      <div className="py-12 sm:py-20">
        <Container>
          <div className="max-w-2xl mx-auto bg-pure-white rounded-[50px] p-6 sm:p-12 border border-hairline-mist text-ink-black shadow-xs">
            {/* Header Sukses */}
            <div className="text-center mb-8 pb-6 border-b border-hairline-mist">
              <div className="w-20 h-20 rounded-full bg-fresh-grass/20 text-fresh-grass flex items-center justify-center text-4xl mx-auto mb-4 font-bold">
                ✓
              </div>
              <Badge variant="neutral" className="bg-fresh-grass/20 text-ink-black font-semibold mb-2">
                Status: Pembayaran Lunas (PAID)
              </Badge>
              <h1 className="text-[32px] sm:text-[40px] font-medium text-ink-black">
                Pembayaran Berhasil!
              </h1>
              <p className="text-[15px] text-stone-gray mt-2">
                Nomor Referensi Pesanan:{' '}
                <strong className="text-ink-black font-mono tracking-wider">
                  {orderResult.orderId}
                </strong>
              </p>
            </div>

            {/* Informasi Pengiriman Lisensi */}
            <div className="bg-cream-paper/70 rounded-[28px] p-5 sm:p-6 mb-6 border border-hairline-mist space-y-2">
              <h3 className="text-[16px] font-semibold text-ink-black flex items-center gap-2">
                <span>📦</span> Aktivasi & Pengiriman Lisensi Instan
              </h3>
              <p className="text-[14px] text-ink-black/80 leading-relaxed">
                Kunci lisensi (license key), tanda terima pembayaran, dan petunjuk aktivasi otomatis telah dikirimkan ke:
              </p>
              <div className="text-[14px] font-medium bg-pure-white p-3 rounded-[16px] border border-hairline-mist/60 space-y-1">
                <div>📧 Email: <strong className="text-ink-black">{orderResult.buyer.email}</strong></div>
                <div>💬 WhatsApp: <strong className="text-ink-black">{orderResult.buyer.whatsapp}</strong></div>
              </div>
            </div>

            {/* Rincian Produk yang Dibeli */}
            <div className="mb-6">
              <h4 className="text-[15px] font-semibold text-stone-gray uppercase tracking-wider mb-3">
                Rincian Lisensi Software:
              </h4>
              <div className="space-y-2">
                {orderResult.items.map((i) => (
                  <div
                    key={i.id}
                    className="p-3.5 rounded-[18px] bg-sandstone/30 flex justify-between items-center text-[14px]"
                  >
                    <div>
                      <strong className="text-ink-black block leading-tight">{i.productName}</strong>
                      <span className="text-stone-gray text-[12px]">
                        Paket {i.planName} ({i.quantity} unit)
                      </span>
                    </div>
                    <span className="font-semibold text-ink-black">
                      {formatIDR(i.effectivePrice * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 flex justify-between text-[18px] font-bold text-ink-black border-t border-hairline-mist mt-3">
                <span>Total Dibayar:</span>
                <span className="text-fresh-grass">{formatIDR(orderResult.totalPaid)}</span>
              </div>
            </div>

            {/* Mock Order Payload Viewer (Termasuk UTM Attribution) */}
            <div className="mb-8">
              <details className="text-[12px] bg-ink-black text-pure-white/90 p-4 rounded-[20px] overflow-hidden">
                <summary className="font-semibold cursor-pointer text-sunshine-yellow">
                  [Debug / Evaluasi] Lihat Payload Order Mock & UTM Attribution
                </summary>
                <pre className="mt-3 overflow-x-auto p-2 bg-ink-black/80 rounded font-mono text-[11px] leading-relaxed">
                  {JSON.stringify(orderResult, null, 2)}
                </pre>
              </details>
            </div>

            {/* Tombol Selesai */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button variant="coral-pill" size="lg" className="w-full justify-center">
                  Kembali ke Beranda
                </Button>
              </Link>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-full border border-hairline-mist font-medium hover:bg-cream-paper transition-colors text-center text-sm"
              >
                🖨️ Cetak Tanda Terima
              </button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Skenario 3: Form Checkout & Skenario Simulasi
  return (
    <div className="py-8 sm:py-16">
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-[14px] text-stone-gray flex items-center gap-2">
          <Link href="/" className="hover:text-ink-black transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/produk" className="hover:text-ink-black transition-colors">
            Produk
          </Link>
          <span>/</span>
          <span className="text-ink-black font-medium">Checkout Pembelian</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-[32px] sm:text-[44px] font-medium text-ink-black leading-tight">
            Checkout Lisensi Software
          </h1>
          <p className="text-[16px] text-stone-gray mt-1">
            Lengkapi data penanggung jawab dan selesaikan transaksi simulasi lisensi Kodeva.
          </p>
        </div>

        {/* Notifikasi Gagal Bayar jika sebelumnya mencoba dan gagal */}
        {paymentStatus === 'failed' && (
          <div className="mb-8 p-5 rounded-[28px] bg-coral-pop/15 border border-coral-pop/30 text-ink-black">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <h4 className="text-[17px] font-semibold text-coral-pop">
                  Simulasi Pembayaran Gagal / Ditolak
                </h4>
                <p className="text-[14px] text-stone-gray mt-1 leading-relaxed">
                  Simulasi: Transaksi tidak dapat diselesaikan karena batas waktu bayar (timeout) atau saldo tidak mencukupi. Lisensi Anda di keranjang tetap aman. Silakan coba kembali atau pilih metode pembayaran lain.
                </p>
                <button
                  onClick={() => setPaymentStatus('idle')}
                  className="mt-3 text-[13px] font-semibold text-coral-pop underline cursor-pointer"
                >
                  Tutup Pesan & Coba Lagi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Warning Kuota Promo Lintas Paket */}
        {!validation.isValid && (
          <div className="mb-8 p-5 rounded-[28px] bg-coral-pop/10 border border-coral-pop/30 text-ink-black">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="text-[16px] font-semibold text-coral-pop">
                  Transaksi Tidak Dapat Dilanjutkan: Kelebihan Kuota Promo
                </h4>
                {validation.violations.map((v) => (
                  <p key={v.productId} className="text-[14px] text-ink-black mt-1">
                    Total lisensi untuk <strong>{v.productName}</strong> ({v.requestedTotal} lisensi) melebihi batas kuota promo ({v.quotaRemaining} lisensi). Harap kurangi {v.excess} lisensi melalui keranjang.
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid 2 Kolom: Kiri (Data & Payment) / Kanan (Ringkasan Pesanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Form & Pembayaran */}
          <div className="lg:col-span-7 space-y-8">
            {/* Bagian 1: Data Pembeli */}
            <div className="bg-pure-white rounded-[40px] p-6 sm:p-8 border border-hairline-mist">
              <h2 className="text-[20px] font-semibold text-ink-black mb-5 flex items-center gap-2">
                <span>1.</span> Data Penanggung Jawab Lisensi
              </h2>

              <div className="space-y-4">
                <Input
                  label="Nama Lengkap *"
                  placeholder="Contoh: Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Perusahaan *"
                    type="email"
                    placeholder="budi@perusahaan.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    required
                  />

                  <Input
                    label="Nomor WhatsApp *"
                    type="tel"
                    placeholder="081234567890"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    error={errors.whatsapp}
                    required
                  />
                </div>

                <Input
                  label="Nama Perusahaan / Toko (Opsional)"
                  placeholder="Contoh: Kopi Senja Nusantara"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>

            {/* Bagian 2: Pilihan Metode Pembayaran */}
            <div className="bg-pure-white rounded-[40px] p-6 sm:p-8 border border-hairline-mist">
              <h2 className="text-[20px] font-semibold text-ink-black mb-5 flex items-center gap-2">
                <span>2.</span> Metode Pembayaran (Simulasi)
              </h2>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-4 rounded-[24px] border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'qris'
                      ? 'bg-cream-paper border-ink-black ring-2 ring-ink-black/10'
                      : 'border-hairline-mist hover:bg-cream-paper/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    <div>
                      <strong className="text-[15px] text-ink-black block">QRIS Dinamis</strong>
                      <span className="text-[12px] text-stone-gray">
                        BCA, Mandiri, GoPay, OVO, ShopeePay, Dana
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'qris'}
                    onChange={() => setPaymentMethod('qris')}
                    className="accent-ink-black"
                  />
                </label>

                <label
                  onClick={() => setPaymentMethod('va')}
                  className={`p-4 rounded-[24px] border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'va'
                      ? 'bg-cream-paper border-ink-black ring-2 ring-ink-black/10'
                      : 'border-hairline-mist hover:bg-cream-paper/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏦</span>
                    <div>
                      <strong className="text-[15px] text-ink-black block">Virtual Account Bank</strong>
                      <span className="text-[12px] text-stone-gray">
                        BCA, Mandiri, BNI, BRI (Verifikasi Otomatis)
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'va'}
                    onChange={() => setPaymentMethod('va')}
                    className="accent-ink-black"
                  />
                </label>

                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-[24px] border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-cream-paper border-ink-black ring-2 ring-ink-black/10'
                      : 'border-hairline-mist hover:bg-cream-paper/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <strong className="text-[15px] text-ink-black block">Kartu Kredit / Debit Online</strong>
                      <span className="text-[12px] text-stone-gray">
                        Visa, Mastercard, JCB (3D Secure)
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-ink-black"
                  />
                </label>
              </div>
            </div>

            {/* Bagian 3: Simulator Pembayaran Frontend (Requirement B.5) */}
            <div className="bg-sandstone/40 rounded-[40px] p-6 sm:p-8 border border-hairline-mist">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⚡</span>
                <h3 className="text-[18px] font-semibold text-ink-black">
                  Simulasi Pembayaran (Frontend Sandbox)
                </h3>
              </div>
              <p className="text-[14px] text-stone-gray leading-relaxed mb-6">
                Sesuai brief pengujian, transaksi berjalan di sisi frontend. Silakan klik salah satu tombol di bawah untuk menguji skenario sukses maupun gagal:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Button
                  variant="coral-pill"
                  size="lg"
                  disabled={paymentStatus === 'processing' || !validation.isValid}
                  onClick={() => handleSimulatePayment('success')}
                  className="w-full justify-center bg-fresh-grass hover:bg-fresh-grass/90 text-ink-black font-bold py-4"
                >
                  {paymentStatus === 'processing' ? 'Memproses...' : '✓ Simulasikan Sukses'}
                </Button>

                <Button
                  variant="ghost-pill"
                  size="lg"
                  disabled={paymentStatus === 'processing' || !validation.isValid}
                  onClick={() => handleSimulatePayment('failed')}
                  className="w-full justify-center text-coral-pop border-coral-pop/40 hover:bg-coral-pop/10 py-4"
                >
                  ✕ Simulasikan Gagal
                </Button>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Ringkasan Pesanan & UTM Tracker */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-pure-white rounded-[40px] p-6 sm:p-8 border border-hairline-mist sticky top-24">
              <h2 className="text-[20px] font-semibold text-ink-black mb-4">
                Ringkasan Pesanan ({summary.totalItems} unit)
              </h2>

              {/* Daftar Item */}
              <div className="divide-y divide-hairline-mist max-h-72 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-[14px] font-medium text-ink-black leading-snug">
                        {item.productName}
                      </h4>
                      <span className="text-[12px] text-stone-gray">
                        Paket {item.planName} &bull; {item.quantity} {item.unitName}
                      </span>
                    </div>
                    <span className="text-[14px] font-semibold text-ink-black">
                      {formatIDR(item.effectivePrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Input Voucher Diskon (Bonus Feature) */}
              <div className="py-4 border-t border-b border-hairline-mist space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Kode Voucher (cth: KODEVAHEMAT)"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-full border border-hairline-mist text-[13px] uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-ink-black"
                  />
                  <Button variant="ghost-pill" size="sm" onClick={handleApplyVoucher}>
                    Terapkan
                  </Button>
                </div>
                {voucherMessage && (
                  <p
                    className={`text-[12px] font-medium ${
                      voucherDiscount > 0 ? 'text-fresh-grass' : 'text-coral-pop'
                    }`}
                  >
                    {voucherMessage}
                  </p>
                )}
              </div>

              {/* Kalkulasi Total */}
              <div className="py-4 space-y-2 text-[14px]">
                <div className="flex justify-between text-stone-gray">
                  <span>Subtotal Normal:</span>
                  <span>{formatIDR(summary.originalSubtotal)}</span>
                </div>
                {summary.discountTotal > 0 && (
                  <div className="flex justify-between text-fresh-grass font-medium">
                    <span>Diskon Promo Akhir Tahun:</span>
                    <span>- {formatIDR(summary.discountTotal)}</span>
                  </div>
                )}
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-fresh-grass font-medium">
                    <span>Diskon Voucher:</span>
                    <span>- {formatIDR(voucherDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[20px] font-bold text-ink-black pt-3 border-t border-hairline-mist">
                  <span>Total Pembayaran:</span>
                  <span className="text-fresh-grass">{formatIDR(finalGrandTotal)}</span>
                </div>
              </div>

              {/* Card UTM Attribution Tracker (Requirement C.3) */}
              {utmParams && Object.keys(utmParams).length > 0 && (
                <div className="mt-4 p-4 rounded-[20px] bg-sandstone/50 border border-hairline-mist/80 text-[12px]">
                  <strong className="text-ink-black block mb-1">
                    🎯 Atribusi Kampanye (UTM Tracker):
                  </strong>
                  <div className="text-stone-gray space-y-0.5 font-mono text-[11px]">
                    {utmParams.utm_source && (
                      <div>Source: <span className="text-ink-black">{utmParams.utm_source}</span></div>
                    )}
                    {utmParams.utm_campaign && (
                      <div>Campaign: <span className="text-ink-black">{utmParams.utm_campaign}</span></div>
                    )}
                    {utmParams.utm_medium && (
                      <div>Medium: <span className="text-ink-black">{utmParams.utm_medium}</span></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
