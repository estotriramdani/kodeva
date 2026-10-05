'use client';

import React, { useState, useActionState } from 'react';
import Link from 'next/link';
import { Card, Badge, Button, Modal, Input, Textarea } from '@/shared/ui';
import { createArticleAction, deleteArticleAction, type ActionState } from '@/features/manage-articles';
import { formatDateID } from '@/shared/lib';
import type { Article } from '@/entities/article';
import type { Category } from '@/entities/category';

export interface AdminArticlesPageProps {
  articles: Article[];
  categories: Category[];
}

const initialActionState: ActionState = {};

export function AdminArticlesPage({
  articles,
  categories,
}: AdminArticlesPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createArticleAction, initialActionState);

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
            Artikel & Edukasi Blog
          </h1>
          <p className="text-[15px] text-stone-gray mt-1">
            Tulis dan publikasikan panduan komparasi software untuk calon pembeli.
          </p>
        </div>

        <Button
          variant="grass-pill"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Tulis Artikel Baru
        </Button>
      </div>

      {/* Articles Table Card */}
      <Card surface="white" className="p-6 sm:p-8 rounded-[35px] border border-hairline-mist">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[20px] font-semibold text-ink-black">
            Daftar Artikel ({articles.length})
          </h3>
        </div>

        {articles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-hairline-mist text-stone-gray font-medium">
                  <th className="pb-3 pr-4">Judul</th>
                  <th className="pb-3 pr-4">Kategori</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Penulis</th>
                  <th className="pb-3 pr-4">Tanggal Terbit</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-mist/50">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-cream-paper/40 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div>
                        <span className="font-semibold text-ink-black block">
                          {article.title}
                        </span>
                        <span className="text-[12px] text-stone-gray font-mono">
                          /artikel/{article.slug}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      {article.category ? (
                        <Badge variant="neutral">{article.category.name}</Badge>
                      ) : (
                        <span className="text-stone-gray">-</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4">
                      {article.status === 'published' ? (
                        <Badge variant="grass">Terbit</Badge>
                      ) : (
                        <Badge variant="neutral">Draft</Badge>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 text-stone-gray">
                      {article.author_name || '-'}
                    </td>
                    <td className="py-3.5 pr-4 text-stone-gray whitespace-nowrap">
                      {formatDateID(article.published_at || article.created_at)}
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <Link
                        href={`/artikel/${article.slug}`}
                        target="_blank"
                        className="text-[13px] text-stone-gray hover:text-ink-black hover:underline"
                      >
                        Baca ↗
                      </Link>
                      <button
                        onClick={async () => {
                          if (confirm(`Yakin ingin menghapus artikel "${article.title}"?`)) {
                            await deleteArticleAction(article.id);
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
            <span className="text-3xl block mb-2">📝</span>
            <p className="font-medium text-ink-black">Belum ada artikel yang ditulis.</p>
            <p className="text-[13px] text-stone-gray mt-1">
              Klik tombol &quot;+ Tulis Artikel Baru&quot; di atas untuk membuat postingan pertama.
            </p>
          </div>
        )}
      </Card>

      {/* Modal Tulis Artikel */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tulis Artikel Baru"
        description="Publikasikan ulasan komparasi software atau panduan bisnis."
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
              name="title"
              label="Judul Artikel *"
              placeholder="Contoh: 5 Software Akuntansi Terbaik di Indonesia"
              required
              disabled={isPending}
            />

            <Input
              name="slug"
              label="Slug URL *"
              placeholder="contoh: software-akuntansi-terbaik"
              required
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[14px] font-medium text-ink-black mb-1.5">
                Kategori Artikel
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

            <div>
              <label className="block text-[14px] font-medium text-ink-black mb-1.5">
                Status Publikasi
              </label>
              <select
                name="status"
                defaultValue="published"
                disabled={isPending}
                className="w-full bg-pure-white text-ink-black px-4 py-3 rounded-[20px] border border-hairline-mist focus:border-fresh-grass focus:outline-none text-[15px]"
              >
                <option value="published">Langsung Publikasi</option>
                <option value="draft">Simpan sebagai Draft</option>
              </select>
            </div>

            <Input
              name="author_name"
              label="Nama Penulis"
              placeholder="Tim Editorial Kodeva"
              defaultValue="Tim Editorial Kodeva"
              disabled={isPending}
            />
          </div>

          <Textarea
            name="excerpt"
            label="Ringkasan Singkat (Excerpt)"
            placeholder="Kutipan 1-2 kalimat untuk kartu artikel dan ringkasan pencarian..."
            rows={2}
            disabled={isPending}
          />

          <Textarea
            name="content_html"
            label="Konten HTML Artikel"
            placeholder="<p>Isi artikel dalam format HTML...</p>&#10;<h2>1. Mekari Jurnal</h2>&#10;<p>Fitur utama meliputi...</p>"
            rows={6}
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
              {isPending ? 'Menerbitkan...' : 'Terbitkan Artikel'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
