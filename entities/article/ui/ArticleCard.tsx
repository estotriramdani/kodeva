import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, Badge } from '@/shared/ui';
import { formatDateID } from '@/shared/lib';
import type { Article } from '../model/types';

export interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card
      surface="white"
      className="flex flex-col justify-between h-full group hover:border-ink-black/20 transition-all border border-transparent"
    >
      <div>
        {/* Cover Image */}
        <div className="relative w-full h-48 rounded-[30px] bg-sandstone overflow-hidden mb-5 flex items-center justify-center">
          {article.cover_url ? (
            <Image
              src={article.cover_url}
              alt={article.cover_alt || article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-stone-gray/40 text-3xl font-bold uppercase select-none">
              Kodeva Blog
            </div>
          )}
        </div>

        {/* Kategori & Tanggal */}
        <div className="flex items-center gap-2 mb-3">
          {article.category && (
            <Badge variant="neutral">{article.category.name}</Badge>
          )}
          <span className="text-[13px] text-stone-gray">
            {formatDateID(article.published_at || article.created_at)}
          </span>
        </div>

        {/* Judul */}
        <h3 className="text-[22px] font-medium text-ink-black leading-snug group-hover:text-ink-black/80 transition-colors">
          <Link href={`/artikel/${article.slug}`}>{article.title}</Link>
        </h3>

        {/* Ringkasan */}
        {article.excerpt && (
          <p className="text-[15px] text-stone-gray mt-2.5 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        )}
      </div>

      {/* Footer Kartu */}
      <div className="pt-5 mt-5 border-t border-hairline-mist/50 flex items-center justify-between">
        <span className="text-[13px] text-stone-gray">
          Oleh {article.author_name || 'Tim Editorial Kodeva'}
        </span>
        <Link
          href={`/artikel/${article.slug}`}
          className="text-[14px] font-medium text-ink-black underline decoration-stone-gray/50 hover:decoration-ink-black transition-colors"
        >
          Baca Selengkapnya →
        </Link>
      </div>
    </Card>
  );
}
