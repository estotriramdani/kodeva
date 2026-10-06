'use server';

import { createServerClient } from '@/shared/api/supabase/server';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload single media file to Supabase Storage bucket 'media'
 */
export async function uploadMediaAction(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File | null;
    const folder = ((formData.get('folder') as string) || 'general')
      .replace(/[^a-z0-9_-]/gi, '')
      .toLowerCase();

    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false, error: 'Silakan pilih file gambar terlebih dahulu.' };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Format gambar (${file.type || 'unknown'}) tidak didukung. Harap gunakan format JPEG, PNG, WebP, atau AVIF.`,
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return {
        success: false,
        error: `Ukuran file (${sizeMb} MB) melebihi batas maksimal 2 MB.`,
      };
    }

    const supabase = await createServerClient();

    // Verifikasi sesi editor/admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Sesi autentikasi Anda tidak valid atau telah berakhir. Silakan login kembali ke admin.',
      };
    }

    // Bersihkan nama file dan tambahkan timestamp agar unik
    const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const rawName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
    const cleanBaseName = rawName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'media';

    const uniqueFileName = `${Date.now()}-${cleanBaseName}.${ext}`;
    const storagePath = `${folder}/${uniqueFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      if (
        uploadError.message?.includes('row-level security') ||
        uploadError.message?.includes('violates row-level security')
      ) {
        return {
          success: false,
          error:
            'Gagal mengupload ke Supabase Storage: Akses ditolak oleh Row-Level Security (RLS). Akun Anda belum terdaftar sebagai editor/admin di tabel public.profiles.',
        };
      }
      return {
        success: false,
        error: `Gagal mengupload ke Supabase Storage: ${uploadError.message}`,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(storagePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: storagePath,
    };
  } catch (err: unknown) {
    console.error('Upload exception:', err);
    const message =
      err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat mengunggah file.';
    return { success: false, error: message };
  }
}

/**
 * Delete a media file from Supabase Storage bucket 'media'
 */
export async function deleteMediaAction(storagePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!storagePath) {
      return { success: false, error: 'Path file tidak valid.' };
    }

    const supabase = await createServerClient();
    const { error } = await supabase.storage.from('media').remove([storagePath]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus file.';
    return { success: false, error: message };
  }
}
