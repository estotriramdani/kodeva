'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/api/supabase/server';
import type { ArticleStatus } from '@/entities/article';

export interface ActionState {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function createArticleAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const excerpt = (formData.get('excerpt') as string)?.trim() || null;
  const contentHtml = (formData.get('content_html') as string)?.trim() || '<p>Konten artikel...</p>';
  const categoryId = (formData.get('category_id') as string) || null;
  const status = ((formData.get('status') as string) || 'published') as ArticleStatus;
  const authorName = (formData.get('author_name') as string)?.trim() || 'Tim Editorial Kodeva';

  if (!title || !slug) {
    return { error: 'Judul dan Slug artikel wajib diisi.' };
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return { error: 'Slug harus berupa huruf kecil, angka, dan tanda strip (contoh: panduan-memilih-pos).' };
  }

  const supabase = await createServerClient();

  const { error } = await supabase.from('articles').insert({
    title,
    slug,
    excerpt,
    content_html: contentHtml,
    category_id: categoryId || null,
    status,
    author_name: authorName,
    market_code: 'id',
  });

  if (error) {
    console.error('Error creating article:', error.message);
    if (error.code === '23505') {
      return { error: 'Slug artikel ini sudah digunakan.' };
    }
    return { error: `Gagal menerbitkan artikel: ${error.message}` };
  }

  revalidatePath('/artikel');
  revalidatePath('/admin/articles');
  revalidatePath('/');

  return {
    success: true,
    message: `Artikel "${title}" berhasil disimpan!`,
  };
}

export async function deleteArticleAction(articleId: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from('articles').delete().eq('id', articleId);

  if (error) {
    console.error('Error deleting article:', error.message);
    throw new Error(error.message);
  }

  revalidatePath('/artikel');
  revalidatePath('/admin/articles');
  revalidatePath('/');
}
