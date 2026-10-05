'use client';

import React, { useState, useRef, useTransition } from 'react';
import Image from 'next/image';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui';
import { uploadMediaAction } from '../api/upload.actions';

export interface ImageUploaderProps {
  name: string; // Form input name, e.g. 'thumbnail_url' or 'cover_url'
  label: string;
  folder: 'products' | 'articles' | 'hero' | 'testimonials' | 'general' | (string & {});
  defaultValue?: string | null;
  helperText?: string;
  required?: boolean;
}

export function ImageUploader({
  name,
  label,
  folder,
  defaultValue = '',
  helperText = 'Format: PNG, JPG, WebP, AVIF. Maksimal 2 MB.',
  required = false,
}: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>(defaultValue || '');
  const [previewUrl, setPreviewUrl] = useState<string>(defaultValue || '');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [useManualUrl, setUseManualUrl] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sinkronisasi state saat defaultValue berubah dari luar tanpa memicu cascading render effect
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);
  if (defaultValue !== prevDefaultValue) {
    setPrevDefaultValue(defaultValue);
    setImageUrl(defaultValue || '');
    setPreviewUrl(defaultValue || '');
    setErrorMessage('');
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setErrorMessage('');

    // Validasi lokal cepat ukuran (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Ukuran file melebihi 2 MB. Silakan kompres gambar Anda.');
      return;
    }

    // Buat preview lokal instan
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Otomatis unggah ke Supabase Storage
    startTransition(async () => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const result = await uploadMediaAction(formData);

      if (result.success && result.url) {
        setImageUrl(result.url);
        setPreviewUrl(result.url);
      } else {
        setErrorMessage(result.error || 'Gagal mengunggah gambar ke Supabase Storage.');
      }
    });
  };

  const handleRemove = () => {
    setImageUrl('');
    setPreviewUrl('');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isSupabaseHosted = imageUrl.includes('supabase.co/storage');

  return (
    <div className="space-y-2">
      {/* Label & Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-[14px] font-medium text-ink-black">
          {label} {required && <span className="text-coral-pop">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setUseManualUrl(!useManualUrl)}
          className="text-[12px] text-stone-gray hover:text-ink-black underline cursor-pointer"
        >
          {useManualUrl ? '← Unggah File Langsung' : 'Gunakan URL Manual →'}
        </button>
      </div>

      {/* Hidden input agar form submit otomatis membawa URL gambar */}
      <input type="hidden" name={name} value={imageUrl} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isPending}
      />

      {/* Mode 1: Manual URL Input */}
      {useManualUrl ? (
        <div className="space-y-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setPreviewUrl(e.target.value);
            }}
            placeholder="https://images.unsplash.com/... atau URL gambar publik"
            className="w-full bg-pure-white text-ink-black px-4 py-3 rounded-[20px] border border-hairline-mist focus:border-fresh-grass focus:outline-none text-[14px]"
          />
          <p className="text-[12px] text-stone-gray">
            Tempel tautan gambar eksternal (misal dari CDN atau Unsplash).
          </p>
        </div>
      ) : (
        /* Mode 2: Supabase Storage File Uploader */
        <div>
          {previewUrl ? (
            /* Tampilan Preview Setelah File Dipilih / Diunggah */
            <div className="relative rounded-[24px] border border-hairline-mist bg-cream-paper p-3 flex flex-col sm:flex-row items-center gap-4 overflow-hidden">
              {/* Box Thumbnail */}
              <div className="relative w-28 h-24 sm:w-36 sm:h-24 rounded-[18px] bg-sandstone overflow-hidden shrink-0 border border-hairline-mist">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized={previewUrl.startsWith('blob:')}
                />
              </div>

              {/* Status & Kontrol */}
              <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                {isPending ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-fresh-grass text-[13px] font-medium">
                      <span className="inline-block w-3.5 h-3.5 border-2 border-fresh-grass border-t-transparent rounded-full animate-spin" />
                      <span>Mengunggah ke Supabase Bucket &apos;media&apos;...</span>
                    </div>
                    <p className="text-[12px] text-stone-gray">Mohon tunggu sebentar...</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-fresh-grass" />
                      <span className="text-[13px] font-medium text-ink-black">
                        {isSupabaseHosted
                          ? 'Tersimpan di Supabase Storage'
                          : 'Gambar Siap Digunakan'}
                      </span>
                    </div>
                    {imageUrl && (
                      <p className="text-[11px] text-stone-gray font-mono truncate max-w-xs">
                        {imageUrl}
                      </p>
                    )}
                  </div>
                )}

                {/* Tombol Aksi */}
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <Button
                    type="button"
                    variant="ghost-pill"
                    size="sm"
                    disabled={isPending}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Ganti Gambar
                  </Button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handleRemove}
                    className="text-[12px] text-coral-pop hover:underline px-2 py-1 cursor-pointer disabled:opacity-50"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Dropzone / Upload Area Saat Kosong */
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file && fileInputRef.current) {
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(file);
                  fileInputRef.current.files = dataTransfer.files;
                  const event = new Event('change', { bubbles: true });
                  fileInputRef.current.dispatchEvent(event);
                }
              }}
              className="border-2 border-dashed border-hairline-mist hover:border-fresh-grass bg-cream-paper/50 hover:bg-cream-paper rounded-[24px] p-6 text-center cursor-pointer transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-pure-white border border-hairline-mist mx-auto flex items-center justify-center text-stone-gray group-hover:scale-110 transition-transform mb-2">
                <UploadCloud className="w-6 h-6 group-hover:text-fresh-grass transition-colors" />
              </div>
              <p className="text-[14px] font-medium text-ink-black">
                Klik atau Seret Gambar ke Sini
              </p>
              <p className="text-[12px] text-stone-gray mt-1">{helperText}</p>
              <span className="inline-block mt-3 text-[12px] text-fresh-grass font-medium bg-fresh-grass/10 px-3 py-1 rounded-full">
                Supabase Storage Bucket: media
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <p className="text-[12px] text-coral-pop font-medium mt-1 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
}
