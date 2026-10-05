'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/api/supabase/server';

export interface ActionState {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function createProductAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const tagline = (formData.get('tagline') as string)?.trim() || null;
  const description = (formData.get('description') as string)?.trim() || '';
  const categoryId = (formData.get('category_id') as string) || null;
  const promoQuota = parseInt(formData.get('promo_quota_remaining') as string, 10) || 0;
  const featuredRankRaw = formData.get('featured_rank') as string;
  const featuredRank = featuredRankRaw ? parseInt(featuredRankRaw, 10) : null;
  const featuresText = (formData.get('features') as string) || '';

  // Parse features (1 per baris atau dipisah koma)
  const features = featuresText
    .split(/[\n,]/)
    .map((f) => f.trim())
    .filter(Boolean);

  if (!name || !slug) {
    return { error: 'Nama dan Slug produk wajib diisi.' };
  }

  // Validasi format slug
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return { error: 'Slug harus berupa huruf kecil, angka, dan tanda strip (contoh: pos-resto-pro).' };
  }

  const supabase = await createServerClient();

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name,
      slug,
      tagline,
      description,
      category_id: categoryId || null,
      promo_quota_remaining: promoQuota,
      featured_rank: featuredRank,
      features,
      is_active: true,
      market_code: 'id',
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating product:', error.message);
    if (error.code === '23505') {
      return { error: 'Slug produk sudah digunakan. Silakan gunakan slug lain.' };
    }
    return { error: `Gagal menambahkan produk: ${error.message}` };
  }

  // Tambah paket dasar jika harga diisi
  const planPriceRaw = formData.get('plan_price') as string;
  if (planPriceRaw && product) {
    const price = parseInt(planPriceRaw, 10);
    const promoPriceRaw = formData.get('plan_promo_price') as string;
    const promoPrice = promoPriceRaw ? parseInt(promoPriceRaw, 10) : null;

    if (price > 0) {
      await supabase.from('product_plans').insert({
        product_id: product.id,
        tier: 'basic',
        unit: 'user',
        price,
        promo_price: promoPrice,
        features: ['Fitur Utama', 'Dukungan Standar'],
      });
    }
  }

  revalidatePath('/produk');
  revalidatePath('/admin/products');
  revalidatePath('/');

  return {
    success: true,
    message: `Produk "${name}" berhasil ditambahkan!`,
  };
}

export async function deleteProductAction(productId: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from('products').delete().eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error.message);
    throw new Error(error.message);
  }

  revalidatePath('/produk');
  revalidatePath('/admin/products');
  revalidatePath('/');
}
