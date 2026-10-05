import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleDetailPage } from '@/views/article-detail';
import { getArticleBySlug, getArticleLinkedProducts } from '@/entities/article/server';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.cover_url ? [article.cover_url] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const linkedProducts = await getArticleLinkedProducts(article.id);

  return <ArticleDetailPage article={article} linkedProducts={linkedProducts} />;
}

