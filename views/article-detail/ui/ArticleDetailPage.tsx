import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { Container, Card, Badge } from '@/shared/ui';
import { ArticleContent, type Article } from '@/entities/article';
import { ProductCard, type Product } from '@/entities/product';
import { formatDateID } from '@/shared/lib';
import { LeadForm } from '@/features/submit-lead';

export interface ArticleDetailPageProps {
  article: Article;
  linkedProducts?: Product[];
}

export function ArticleDetailPage({ article, linkedProducts = [] }: ArticleDetailPageProps) {
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
          <Card surface="white" className="p-8 sm:p-14 border border-hairline-mist mb-12">
            <ArticleContent contentHtml={article.content_html} />
          </Card>

          {/* Produk Tertaut dari Marketplace (Requirement A.10) */}
          {linkedProducts && linkedProducts.length > 0 && (
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-sandstone/60 flex items-center justify-center shrink-0 text-ink-black">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[22px] sm:text-[26px] font-medium text-ink-black leading-tight">
                    Produk Rekomendasi Terkait Artikel Ini
                  </h3>
                  <p className="text-[14px] text-stone-gray mt-0.5">
                    Solusi software yang dibahas dalam artikel ini dengan kuota promo diskon aktif.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {linkedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

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
