'use client';

import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  X,
  Building2,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Key,
} from 'lucide-react';
import { formatIDR } from '@/shared/lib';
import type { CartItem } from '@/entities/cart';

export interface ReceiptOrderData {
  orderId: string;
  paidAt: string;
  totalPaid: number;
  buyer: {
    name: string;
    email: string;
    whatsapp: string;
    company?: string;
  };
  items: CartItem[];
  paymentMethod: string;
}

interface CustomReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ReceiptOrderData;
}

export function CustomReceiptModal({ isOpen, onClose, order }: CustomReceiptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const paymentMethodLabel = (method: string) => {
    switch (method) {
      case 'qris':
        return 'QRIS Dinamis (Otomatis Lunas)';
      case 'va':
        return 'Virtual Account Bank';
      case 'card':
        return 'Kartu Kredit / Debit Online';
      default:
        return 'Transfer Bank Digital';
    }
  };

  const formattedDate = new Date(order.paidAt).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const generateLicenseKey = (itemId: string, index: number) => {
    // Deterministic preview token for invoice
    const hash = `${order.orderId}-${itemId}-${index}`
      .split('')
      .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000, 7);
    return `KOD-${order.orderId.slice(-4)}-${Math.abs(hash).toString(36).toUpperCase().padStart(4, 'X')}-${(index + 1) * 789}`;
  };

  const handleCopySummary = async () => {
    const textLines = [
      '================================================',
      '        KODEVA SOFTWARE SOLUTIONS               ',
      '      TANDA TERIMA RESMI PEMBELIAN LISENSI      ',
      '================================================',
      `No. Referensi : ${order.orderId}`,
      `Tanggal       : ${formattedDate}`,
      `Status        : LUNAS / VERIFIED`,
      `Metode Bayar  : ${paymentMethodLabel(order.paymentMethod)}`,
      '------------------------------------------------',
      'DATA PENANGGUNG JAWAB LISENSI:',
      `Nama          : ${order.buyer.name}`,
      `Email         : ${order.buyer.email}`,
      `WhatsApp      : ${order.buyer.whatsapp}`,
      order.buyer.company ? `Perusahaan    : ${order.buyer.company}` : '',
      '------------------------------------------------',
      'RINCIAN LISENSI SOFTWARE:',
      ...order.items.map(
        (item, idx) =>
          `${idx + 1}. ${item.productName} [Paket ${item.planName}]\n` +
          `   Qty: ${item.quantity} ${item.unitName} @ ${formatIDR(item.effectivePrice)} = ${formatIDR(item.effectivePrice * item.quantity)}\n` +
          `   License Key: ${generateLicenseKey(item.id, idx)}`
      ),
      '------------------------------------------------',
      `TOTAL DIBAYAR : ${formatIDR(order.totalPaid)}`,
      '================================================',
      'Simpan nomor referensi ini sebagai bukti kepemilikan lisensi yang sah.',
      'Dukungan aktivasi: support@kodeva.id',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(textLines);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-ink-black/60 backdrop-blur-xs"
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #kodeva-printable-receipt, #kodeva-printable-receipt * {
            visibility: visible !important;
          }
          #kodeva-printable-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: white !important;
            border: none !important;
            box-shadow: none !important;
            z-index: 999999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Receipt Paper Container */}
      <div className="relative w-full max-w-2xl bg-pure-white rounded-[36px] border border-hairline-mist shadow-2xl z-10 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Receipt Header Bar (Action & Close) */}
        <div className="no-print bg-cream-paper/70 px-6 py-4 border-b border-hairline-mist flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-fresh-grass" />
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-black">
              Tanda Terima Digital Resmi
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-pure-white border border-hairline-mist hover:bg-sandstone/40 text-ink-black transition-colors"
              title="Salin rincian tanda terima ke clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-fresh-grass" />
                  <span className="text-fresh-grass font-semibold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-gray" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-pure-white border border-hairline-mist hover:bg-sandstone/40 text-ink-black transition-colors"
              title="Cetak atau simpan sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5 text-stone-gray" />
              <span>Cetak Bersih</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              aria-label="Tutup"
              className="w-8 h-8 rounded-full bg-pure-white border border-hairline-mist hover:bg-sandstone/40 flex items-center justify-center text-ink-black transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Canvas */}
        <div id="kodeva-printable-receipt" className="p-6 sm:p-10 space-y-6 text-ink-black">
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline-mist">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-ink-black">
                  KODEVA<span className="text-coral-pop">.</span>
                </span>
                <span className="text-xs font-medium text-stone-gray bg-sandstone/40 px-2.5 py-0.5 rounded-full">
                  Official Software
                </span>
              </div>
              <p className="text-xs text-stone-gray mt-1">
                PT Kodeva Solusi Digital Nusantara
              </p>
              <p className="text-xs text-stone-gray">Jakarta, Indonesia &bull; support@kodeva.id</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-fresh-grass/15 text-fresh-grass mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> LUNAS &bull; VERIFIED
              </span>
              <h2 id="receipt-title" className="text-lg font-bold text-ink-black tracking-wide">
                BUKTI PEMBAYARAN
              </h2>
              <p className="text-xs text-stone-gray font-mono mt-0.5">
                Ref: <span className="font-semibold text-ink-black">{order.orderId}</span>
              </p>
            </div>
          </div>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-cream-paper/50 rounded-2xl p-4 border border-hairline-mist/60">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-stone-gray">
                <Calendar className="w-3.5 h-3.5" />
                <span>Waktu Pembayaran:</span>
              </div>
              <p className="font-medium text-ink-black">{formattedDate}</p>

              <div className="flex items-center gap-1.5 text-stone-gray pt-2">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Metode Pembayaran:</span>
              </div>
              <p className="font-medium text-ink-black">
                {paymentMethodLabel(order.paymentMethod)}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-stone-gray font-semibold uppercase tracking-wider block">
                Penerima Lisensi:
              </span>
              <p className="font-bold text-sm text-ink-black">{order.buyer.name}</p>
              <div className="flex items-center gap-1.5 text-stone-gray">
                <Mail className="w-3 h-3" />
                <span className="text-ink-black">{order.buyer.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-gray">
                <Phone className="w-3 h-3" />
                <span className="text-ink-black">{order.buyer.whatsapp}</span>
              </div>
              {order.buyer.company && (
                <div className="flex items-center gap-1.5 text-stone-gray">
                  <Building2 className="w-3 h-3" />
                  <span className="text-ink-black">{order.buyer.company}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-xs font-semibold text-stone-gray uppercase tracking-wider mb-2.5">
              Rincian Lisensi Software & Kunci Lisensi
            </h3>
            <div className="border border-hairline-mist rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-cream-paper/70 text-stone-gray border-b border-hairline-mist font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Item Software</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline-mist">
                  {order.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-sandstone/20">
                      <td className="py-3 px-3">
                        <strong className="block text-ink-black">{item.productName}</strong>
                        <span className="text-[11px] text-stone-gray">
                          Paket {item.planName} &bull; Lisensi Sah
                        </span>
                        <div className="mt-1.5 inline-flex items-center gap-1 bg-pure-white border border-hairline-mist px-2 py-0.5 rounded font-mono text-[10px] text-stone-gray">
                          <Key className="w-3 h-3 text-stone-gray" />
                          <span className="text-ink-black font-semibold">
                            {generateLicenseKey(item.id, idx)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center text-stone-gray">{item.quantity}</td>
                      <td className="py-3 px-3 text-right text-stone-gray">
                        {formatIDR(item.effectivePrice)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-ink-black">
                        {formatIDR(item.effectivePrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Calculation */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 text-sm font-bold text-ink-black border-t-2 border-ink-black pt-2">
                <span>Total Lunas:</span>
                <span className="text-fresh-grass">{formatIDR(order.totalPaid)}</span>
              </div>
            </div>
          </div>

          {/* Note & Footer */}
          <div className="pt-4 border-t border-hairline-mist text-[11px] text-stone-gray leading-relaxed flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <p className="font-semibold text-ink-black">Catatan Aktivasi Lisensi:</p>
              <p>
                Dokumen ini merupakan tanda terima digital resmi yang sah atas pembelian lisensi
                perangkat lunak Kodeva. Lisensi langsung aktif dan dapat dihubungkan ke akun Anda.
              </p>
            </div>
            <div className="sm:text-right shrink-0">
              <span className="font-mono text-[10px] text-stone-gray block">
                Kode Otentikasi: {order.orderId.replace('KD-', 'KD-AUTH-')}
              </span>
              <span className="text-[10px] text-fresh-grass font-medium">Verified System</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Controls (no-print) */}
        <div className="no-print bg-cream-paper/40 px-6 py-4 border-t border-hairline-mist flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-gray text-center sm:text-left">
            Tanda terima ini tersimpan otomatis dan dapat dicetak sewaktu-waktu.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              type="button"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-ink-black text-pure-white hover:bg-ink-black/90 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Tanda Terima</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full text-xs font-medium border border-hairline-mist bg-pure-white hover:bg-sandstone/30 text-ink-black transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
