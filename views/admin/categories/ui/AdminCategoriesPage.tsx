'use client';

import React, { useActionState } from 'react';
import { Card, Badge, Button, Input } from '@/shared/ui';
import { createCategoryAction, deleteCategoryAction, type ActionState } from '@/features/manage-categories';
import type { Category } from '@/entities/category';

export interface AdminCategoriesPageProps {
  categories: Category[];
}

const initialActionState: ActionState = {};

export function AdminCategoriesPage({ categories }: AdminCategoriesPageProps) {
  const [state, formAction, isPending] = useActionState(createCategoryAction, initialActionState);

  const productCategories = categories.filter((c) => c.type === 'product');
  const articleCategories = categories.filter((c) => c.type === 'article');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[28px] sm:text-[32px] font-semibold text-ink-black tracking-tight">
          Taksonomi & Kategori
        </h1>
        <p className="text-[15px] text-stone-gray mt-1">
          Kelola kategori untuk klasifikasi produk software dan artikel blog.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah Kategori (Kiri) */}
        <div className="lg:col-span-1">
          <Card surface="white" className="p-6 rounded-[30px] border border-hairline-mist sticky top-24">
            <h3 className="text-[18px] font-semibold text-ink-black mb-4">
              + Tambah Kategori Baru
            </h3>

            <form action={formAction} className="space-y-4">
              {state.error && (
                <div className="p-3 rounded-[14px] bg-coral-pop/10 text-coral-pop text-[13px] border border-coral-pop/20 font-medium">
                  {state.error}
                </div>
              )}

              {state.success && (
                <div className="p-3 rounded-[14px] bg-fresh-grass/15 text-ink-black text-[13px] border border-fresh-grass/40 font-medium">
                  {state.message}
                </div>
              )}

              <Input
                name="name"
                label="Nama Kategori *"
                placeholder="Contoh: ERP Manufaktur"
                required
                disabled={isPending}
              />

              <Input
                name="slug"
                label="Slug URL *"
                placeholder="contoh: erp-manufaktur"
                required
                disabled={isPending}
              />

              <div>
                <label className="block text-[14px] font-medium text-ink-black mb-1.5">
                  Tipe Kategori *
                </label>
                <select
                  name="type"
                  disabled={isPending}
                  className="w-full bg-pure-white text-ink-black px-4 py-3 rounded-[20px] border border-hairline-mist focus:border-fresh-grass focus:outline-none text-[15px]"
                >
                  <option value="product">Produk Software</option>
                  <option value="article">Artikel Blog</option>
                </select>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="grass-pill"
                  size="md"
                  disabled={isPending}
                  className="w-full justify-center"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Kategori'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Tabel Daftar Kategori (Kanan) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Kategori Produk */}
          <Card surface="white" className="p-6 sm:p-7 rounded-[30px] border border-hairline-mist">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[17px] font-semibold text-ink-black">
                Kategori Produk ({productCategories.length})
              </h4>
              <Badge variant="grass">Produk</Badge>
            </div>

            {productCategories.length > 0 ? (
              <div className="divide-y divide-hairline-mist/50">
                {productCategories.map((cat) => (
                  <div key={cat.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-ink-black">{cat.name}</span>
                      <span className="text-[12px] text-stone-gray font-mono block">
                        slug: {cat.slug}
                      </span>
                    </div>

                    <button
                      onClick={async () => {
                        if (confirm(`Yakin ingin menghapus kategori "${cat.name}"?`)) {
                          await deleteCategoryAction(cat.id);
                        }
                      }}
                      className="text-[12px] text-coral-pop hover:underline cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-stone-gray py-4">Belum ada kategori produk.</p>
            )}
          </Card>

          {/* Kategori Artikel */}
          <Card surface="white" className="p-6 sm:p-7 rounded-[30px] border border-hairline-mist">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[17px] font-semibold text-ink-black">
                Kategori Artikel ({articleCategories.length})
              </h4>
              <Badge variant="sky">Artikel</Badge>
            </div>

            {articleCategories.length > 0 ? (
              <div className="divide-y divide-hairline-mist/50">
                {articleCategories.map((cat) => (
                  <div key={cat.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-ink-black">{cat.name}</span>
                      <span className="text-[12px] text-stone-gray font-mono block">
                        slug: {cat.slug}
                      </span>
                    </div>

                    <button
                      onClick={async () => {
                        if (confirm(`Yakin ingin menghapus kategori "${cat.name}"?`)) {
                          await deleteCategoryAction(cat.id);
                        }
                      }}
                      className="text-[12px] text-coral-pop hover:underline cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-stone-gray py-4">Belum ada kategori artikel.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
