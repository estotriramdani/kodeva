import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Container, Button } from '@/shared/ui';
import { ArticleCard, type Article } from '@/entities/article';

export interface ArticleListPageProps {
  articles: Article[];
  currentPage?: number;
  totalPages?: number;
}

export function ArticleListPage({
  articles,
  currentPage = 1,
  totalPages = 1,
}: ArticleListPageProps) {
  return (
    <div className="py-10 sm:py-16">
      <Container>
        {/* Header Blog */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-[36px] sm:text-[53px] font-medium text-ink-black leading-tight tracking-tight">
            Artikel & Edukasi Software Bisnis
          </h1>
          <p className="text-[17px] sm:text-[19px] text-stone-gray mt-3 leading-relaxed">
            Panduan praktis, ulasan komparasi fitur, dan kiat memilih teknologi SaaS yang efektif untuk pertumbuhan bisnis.
          </p>
        </div>

        {/* Grid Artikel */}
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination Controls (Requirement A.8) */}
            {totalPages > 1 && (
              <div className="mt-12 pt-8 border-t border-hairline-mist flex items-center justify-center gap-3">
                {currentPage > 1 ? (
                  <Link href={`/artikel?page=${currentPage - 1}`}>
                    <Button variant="ghost-pill" size="sm">
                      &larr; Halaman Sebelumnya
                    </Button>
                  </Link>
                ) : (
                  <Button variant="ghost-pill" size="sm" disabled className="opacity-40">
                    &larr; Halaman Sebelumnya
                  </Button>
                )}

                <div className="flex items-center gap-1.5 px-3">
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => {
                    const isActive = p === currentPage;
                    return (
                      <Link key={p} href={`/artikel?page=${p}`}>
                        <span
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                            isActive
                              ? 'bg-ink-black text-pure-white shadow-xs'
                              : 'bg-pure-white text-ink-black hover:bg-sandstone border border-hairline-mist'
                          }`}
                        >
                          {p}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {currentPage < totalPages ? (
                  <Link href={`/artikel?page=${currentPage + 1}`}>
                    <Button variant="ghost-pill" size="sm">
                      Halaman Selanjutnya &rarr;
                    </Button>
                  </Link>
                ) : (
                  <Button variant="ghost-pill" size="sm" disabled className="opacity-40">
                    Halaman Selanjutnya &rarr;
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-pure-white rounded-[50px] p-8 border border-hairline-mist max-w-xl mx-auto">
            <FileText className="w-12 h-12 text-stone-gray/60 mx-auto mb-3" />
            <h3 className="text-[22px] font-medium text-ink-black mb-2">
              Belum Ada Artikel yang Dipublikasikan
            </h3>
            <p className="text-[15px] text-stone-gray leading-relaxed">
              Tim editorial kami sedang menyiapkan ulasan dan panduan menarik untuk Anda.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
