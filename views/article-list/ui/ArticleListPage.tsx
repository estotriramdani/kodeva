import React from 'react';
import { Container } from '@/shared/ui';
import { ArticleCard, type Article } from '@/entities/article';

export interface ArticleListPageProps {
  articles: Article[];
}

export function ArticleListPage({ articles }: ArticleListPageProps) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-pure-white rounded-[50px] p-8 border border-hairline-mist max-w-xl mx-auto">
            <span className="text-4xl block mb-3">📝</span>
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
