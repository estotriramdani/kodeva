'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/api/supabase/server';
import type { CategoryType } from '@/entities/category';

export interface ActionState {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function createCategoryAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const type = ((formData.get('type') as string) || 'product') as CategoryType;

  if (!name || !slug) {
    return { error: 'Nama dan Slug kategori wajib diisi.' };
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return { error: 'Slug harus berupa huruf kecil, angka, dan tanda strip (contoh: pos-kasir).' };
  }

  const supabase = await createServerClient();

  const { error } = await supabase.from('categories').insert({
    name,
    slug,
    type,
  });

  if (error) {
    console.error('Error creating category:', error.message);
    if (error.code === '23505') {
      return { error: `Kategori "${slug}" untuk tipe ${type} sudah ada.` };
    }
    return { error: `Gagal membuat kategori: ${error.message}` };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/produk');
  revalidatePath('/artikel');

  return {
    success: true,
    message: `Kategori "${name}" berhasil ditambahkan!`,
  };
}

export async function deleteCategoryAction(categoryId: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from('categories').delete().eq('id', categoryId);

  if (error) {
    console.error('Error deleting category:', error.message);
    throw new Error(error.message);
  }

  revalidatePath('/admin/categories');
  revalidatePath('/produk');
  revalidatePath('/artikel');
}
