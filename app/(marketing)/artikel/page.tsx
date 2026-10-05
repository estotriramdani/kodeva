import type { Metadata } from 'next';
import { ArticleListPage } from '@/views/article-list';
import { getPublishedArticles } from '@/entities/article/server';

export const metadata: Metadata = {
  title: 'Artikel & Panduan Software Bisnis',
  description:
    'Kumpulan artikel mendalam, perbandingan fitur software, dan strategi transformasi digital untuk bisnis Indonesia.',
};

export const revalidate = 120;

export default async function Page() {
  const articles = await getPublishedArticles();

  return <ArticleListPage articles={articles} />;
}
