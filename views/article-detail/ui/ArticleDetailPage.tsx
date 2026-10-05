import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Card, Badge } from '@/shared/ui';
import { ArticleContent, type Article } from '@/entities/article';
import { formatDateID } from '@/shared/lib';
import { LeadForm } from '@/features/submit-lead';

export interface ArticleDetailPageProps {
  article: Article;
}

export function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-[14px] text-stone-gray flex items-center gap-2">
          <Link href="/" className="hover:text-ink-black transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/artikel" className="hover:text-ink-black transition-colors">
            Artikel
          </Link>
          <span>/</span>
          <span className="text-ink-black font-medium line-clamp-1">{article.title}</span>
        </nav>

        {/* Artikel Container */}
        <div className="max-w-4xl mx-auto">
          {/* Header Artikel */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              {article.category && (
                <Badge variant="neutral">{article.category.name}</Badge>
              )}
              <span className="text-[14px] text-stone-gray">
                {formatDateID(article.published_at || article.created_at)}
              </span>
            </div>

            <h1 className="text-[36px] sm:text-[50px] font-medium text-ink-black leading-tight tracking-tight text-balance">
              {article.title}
            </h1>

            {article.author_name && (
              <p className="text-[15px] text-stone-gray mt-4">
                Ditulis oleh <span className="font-semibold text-ink-black">{article.author_name}</span>
              </p>
            )}
          </div>

          {/* Cover Gambar */}
          {article.cover_url && (
            <div className="relative w-full h-72 sm:h-[450px] rounded-[40px] bg-sandstone overflow-hidden mb-12 border border-hairline-mist">
              <Image
                src={article.cover_url}
                alt={article.cover_alt || article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Konten Artikel */}
          <Card surface="white" className="p-8 sm:p-14 border border-hairline-mist mb-16">
            <ArticleContent contentHtml={article.content_html} />
          </Card>

          {/* Bottom Lead Banner */}
          <Card surface="sandstone" className="p-8 sm:p-10 text-center border border-hairline-mist mb-12">
            <h3 className="text-[24px] sm:text-[28px] font-medium text-ink-black mb-2">
              Butuh Rekomendasi Software untuk Bisnis Anda?
            </h3>
            <p className="text-[15px] text-stone-gray max-w-lg mx-auto mb-6">
              Tim Kodeva siap memberikan konsultasi gratis dan penawaran lisensi resmi dengan diskon terbaik.
            </p>
            <div className="max-w-md mx-auto text-left">
              <LeadForm sourceCta={`article_bottom_${article.slug}`} />
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
