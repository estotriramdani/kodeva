'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/api/supabase/server';
import { uploadMediaAction } from '@/features/upload-media';
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
  const coverAlt = (formData.get('cover_alt') as string)?.trim() || title || null;

  let coverUrl = (formData.get('cover_url') as string)?.trim() || null;

  // Cek apakah ada file cover mentah yang dilampirkan via input file
  const coverFile = formData.get('cover_file') as File | null;
  if (coverFile && coverFile instanceof File && coverFile.size > 0) {
    const uploadForm = new FormData();
    uploadForm.append('file', coverFile);
    uploadForm.append('folder', 'articles');
    const uploadRes = await uploadMediaAction(uploadForm);
    if (uploadRes.success && uploadRes.url) {
      coverUrl = uploadRes.url;
    } else if (uploadRes.error) {
      return { error: `Gagal upload gambar cover artikel: ${uploadRes.error}` };
    }
  }

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
    cover_url: coverUrl,
    cover_alt: coverAlt,
    status,
    author_name: authorName,
    market_code: 'id',
  });

  if (error) {
    console.error('Error creating article:', error.message);
    if (error.code === '23505') {
      return { error: 'Slug artikel ini sudah digunakan. Silakan gunakan slug lain.' };
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

export async function updateArticleAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const excerpt = (formData.get('excerpt') as string)?.trim() || null;
  const contentHtml = (formData.get('content_html') as string)?.trim() || '<p>Konten artikel...</p>';
  const categoryId = (formData.get('category_id') as string) || null;
  const status = ((formData.get('status') as string) || 'published') as ArticleStatus;
  const authorName = (formData.get('author_name') as string)?.trim() || 'Tim Editorial Kodeva';
  const coverAlt = (formData.get('cover_alt') as string)?.trim() || title || null;

  let coverUrl = (formData.get('cover_url') as string)?.trim() || null;

  // Cek apakah ada file cover mentah yang diunggah
  const coverFile = formData.get('cover_file') as File | null;
  if (coverFile && coverFile instanceof File && coverFile.size > 0) {
    const uploadForm = new FormData();
    uploadForm.append('file', coverFile);
    uploadForm.append('folder', 'articles');
    const uploadRes = await uploadMediaAction(uploadForm);
    if (uploadRes.success && uploadRes.url) {
      coverUrl = uploadRes.url;
    } else if (uploadRes.error) {
      return { error: `Gagal upload gambar cover artikel: ${uploadRes.error}` };
    }
  }

  if (!id) {
    return { error: 'ID artikel tidak ditemukan.' };
  }

  if (!title || !slug) {
    return { error: 'Judul dan Slug artikel wajib diisi.' };
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return { error: 'Slug harus berupa huruf kecil, angka, dan tanda strip.' };
  }

  const supabase = await createServerClient();

  const { error } = await supabase
    .from('articles')
    .update({
      title,
      slug,
      excerpt,
      content_html: contentHtml,
      category_id: categoryId || null,
      cover_url: coverUrl,
      cover_alt: coverAlt,
      status,
      author_name: authorName,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating article:', error.message);
    if (error.code === '23505') {
      return { error: 'Slug artikel ini sudah digunakan oleh artikel lain.' };
    }
    return { error: `Gagal memperbarui artikel: ${error.message}` };
  }

  revalidatePath('/artikel');
  revalidatePath(`/artikel/${slug}`);
  revalidatePath('/admin/articles');
  revalidatePath('/');

  return {
    success: true,
    message: `Artikel "${title}" berhasil diperbarui!`,
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
