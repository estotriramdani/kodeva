import type { Metadata } from 'next';
import { ArticleListPage } from '@/views/article-list';
import { getPublishedArticles } from '@/entities/article/server';

export const metadata: Metadata = {
  title: 'Artikel & Panduan Software Bisnis',
  description:
    'Kumpulan artikel mendalam, perbandingan fitur software, dan strategi transformasi digital untuk bisnis Indonesia.',
};

export const revalidate = 120;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageNumber = Math.max(1, parseInt(page || '1', 10) || 1);
  const result = await getPublishedArticles({ page: pageNumber, pageSize: 6 });

  return (
    <ArticleListPage
      articles={result.articles}
      currentPage={result.currentPage}
      totalPages={result.totalPages}
    />
  );
}

