'use client';

import React, { useState, useActionState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Save,
  Globe,
  FileEdit,
} from 'lucide-react';
import { Card, Badge, Button, Input, Textarea } from '@/shared/ui';
import {
  createArticleAction,
  updateArticleAction,
  RichTextEditor,
  type ActionState,
} from '@/features/manage-articles';
import { ImageUploader } from '@/features/upload-media';
import type { Article } from '@/entities/article';
import type { Category } from '@/entities/category';
import type { Product } from '@/entities/product';

export interface AdminArticleFormPageProps {
  mode: 'create' | 'edit';
  article?: Article;
  categories: Category[];
  products?: Product[];
}

const initialActionState: ActionState = {};

export function AdminArticleFormPage({
  mode,
  article,
  categories,
  products = [],
}: AdminArticleFormPageProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const isEdit = mode === 'edit';
  const actionToUse = isEdit ? updateArticleAction : createArticleAction;

  const [formState, formAction, isPending] = useActionState(
    actionToUse,
    initialActionState
  );

  // Title and slug state for auto-generating slug
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(isEdit);

  // Filter linked products search
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    article?.linked_product_ids || []
  );

  const generateSlugFromTitle = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugManuallyEdited) {
      setSlug(generateSlugFromTitle(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setSlug(
      e.target.value
        .toLowerCase()
        .replace(/[^\w-]/g, '')
    );
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header & Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline-mist">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pure-white border border-hairline-mist text-stone-gray hover:text-ink-black hover:border-ink-black transition-all"
            title="Kembali ke Daftar Artikel"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] uppercase font-bold tracking-wider text-stone-gray">
                Artikel & Edukasi Blog
              </span>
              <span>•</span>
              <Badge variant={isEdit ? 'coral' : 'grass'}>
                {isEdit ? 'Mode Edit' : 'Tulis Baru'}
              </Badge>
            </div>
            <h1 className="text-[24px] sm:text-[28px] font-semibold text-ink-black tracking-tight">
              {isEdit ? `Edit: ${article?.title || 'Artikel'}` : 'Tulis Artikel Blog Baru'}
            </h1>
          </div>
        </div>

        {/* Quick Header Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="ghost-pill"
            size="sm"
            onClick={() => {
              if (confirm('Batalkan perubahan dan kembali ke daftar artikel?')) {
                startTransition(() => {
                  router.push('/admin/articles');
                });
              }
            }}
          >
            Batal
          </Button>

          {isEdit && article?.slug && (
            <Link
              href={`/artikel/${article.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-hairline-mist bg-pure-white text-[13px] font-medium text-ink-black hover:bg-sandstone/30 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-stone-gray" />
              <span>Buka Publik ↗</span>
            </Link>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {formState.success && (
        <div className="p-4 sm:p-5 rounded-[24px] bg-fresh-grass/15 border border-fresh-grass/30 text-ink-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-fresh-grass shrink-0" />
            <div>
              <p className="font-semibold text-[15px]">
                {formState.message || 'Artikel berhasil disimpan!'}
              </p>
              <p className="text-[13px] text-stone-gray">
                Perubahan Anda telah disinkronkan ke Supabase Database dan cache artikel telah diperbarui.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/admin/articles"
              className="px-4 py-2 rounded-full bg-pure-white text-ink-black text-[13px] font-medium border border-hairline-mist hover:bg-sandstone/30 transition-colors"
            >
              ← Kembali ke Daftar
            </Link>
            {(formState.slug || article?.slug) && (
              <Link
                href={`/artikel/${formState.slug || article?.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-fresh-grass text-ink-black text-[13px] font-semibold hover:opacity-90 transition-opacity"
              >
                <span>Lihat Artikel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Error Notification Alert */}
      {formState.error && (
        <div className="p-4 rounded-[20px] bg-coral-pop/10 text-coral-pop text-[14px] border border-coral-pop/20 font-medium">
          {formState.error}
        </div>
      )}

      {/* Main Form */}
      <form action={formAction} className="space-y-6">
        {isEdit && <input type="hidden" name="id" value={article?.id} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Title, Slug, Rich Text Editor, Excerpt (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card: Title & Slug */}
            <Card surface="white" className="p-5 sm:p-7 rounded-[32px] border border-hairline-mist space-y-4">
              <div>
                <label className="block text-[14px] font-semibold text-ink-black mb-1.5">
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Contoh: 5 Software Akuntansi Bisnis Terbaik untuk UKM di Indonesia"
                  required
                  disabled={isPending}
                  className="w-full bg-pure-white text-ink-black px-4 py-3 rounded-[18px] border border-hairline-mist focus:border-fresh-grass focus:outline-none text-[18px] sm:text-[20px] font-semibold transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[13px] font-medium text-stone-gray">
                    Slug URL Artikel *
                  </label>
                  {!isSlugManuallyEdited && (
                    <span className="text-[11px] text-stone-gray/80 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-fresh-grass" />
                      Auto-generate dari judul
                    </span>
                  )}
                </div>
                <div className="flex items-center rounded-[18px] border border-hairline-mist bg-pure-white overflow-hidden focus-within:border-fresh-grass transition-colors">
                  <span className="px-3.5 py-2.5 bg-sandstone/40 text-stone-gray text-[13px] font-mono select-none border-r border-hairline-mist">
                    /artikel/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={slug}
                    onChange={handleSlugChange}
                    placeholder="software-akuntansi-terbaik"
                    required
                    disabled={isPending}
                    className="flex-1 bg-transparent text-ink-black px-3.5 py-2.5 outline-none text-[14px] font-mono"
                  />
                </div>
                <p className="text-[11px] text-stone-gray mt-1">
                  Format: huruf kecil, angka, dan tanda strip (-). Digunakan sebagai tautan permanen artikel.
                </p>
              </div>
            </Card>

            {/* Card: Rich Text Editor (TipTap Package Integration) */}
            <Card surface="white" className="p-5 sm:p-7 rounded-[32px] border border-hairline-mist space-y-3">
              <RichTextEditor
                name="content_html"
                label="Konten Lengkap Artikel (WYSIWYG Rich Text)"
                defaultValue={article?.content_html || ''}
                placeholder="Tulis ulasan mendalam, panduan, perbandingan fitur software, dan rekomendasi bisnis di sini..."
                disabled={isPending}
              />
              <p className="text-[12px] text-stone-gray">
                Gunakan toolbar di atas untuk memformat teks, menambahkan sub-judul (H2/H3), daftar poin, kutipan, tautan referensi, atau gambar.
              </p>
            </Card>

            {/* Card: Excerpt (Ringkasan) */}
            <Card surface="white" className="p-5 sm:p-7 rounded-[32px] border border-hairline-mist space-y-2">
              <Textarea
                name="excerpt"
                label="Ringkasan Singkat (Excerpt)"
                placeholder="Tulis ringkasan 1-2 kalimat untuk kartu artikel di halaman blog dan cuplikan meta SEO..."
                defaultValue={article?.excerpt || ''}
                rows={3}
                disabled={isPending}
              />
              <p className="text-[12px] text-stone-gray">
                Ringkasan ini akan tampil pada feed daftar artikel blog publik dan cuplikan media sosial.
              </p>
            </Card>
          </div>

          {/* Right Column: Metadata, Cover, Linked Products, Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card: Publikasi & Status */}
            <Card surface="white" className="p-5 sm:p-6 rounded-[32px] border border-hairline-mist space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-hairline-mist">
                <FileEdit className="w-4 h-4 text-stone-gray" />
                <h3 className="text-[16px] font-semibold text-ink-black">
                  Pengaturan Publikasi
                </h3>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-ink-black mb-1.5">
                  Status Terbit
                </label>
                <select
                  name="status"
                  defaultValue={article?.status || 'published'}
                  disabled={isPending}
                  className="w-full bg-pure-white text-ink-black px-3.5 py-2.5 rounded-[16px] border border-hairline-mist focus:border-fresh-grass focus:outline-none text-[14px]"
                >
                  <option value="published">Publikasikan (Bisa diakses publik)</option>
                  <option value="draft">Simpan sebagai Draft (Hanya admin)</option>
                </select>
              </div>

              <div>
                <Input
                  name="author_name"
                  label="Nama Penulis"
                  defaultValue={article?.author_name || 'Tim Editorial Kodeva'}
                  placeholder="Tim Editorial Kodeva"
                  disabled={isPending}
                />
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  type="submit"
                  variant="grass-pill"
                  size="lg"
                  className="w-full justify-center shadow-sm"
                  disabled={isPending}
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>
                    {isPending
                      ? isEdit
                        ? 'Menyimpan...'
                        : 'Menerbitkan...'
                      : isEdit
                      ? 'Simpan Perubahan'
                      : 'Terbitkan Artikel'}
                  </span>
                </Button>

                <Link
                  href="/admin/articles"
                  className="block text-center text-[13px] text-stone-gray hover:text-ink-black py-1.5 transition-colors font-medium"
                >
                  Batal dan kembali
                </Link>
              </div>
            </Card>

            {/* Card: Kategori Artikel */}
            <Card surface="white" className="p-5 sm:p-6 rounded-[32px] border border-hairline-mist space-y-3">
              <h3 className="text-[16px] font-semibold text-ink-black">
                Kategori Artikel
              </h3>
              <select
                name="category_id"
                defaultValue={article?.category_id || ''}
                disabled={isPending}
                className="w-full bg-pure-white text-ink-black px-3.5 py-2.5 rounded-[16px] border border-hairline-mist focus:border-fresh-grass focus:outline-none text-[14px]"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="text-[12px] text-stone-gray">
                Mengelompokkan artikel pada tab filter blog publik.
              </p>
            </Card>

            {/* Card: Cover Gambar Artikel (Supabase Storage) */}
            <Card surface="white" className="p-5 sm:p-6 rounded-[32px] border border-hairline-mist space-y-3">
              <h3 className="text-[16px] font-semibold text-ink-black">
                Cover Gambar
              </h3>
              <ImageUploader
                name="cover_url"
                label="Unggah Cover (Supabase Storage)"
                folder="articles"
                defaultValue={article?.cover_url || ''}
                helperText="Format PNG/JPG/WebP max 2MB."
              />
              <Input
                name="cover_alt"
                label="Alt Teks Gambar"
                defaultValue={article?.cover_alt || ''}
                placeholder="Deskripsi singkat cover untuk aksesibilitas..."
                disabled={isPending}
              />
            </Card>

            {/* Card: Tautkan Produk Marketplace */}
            {products.length > 0 && (
              <Card surface="white" className="p-5 sm:p-6 rounded-[32px] border border-hairline-mist space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[16px] font-semibold text-ink-black">
                      Tautkan Produk Marketplace
                    </h3>
                    <p className="text-[12px] text-stone-gray">
                      Tampil di bagian rekomendasi bawah artikel.
                    </p>
                  </div>
                  {selectedProductIds.length > 0 && (
                    <Badge variant="coral">
                      {selectedProductIds.length} Dipilih
                    </Badge>
                  )}
                </div>

                {products.length > 5 && (
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Cari produk..."
                    className="w-full bg-cream-paper/60 px-3 py-1.5 text-[13px] rounded-[12px] border border-hairline-mist focus:border-fresh-grass focus:outline-none"
                  />
                )}

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-hairline-mist/40">
                  {filteredProducts.map((prod) => {
                    const isChecked = selectedProductIds.includes(prod.id);
                    return (
                      <label
                        key={prod.id}
                        className="flex items-center gap-2.5 pt-2 first:pt-0 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          name="linked_product_ids"
                          value={prod.id}
                          checked={isChecked}
                          onChange={() => toggleProduct(prod.id)}
                          className="w-4 h-4 rounded text-fresh-grass focus:ring-fresh-grass cursor-pointer shrink-0"
                        />
                        <div className="relative w-8 h-8 rounded-[8px] bg-sandstone overflow-hidden shrink-0 flex items-center justify-center">
                          {prod.thumbnail_url ? (
                            <Image
                              src={prod.thumbnail_url}
                              alt={prod.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-stone-gray" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[13px] font-medium text-ink-black block truncate group-hover:text-fresh-grass transition-colors">
                            {prod.name}
                          </span>
                          <span className="text-[11px] text-stone-gray font-mono block truncate">
                            /produk/{prod.slug}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
