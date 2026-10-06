'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/api/supabase/server';
import { uploadMediaAction } from '@/features/upload-media';

export interface ActionState {
  success?: boolean;
  error?: string;
  message?: string;
}

// ============================================================================
// 1. HERO SECTION ACTIONS
// ============================================================================

export async function updateHeroAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const title = (formData.get('title') as string)?.trim();
  const subtitle = (formData.get('subtitle') as string)?.trim() || null;
  const ctaLabel = (formData.get('cta_label') as string)?.trim() || 'Lihat Promo';
  const ctaHref = (formData.get('cta_href') as string)?.trim() || '/produk';
  const campaignName = (formData.get('campaign_name') as string)?.trim() || 'Promo Akhir Tahun';
  const imageAlt = (formData.get('image_alt') as string)?.trim() || title || null;

  let imageUrl = (formData.get('image_url') as string)?.trim() || null;

  // Cek apakah ada upload file gambar hero mentah
  const imageFile = formData.get('image_file') as File | null;
  if (imageFile && imageFile instanceof File && imageFile.size > 0) {
    const uploadForm = new FormData();
    uploadForm.append('file', imageFile);
    uploadForm.append('folder', 'hero');
    const uploadRes = await uploadMediaAction(uploadForm);
    if (uploadRes.success && uploadRes.url) {
      imageUrl = uploadRes.url;
    } else if (uploadRes.error) {
      return { error: `Gagal upload gambar banner hero: ${uploadRes.error}` };
    }
  }

  if (!title) {
    return { error: 'Judul utama Hero wajib diisi.' };
  }

  const supabase = await createServerClient();

  const { error } = await supabase
    .from('landing_hero')
    .upsert({
      market_code: 'id',
      title,
      subtitle,
      image_url: imageUrl,
      image_alt: imageAlt,
      cta_label: ctaLabel,
      cta_href: ctaHref,
      campaign_name: campaignName,
    });

  if (error) {
    console.error('Error updating hero section:', error.message);
    if (error.code === '42501' || error.message.includes('row-level security')) {
      return {
        error:
          'Gagal memperbarui Hero: Akses ditolak oleh Row-Level Security (RLS) database. Akun Anda belum memiliki hak akses editor/admin di tabel public.profiles.',
      };
    }
    return { error: `Gagal memperbarui Hero: ${error.message}` };
  }

  revalidatePath('/');
  revalidatePath('/admin/landing');

  return {
    success: true,
    message: 'Konten Hero Section berhasil diperbarui!',
  };
}

// ============================================================================
// 2. TESTIMONIAL ACTIONS
// ============================================================================

export async function createTestimonialAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const name = (formData.get('name') as string)?.trim();
  const role = (formData.get('role') as string)?.trim() || null;
  const company = (formData.get('company') as string)?.trim() || null;
  const quote = (formData.get('quote') as string)?.trim();
  const rank = parseInt(formData.get('rank') as string, 10) || 0;
  const isPublished = formData.get('is_published') === 'true';

  let avatarUrl = (formData.get('avatar_url') as string)?.trim() || null;

  // Cek avatar file
  const avatarFile = formData.get('avatar_file') as File | null;
  if (avatarFile && avatarFile instanceof File && avatarFile.size > 0) {
    const uploadForm = new FormData();
    uploadForm.append('file', avatarFile);
    uploadForm.append('folder', 'testimonials');
    const uploadRes = await uploadMediaAction(uploadForm);
    if (uploadRes.success && uploadRes.url) {
      avatarUrl = uploadRes.url;
    } else if (uploadRes.error) {
      return { error: `Gagal upload avatar testimoni: ${uploadRes.error}` };
    }
  }

  if (!name || !quote) {
    return { error: 'Nama dan Kutipan Testimoni wajib diisi.' };
  }

  const supabase = await createServerClient();

  const { error } = await supabase.from('testimonials').insert({
    name,
    role,
    company,
    quote,
    avatar_url: avatarUrl,
    rank,
    is_published: isPublished,
    market_code: 'id',
  });

  if (error) {
    console.error('Error creating testimonial:', error.message);
    return { error: `Gagal menambahkan testimoni: ${error.message}` };
  }

  revalidatePath('/');
  revalidatePath('/admin/landing');

  return {
    success: true,
    message: `Testimoni dari "${name}" berhasil ditambahkan!`,
  };
}

export async function updateTestimonialAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  const name = (formData.get('name') as string)?.trim();
  const role = (formData.get('role') as string)?.trim() || null;
  const company = (formData.get('company') as string)?.trim() || null;
  const quote = (formData.get('quote') as string)?.trim();
  const rank = parseInt(formData.get('rank') as string, 10) || 0;
  const isPublished = formData.get('is_published') === 'true';

  let avatarUrl = (formData.get('avatar_url') as string)?.trim() || null;

  // Cek avatar file
  const avatarFile = formData.get('avatar_file') as File | null;
  if (avatarFile && avatarFile instanceof File && avatarFile.size > 0) {
    const uploadForm = new FormData();
    uploadForm.append('file', avatarFile);
    uploadForm.append('folder', 'testimonials');
    const uploadRes = await uploadMediaAction(uploadForm);
    if (uploadRes.success && uploadRes.url) {
      avatarUrl = uploadRes.url;
    } else if (uploadRes.error) {
      return { error: `Gagal upload avatar testimoni: ${uploadRes.error}` };
    }
  }

  if (!id) {
    return { error: 'ID testimoni tidak valid.' };
  }

  if (!name || !quote) {
    return { error: 'Nama dan Kutipan Testimoni wajib diisi.' };
  }

  const supabase = await createServerClient();

  const { error } = await supabase
    .from('testimonials')
    .update({
      name,
      role,
      company,
      quote,
      avatar_url: avatarUrl,
      rank,
      is_published: isPublished,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating testimonial:', error.message);
    return { error: `Gagal memperbarui testimoni: ${error.message}` };
  }

  revalidatePath('/');
  revalidatePath('/admin/landing');

  return {
    success: true,
    message: `Testimoni dari "${name}" berhasil diperbarui!`,
  };
}

export async function deleteTestimonialAction(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from('testimonials').delete().eq('id', id);

  if (error) {
    console.error('Error deleting testimonial:', error.message);
    throw new Error(error.message);
  }

  revalidatePath('/');
  revalidatePath('/admin/landing');
}

// ============================================================================
// 3. FAQ ACTIONS
// ============================================================================

export async function createFaqAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const question = (formData.get('question') as string)?.trim();
  const answer = (formData.get('answer') as string)?.trim();
  const rank = parseInt(formData.get('rank') as string, 10) || 0;
  const isPublished = formData.get('is_published') === 'true';

  if (!question || !answer) {
    return { error: 'Pertanyaan dan Jawaban FAQ wajib diisi.' };
  }

  const supabase = await createServerClient();

  const { error } = await supabase.from('faqs').insert({
    question,
    answer,
    rank,
    is_published: isPublished,
    market_code: 'id',
  });

  if (error) {
    console.error('Error creating FAQ:', error.message);
    return { error: `Gagal menambahkan FAQ: ${error.message}` };
  }

  revalidatePath('/');
  revalidatePath('/admin/landing');

  return {
    success: true,
    message: 'FAQ baru berhasil ditambahkan!',
  };
}

export async function updateFaqAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  const question = (formData.get('question') as string)?.trim();
  const answer = (formData.get('answer') as string)?.trim();
  const rank = parseInt(formData.get('rank') as string, 10) || 0;
  const isPublished = formData.get('is_published') === 'true';

  if (!id) {
    return { error: 'ID FAQ tidak valid.' };
  }

  if (!question || !answer) {
    return { error: 'Pertanyaan dan Jawaban FAQ wajib diisi.' };
  }

  const supabase = await createServerClient();

  const { error } = await supabase
    .from('faqs')
    .update({
      question,
      answer,
      rank,
      is_published: isPublished,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating FAQ:', error.message);
    return { error: `Gagal memperbarui FAQ: ${error.message}` };
  }

  revalidatePath('/');
  revalidatePath('/admin/landing');

  return {
    success: true,
    message: 'FAQ berhasil diperbarui!',
  };
}

export async function deleteFaqAction(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from('faqs').delete().eq('id', id);

  if (error) {
    console.error('Error deleting FAQ:', error.message);
    throw new Error(error.message);
  }

  revalidatePath('/');
  revalidatePath('/admin/landing');
}
