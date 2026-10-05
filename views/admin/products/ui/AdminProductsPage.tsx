'use client';

import React, { useState, useActionState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { Card, Badge, Button, Modal, Input, Textarea } from '@/shared/ui';
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  type ActionState,
} from '@/features/manage-products';
import { ImageUploader } from '@/features/upload-media';
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [createState, createAction, isCreating] = useActionState(
    createProductAction,
    initialActionState
  );
  const [updateState, updateAction, isUpdating] = useActionState(
    updateProductAction,
    initialActionState
  );

  React.useEffect(() => {
    if (createState.success) {
      const timer = setTimeout(() => {
        setIsAddModalOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [createState.success]);

  React.useEffect(() => {
    if (updateState.success) {
      const timer = setTimeout(() => {
        setEditingProduct(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [updateState.success]);

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-ink-black tracking-tight">
            Katalog Produk & Paket
          </h1>
          <p className="text-[15px] text-stone-gray mt-1">
            Kelola software SaaS, tier paket lisensi, upload thumbnail produk, dan kuota promo.
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
                  <th className="pb-3 pr-4">Gambar</th>
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
                    {/* Thumbnail preview */}
                    <td className="py-3.5 pr-4">
                      <div className="relative w-11 h-11 rounded-[14px] bg-sandstone overflow-hidden border border-hairline-mist flex items-center justify-center shrink-0">
                        {product.thumbnail_url ? (
                          <Image
                            src={product.thumbnail_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-[11px] font-bold text-stone-gray">
                            {product.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </td>

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
                      <button
                        type="button"
                        onClick={() => setEditingProduct(product)}
                        className="text-[13px] text-fresh-grass hover:underline font-medium cursor-pointer"
                      >
                        Edit
                      </button>
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
            <Package className="w-10 h-10 text-stone-gray/60 mx-auto mb-2" />
            <p className="font-medium text-ink-black">Belum ada produk yang didaftarkan.</p>
            <p className="text-[13px] text-stone-gray mt-1">
              Klik tombol &quot;+ Tambah Produk Baru&quot; di atas untuk memasukkan data pertama.
            </p>
          </div>
        )}
      </Card>

      {/* Modal Tambah Produk */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Tambah Produk Baru"
          description="Lengkapi detail software SaaS dan upload gambar thumbnail ke Supabase Storage."
          maxWidth="lg"
        >
          <form action={createAction} className="space-y-4">
            {createState.error && (
              <div className="p-3.5 rounded-[16px] bg-coral-pop/10 text-coral-pop text-[14px] border border-coral-pop/20 font-medium">
                {createState.error}
              </div>
            )}
            {createState.success && (
              <div className="p-3.5 rounded-[16px] bg-fresh-grass/10 text-fresh-grass text-[14px] border border-fresh-grass/20 font-medium">
                {createState.message || 'Produk berhasil ditambahkan!'}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="name"
                label="Nama Produk *"
                placeholder="Contoh: Mekari Jurnal"
                required
                disabled={isCreating}
              />

              <Input
                name="slug"
                label="Slug URL *"
                placeholder="contoh: mekari-jurnal"
                required
                disabled={isCreating}
              />
            </div>

            {/* Supabase Storage Image Upload */}
            <ImageUploader
              name="thumbnail_url"
              label="Thumbnail Produk (Supabase Storage)"
              folder="products"
              helperText="Upload gambar thumbnail software (PNG/JPG/WebP/AVIF max 2MB)."
            />

            <Input
              name="tagline"
              label="Tagline Ringkas"
              placeholder="Software Akuntansi Online Terintegrasi untuk Bisnis"
              disabled={isCreating}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[14px] font-medium text-ink-black mb-1.5">
                  Kategori Produk
                </label>
                <select
                  name="category_id"
                  disabled={isCreating}
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
                disabled={isCreating}
              />

              <Input
                name="featured_rank"
                type="number"
                label="Urutan Featured (Opsional)"
                placeholder="1, 2, atau kosongkan"
                disabled={isCreating}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="plan_price"
                type="number"
                label="Harga Paket Mulai Dari (IDR/bulan)"
                placeholder="Contoh: 499000"
                disabled={isCreating}
              />

              <Input
                name="plan_promo_price"
                type="number"
                label="Harga Promo Diskon (Opsional)"
                placeholder="Contoh: 399000"
                disabled={isCreating}
              />
            </div>

            <Textarea
              name="description"
              label="Deskripsi Lengkap"
              placeholder="Jelaskan fitur utama, manfaat bagi bisnis, dan ekosistem software ini..."
              rows={3}
              disabled={isCreating}
            />

            <Textarea
              name="features"
              label="Daftar Fitur Unggulan (1 per baris)"
              placeholder="Laporan Keuangan Otomatis&#10;Manajemen Stok Real-time&#10;Multi-Gudang"
              rows={3}
              disabled={isCreating}
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
                disabled={isCreating}
              >
                {isCreating ? 'Menyimpan...' : 'Simpan Produk'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Edit Produk */}
      {editingProduct && (
        <Modal
          isOpen={Boolean(editingProduct)}
          onClose={() => setEditingProduct(null)}
          title={`Edit Produk: ${editingProduct.name}`}
          description="Perbarui informasi produk, ganti gambar thumbnail, atau ubah kuota promo."
          maxWidth="lg"
        >
          <form action={updateAction} className="space-y-4">
            <input type="hidden" name="id" value={editingProduct.id} />

            {updateState.error && (
              <div className="p-3.5 rounded-[16px] bg-coral-pop/10 text-coral-pop text-[14px] border border-coral-pop/20 font-medium">
                {updateState.error}
              </div>
            )}
            {updateState.success && (
              <div className="p-3.5 rounded-[16px] bg-fresh-grass/10 text-fresh-grass text-[14px] border border-fresh-grass/20 font-medium">
                {updateState.message || 'Perubahan berhasil disimpan!'}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="name"
                label="Nama Produk *"
                defaultValue={editingProduct.name}
                required
                disabled={isUpdating}
              />

              <Input
                name="slug"
                label="Slug URL *"
                defaultValue={editingProduct.slug}
                required
                disabled={isUpdating}
              />
            </div>

            {/* Supabase Storage Image Upload */}
            <ImageUploader
              name="thumbnail_url"
              label="Thumbnail Produk (Supabase Storage)"
              folder="products"
              defaultValue={editingProduct.thumbnail_url}
              helperText="Upload gambar baru atau pertahankan gambar yang sudah ada."
            />

            <Input
              name="tagline"
              label="Tagline Ringkas"
              defaultValue={editingProduct.tagline || ''}
              disabled={isUpdating}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[14px] font-medium text-ink-black mb-1.5">
                  Kategori Produk
                </label>
                <select
                  name="category_id"
                  defaultValue={editingProduct.category_id || ''}
                  disabled={isUpdating}
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
                defaultValue={String(editingProduct.promo_quota_remaining ?? 0)}
                disabled={isUpdating}
              />

              <Input
                name="featured_rank"
                type="number"
                label="Urutan Featured"
                defaultValue={editingProduct.featured_rank !== null ? String(editingProduct.featured_rank) : ''}
                placeholder="Kosongkan jika bukan featured"
                disabled={isUpdating}
              />
            </div>

            <Textarea
              name="description"
              label="Deskripsi Lengkap"
              defaultValue={editingProduct.description}
              rows={3}
              disabled={isUpdating}
            />

            <Textarea
              name="features"
              label="Daftar Fitur Unggulan (1 per baris)"
              defaultValue={editingProduct.features?.join('\n') || ''}
              rows={3}
              disabled={isUpdating}
            />

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost-pill"
                onClick={() => setEditingProduct(null)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="grass-pill"
                disabled={isUpdating}
              >
                {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
