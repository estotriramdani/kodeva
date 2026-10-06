'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, FileText, Plus, ExternalLink, Trash2, Edit3 } from 'lucide-react';
import { Card, Badge } from '@/shared/ui';
import { deleteArticleAction } from '@/features/manage-articles';
import { formatDateID } from '@/shared/lib';
import type { Article } from '@/entities/article';
import type { Category } from '@/entities/category';
import type { Product } from '@/entities/product';

export interface AdminArticlesPageProps {
  articles: Article[];
  categories: Category[];
  products?: Product[];
}

export function AdminArticlesPage({
  articles,
}: AdminArticlesPageProps) {
  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-ink-black tracking-tight">
            Artikel & Edukasi Blog
          </h1>
          <p className="text-[15px] text-stone-gray mt-1">
            Tulis ulasan software, panduan, tautkan produk marketplace, dan publikasikan artikel blog.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-fresh-grass text-ink-black font-semibold text-[15px] hover:opacity-90 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </Link>
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
                  <th className="pb-3 pr-4">Cover</th>
                  <th className="pb-3 pr-4">Judul</th>
                  <th className="pb-3 pr-4">Kategori</th>
                  <th className="pb-3 pr-4">Produk Tertaut</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Penulis</th>
                  <th className="pb-3 pr-4">Tanggal Terbit</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-mist/50">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-cream-paper/40 transition-colors">
                    {/* Cover Preview */}
                    <td className="py-3.5 pr-4">
                      <div className="relative w-14 h-10 rounded-[12px] bg-sandstone overflow-hidden border border-hairline-mist flex items-center justify-center shrink-0">
                        {article.cover_url ? (
                          <Image
                            src={article.cover_url}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-stone-gray">BLOG</span>
                        )}
                      </div>
                    </td>

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
                      {article.linked_product_ids && article.linked_product_ids.length > 0 ? (
                        <Badge variant="coral" className="inline-flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          <span>{article.linked_product_ids.length} Produk</span>
                        </Badge>
                      ) : (
                        <span className="text-stone-gray text-[13px]">-</span>
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
                    <td className="py-3.5 text-right space-x-3 whitespace-nowrap">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="inline-flex items-center gap-1 text-[13px] text-fresh-grass hover:underline font-medium"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>
                      <Link
                        href={`/artikel/${article.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[13px] text-stone-gray hover:text-ink-black hover:underline"
                      >
                        <span>Baca</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={async () => {
                          if (confirm(`Yakin ingin menghapus artikel "${article.title}"?`)) {
                            await deleteArticleAction(article.id);
                          }
                        }}
                        className="inline-flex items-center gap-1 text-[13px] text-coral-pop hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-stone-gray">
            <FileText className="w-10 h-10 text-stone-gray/60 mx-auto mb-2" />
            <p className="font-medium text-ink-black">Belum ada artikel yang ditulis.</p>
            <p className="text-[13px] text-stone-gray mt-1 mb-4">
              Mulai buat ulasan produk software bisnis dengan editor rich text.
            </p>
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-fresh-grass text-ink-black font-semibold text-[14px] hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Artikel Baru</span>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
