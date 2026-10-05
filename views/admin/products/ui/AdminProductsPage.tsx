'use client';

import React, { useState, useActionState } from 'react';
import Link from 'next/link';
import { Card, Badge, Button, Modal, Input, Textarea } from '@/shared/ui';
import { createProductAction, deleteProductAction, type ActionState } from '@/features/manage-products';
import type { Product } from '@/entities/product';
import type { Category } from '@/entities/category';

export interface AdminProductsPageProps {
  products: Product[];
  categories: Category[];
}

const initialActionState: ActionState = {};

export function AdminProductsPage({
  products,
  categories,
}: AdminProductsPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createProductAction, initialActionState);

  React.useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        setIsAddModalOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-ink-black tracking-tight">
            Katalog Produk & Paket
          </h1>
          <p className="text-[15px] text-stone-gray mt-1">
            Kelola software SaaS, tier paket lisensi, dan kuota promo.
          </p>
        </div>

        <Button
          variant="grass-pill"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Tambah Produk Baru
        </Button>
      </div>

      {/* Products Table Card */}
      <Card surface="white" className="p-6 sm:p-8 rounded-[35px] border border-hairline-mist">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[20px] font-semibold text-ink-black">
            Daftar Produk ({products.length})
          </h3>
        </div>

        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-hairline-mist text-stone-gray font-medium">
                  <th className="pb-3 pr-4">Produk</th>
                  <th className="pb-3 pr-4">Kategori</th>
                  <th className="pb-3 pr-4">Featured</th>
                  <th className="pb-3 pr-4">Sisa Promo</th>
                  <th className="pb-3 pr-4">Jumlah Paket</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-mist/50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-cream-paper/40 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div>
                        <span className="font-semibold text-ink-black block">
                          {product.name}
                        </span>
                        <span className="text-[12px] text-stone-gray font-mono">
                          /produk/{product.slug}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      {product.category ? (
                        <Badge variant="neutral">{product.category.name}</Badge>
                      ) : (
                        <span className="text-stone-gray">-</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4">
                      {product.featured_rank !== null ? (
                        <Badge variant="grass">Rank #{product.featured_rank}</Badge>
                      ) : (
                        <span className="text-[13px] text-stone-gray">Tidak</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4">
                      {product.promo_quota_remaining > 0 ? (
                        <Badge variant="coral">{product.promo_quota_remaining} Kuota</Badge>
                      ) : (
                        <span className="text-[13px] text-stone-gray">Habis</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 font-medium text-ink-black">
                      {product.plans?.length || 0} Paket
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <Link
                        href={`/produk/${product.slug}`}
                        target="_blank"
                        className="text-[13px] text-stone-gray hover:text-ink-black hover:underline"
                      >
                        Lihat ↗
                      </Link>
                      <button
                        onClick={async () => {
                          if (confirm(`Yakin ingin menghapus produk "${product.name}"?`)) {
                            await deleteProductAction(product.id);
                          }
                        }}
                        className="text-[13px] text-coral-pop hover:underline ml-2 cursor-pointer"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-stone-gray">
            <span className="text-3xl block mb-2">📦</span>
            <p className="font-medium text-ink-black">Belum ada produk yang didaftarkan.</p>
            <p className="text-[13px] text-stone-gray mt-1">
              Klik tombol &quot;+ Tambah Produk Baru&quot; di atas untuk memasukkan data pertama.
            </p>
          </div>
        )}
      </Card>

      {/* Modal Tambah Produk */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Produk Baru"
        description="Lengkapi detail software atau solusi bisnis untuk ditampilkan di katalog Kodeva."
        maxWidth="lg"
      >
        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="p-3.5 rounded-[16px] bg-coral-pop/10 text-coral-pop text-[14px] border border-coral-pop/20 font-medium">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              name="name"
              label="Nama Produk *"
              placeholder="Contoh: Mekari Jurnal"
              required
              disabled={isPending}
            />

            <Input
              name="slug"
              label="Slug URL *"
              placeholder="contoh: mekari-jurnal"
              required
              disabled={isPending}
            />
          </div>

          <Input
            name="tagline"
            label="Tagline Ringkas"
            placeholder="Software Akuntansi Online Terintegrasi untuk Bisnis"
            disabled={isPending}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[14px] font-medium text-ink-black mb-1.5">
                Kategori Produk
              </label>
              <select
                name="category_id"
                disabled={isPending}
                className="w-full bg-pure-white text-ink-black px-4 py-3 rounded-[20px] border border-hairline-mist focus:border-fresh-grass focus:outline-none text-[15px]"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              name="promo_quota_remaining"
              type="number"
              label="Sisa Kuota Promo"
              placeholder="10"
              defaultValue="0"
              disabled={isPending}
            />

            <Input
              name="featured_rank"
              type="number"
              label="Urutan Featured (Opsional)"
              placeholder="1, 2, atau kosongkan"
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              name="plan_price"
              type="number"
              label="Harga Paket Mulai Dari (IDR/bulan)"
              placeholder="Contoh: 499000"
              disabled={isPending}
            />

            <Input
              name="plan_promo_price"
              type="number"
              label="Harga Promo Diskon (Opsional)"
              placeholder="Contoh: 399000"
              disabled={isPending}
            />
          </div>

          <Textarea
            name="description"
            label="Deskripsi Lengkap"
            placeholder="Jelaskan fitur utama, manfaat bagi bisnis, dan ekosistem software ini..."
            rows={3}
            disabled={isPending}
          />

          <Textarea
            name="features"
            label="Daftar Fitur Unggulan (1 per baris)"
            placeholder="Laporan Keuangan Otomatis&#10;Manajemen Stok Real-time&#10;Multi-Gudang"
            rows={3}
            disabled={isPending}
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost-pill"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="grass-pill"
              disabled={isPending}
            >
              {isPending ? 'Menyimpan...' : 'Simpan Produk'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
