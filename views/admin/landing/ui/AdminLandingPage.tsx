'use client';

import React, { useState, useActionState } from 'react';
import Image from 'next/image';
import { Sparkles, MessageSquareQuote, HelpCircle } from 'lucide-react';
import { Card, Badge, Button, Modal, Input, Textarea } from '@/shared/ui';
import { ImageUploader } from '@/features/upload-media';
import {
  updateHeroAction,
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  createFaqAction,
  updateFaqAction,
  deleteFaqAction,
  type ActionState,
} from '@/features/manage-landing';
import type { LandingHero } from '@/entities/hero';
import type { Testimonial } from '@/entities/testimonial';
import type { Faq } from '@/entities/faq';

export interface AdminLandingPageProps {
  hero: LandingHero | null;
  testimonials: Testimonial[];
  faqs: Faq[];
}

const initialActionState: ActionState = {};

export function AdminLandingPage({
  hero,
  testimonials,
  faqs,
}: AdminLandingPageProps) {
  const [activeTab, setActiveTab] = useState<'hero' | 'testimonials' | 'faqs'>('hero');

  // Hero state
  const [heroState, heroAction, isSavingHero] = useActionState(updateHeroAction, initialActionState);

  // Testimonials state
  const [isAddTestimonialOpen, setIsAddTestimonialOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [createTestimonialState, createTestimonialAct, isCreatingTestimonial] = useActionState(
    createTestimonialAction,
    initialActionState
  );
  const [updateTestimonialState, updateTestimonialAct, isUpdatingTestimonial] = useActionState(
    updateTestimonialAction,
    initialActionState
  );

  // FAQ state
  const [isAddFaqOpen, setIsAddFaqOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [createFaqState, createFaqAct, isCreatingFaq] = useActionState(
    createFaqAction,
    initialActionState
  );
  const [updateFaqState, updateFaqAct, isUpdatingFaq] = useActionState(
    updateFaqAction,
    initialActionState
  );

  // Close modals on success
  React.useEffect(() => {
    if (createTestimonialState.success) {
      const t = setTimeout(() => setIsAddTestimonialOpen(false), 500);
      return () => clearTimeout(t);
    }
  }, [createTestimonialState.success]);

  React.useEffect(() => {
    if (updateTestimonialState.success) {
      const t = setTimeout(() => setEditingTestimonial(null), 500);
      return () => clearTimeout(t);
    }
  }, [updateTestimonialState.success]);

  React.useEffect(() => {
    if (createFaqState.success) {
      const t = setTimeout(() => setIsAddFaqOpen(false), 500);
      return () => clearTimeout(t);
    }
  }, [createFaqState.success]);

  React.useEffect(() => {
    if (updateFaqState.success) {
      const t = setTimeout(() => setEditingFaq(null), 500);
      return () => clearTimeout(t);
    }
  }, [updateFaqState.success]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[28px] sm:text-[32px] font-semibold text-ink-black tracking-tight">
          Konten Landing Page
        </h1>
        <p className="text-[15px] text-stone-gray mt-1">
          Ubah teks, banner gambar, testimoni pelanggan, dan pertanyaan FAQ tanpa deploy ulang.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-hairline-mist gap-2 sm:gap-4">
        <button
          onClick={() => setActiveTab('hero')}
          className={`pb-3 px-4 text-[15px] font-semibold transition-all border-b-2 cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'hero'
              ? 'border-ink-black text-ink-black'
              : 'border-transparent text-stone-gray hover:text-ink-black'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Hero Banner</span>
        </button>
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`pb-3 px-4 text-[15px] font-semibold transition-all border-b-2 cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'testimonials'
              ? 'border-ink-black text-ink-black'
              : 'border-transparent text-stone-gray hover:text-ink-black'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4" />
          <span>Testimoni ({testimonials.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`pb-3 px-4 text-[15px] font-semibold transition-all border-b-2 cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'faqs'
              ? 'border-ink-black text-ink-black'
              : 'border-transparent text-stone-gray hover:text-ink-black'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Tanya Jawab FAQ ({faqs.length})</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: HERO SECTION */}
      {/* ===================================================================== */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Card surface="white" className="p-6 sm:p-8 rounded-[35px] border border-hairline-mist">
              <h3 className="text-[20px] font-semibold text-ink-black mb-4">
                Pengaturan Hero Section
              </h3>

              <form action={heroAction} className="space-y-5">
                {heroState.error && (
                  <div className="p-3.5 rounded-[16px] bg-coral-pop/10 text-coral-pop text-[14px] border border-coral-pop/20 font-medium">
                    {heroState.error}
                  </div>
                )}
                {heroState.success && (
                  <div className="p-3.5 rounded-[16px] bg-fresh-grass/10 text-fresh-grass text-[14px] border border-fresh-grass/20 font-medium">
                    {heroState.message || 'Perubahan Hero berhasil disimpan!'}
                  </div>
                )}

                <Input
                  name="title"
                  label="Judul Utama Hero *"
                  defaultValue={hero?.title || 'SaaS & Solusi Bisnis Terintegrasi untuk UMKM Indonesia'}
                  required
                  disabled={isSavingHero}
                />

                <Textarea
                  name="subtitle"
                  label="Subjudul / Deskripsi Pendukung"
                  defaultValue={hero?.subtitle || 'Tingkatkan efisiensi operasional dengan software akuntansi, kasir POS, payroll, dan inventori terpercaya dengan harga terjangkau.'}
                  rows={3}
                  disabled={isSavingHero}
                />

                {/* Banner Hero Image Uploader */}
                <ImageUploader
                  name="image_url"
                  label="Banner Gambar Hero (Supabase Storage)"
                  folder="hero"
                  defaultValue={hero?.image_url}
                  helperText="Upload ilustrasi atau foto dashboard software untuk landing page (max 2MB)."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    name="cta_label"
                    label="Teks Tombol CTA"
                    defaultValue={hero?.cta_label || 'Jelajahi Solusi'}
                    disabled={isSavingHero}
                  />

                  <Input
                    name="cta_href"
                    label="Tautan Tombol CTA (URL)"
                    defaultValue={hero?.cta_href || '/produk'}
                    disabled={isSavingHero}
                  />
                </div>

                <Input
                  name="campaign_name"
                  label="Nama Kampanye Aktif"
                  defaultValue={hero?.campaign_name || 'Promo Awal Tahun'}
                  disabled={isSavingHero}
                />

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="grass-pill"
                    disabled={isSavingHero}
                  >
                    {isSavingHero ? 'Menyimpan...' : 'Simpan Konten Hero'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Quick Info & Preview Sidecard */}
          <div className="lg:col-span-4 space-y-6">
            {hero?.image_url && (
              <Card surface="white" className="p-6 rounded-[30px] border border-hairline-mist space-y-3">
                <h4 className="font-semibold text-ink-black text-[16px]">
                  🖼️ Banner Aktif Saat Ini
                </h4>
                <div className="relative aspect-[16/9] w-full rounded-[20px] overflow-hidden border border-hairline-mist bg-sandstone">
                  <Image
                    src={hero.image_url}
                    alt={hero.image_alt || hero.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-[12px] text-stone-gray truncate">
                  URL: <span className="font-mono text-ink-black">{hero.image_url}</span>
                </p>
              </Card>
            )}

            <Card surface="white" className="p-6 rounded-[30px] border border-hairline-mist space-y-4">
              <h4 className="font-semibold text-ink-black text-[16px]">
                ℹ️ Info Revalidasi
              </h4>
              <p className="text-[13px] text-stone-gray leading-relaxed">
                Perubahan yang disimpan di form ini akan langsung memicu <strong>On-Demand Revalidation</strong> (<code className="text-xs bg-sandstone px-1 py-0.5 rounded">revalidatePath(&apos;/&apos;)</code>), sehingga pengunjung web akan langsung melihat teks dan gambar baru tanpa perlu deploy ulang.
              </p>
              <div className="pt-2">
                <a
                  href="/"
                  target="_blank"
                  className="text-[13px] text-fresh-grass hover:underline font-semibold"
                >
                  ↗ Buka Halaman Utama (Cek Hasil)
                </a>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: TESTIMONIALS */}
      {/* ===================================================================== */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-[20px] font-semibold text-ink-black">
                Daftar Testimoni Pelanggan
              </h3>
              <p className="text-[14px] text-stone-gray">
                Ulasan kepuasan pengusaha UMKM yang ditampilkan di landing page.
              </p>
            </div>
            <Button
              variant="grass-pill"
              size="md"
              onClick={() => setIsAddTestimonialOpen(true)}
            >
              + Tambah Testimoni Baru
            </Button>
          </div>

          <Card surface="white" className="p-6 sm:p-8 rounded-[35px] border border-hairline-mist">
            {testimonials.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-hairline-mist text-stone-gray font-medium">
                      <th className="pb-3 pr-4">Avatar</th>
                      <th className="pb-3 pr-4">Nama & Jabatan</th>
                      <th className="pb-3 pr-4">Kutipan Ulasan</th>
                      <th className="pb-3 pr-4">Urutan</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-mist/50">
                    {testimonials.map((t) => (
                      <tr key={t.id} className="hover:bg-cream-paper/40 transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="relative w-10 h-10 rounded-full bg-sandstone overflow-hidden border border-hairline-mist flex items-center justify-center shrink-0">
                            {t.avatar_url ? (
                              <Image
                                src={t.avatar_url}
                                alt={t.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-[11px] font-bold text-stone-gray">
                                {t.name.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="font-semibold text-ink-black block">{t.name}</span>
                          <span className="text-[12px] text-stone-gray">
                            {[t.role, t.company].filter(Boolean).join(', ') || '-'}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 max-w-xs">
                          <p className="line-clamp-2 text-stone-gray text-[13px]">
                            &ldquo;{t.quote}&rdquo;
                          </p>
                        </td>
                        <td className="py-3.5 pr-4 font-mono font-medium">
                          #{t.rank}
                        </td>
                        <td className="py-3.5 pr-4">
                          {t.is_published ? (
                            <Badge variant="grass">Tayang</Badge>
                          ) : (
                            <Badge variant="neutral">Draft</Badge>
                          )}
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingTestimonial(t)}
                            className="text-[13px] text-fresh-grass hover:underline font-medium cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Hapus testimoni dari "${t.name}"?`)) {
                                await deleteTestimonialAction(t.id);
                              }
                            }}
                            className="text-[13px] text-coral-pop hover:underline ml-2 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-stone-gray">
                Belum ada testimoni. Klik tombol di atas untuk menambahkan.
              </div>
            )}
          </Card>

          {/* Modal Tambah Testimoni */}
          {isAddTestimonialOpen && (
            <Modal
              isOpen={isAddTestimonialOpen}
              onClose={() => setIsAddTestimonialOpen(false)}
              title="Tambah Testimoni Baru"
              description="Masukkan review dari pelanggan software Kodeva."
              maxWidth="md"
            >
              <form action={createTestimonialAct} className="space-y-4">
                {createTestimonialState.error && (
                  <div className="p-3 rounded-[14px] bg-coral-pop/10 text-coral-pop text-[13px] font-medium">
                    {createTestimonialState.error}
                  </div>
                )}
                {createTestimonialState.success && (
                  <div className="p-3 rounded-[14px] bg-fresh-grass/10 text-fresh-grass text-[13px] font-medium">
                    {createTestimonialState.message}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input name="name" label="Nama Pelanggan *" placeholder="Budi Santoso" required disabled={isCreatingTestimonial} />
                  <Input name="role" label="Jabatan / Profesi" placeholder="Owner & Founder" disabled={isCreatingTestimonial} />
                </div>

                <Input name="company" label="Nama Bisnis / Toko" placeholder="Kopi Senja Utama" disabled={isCreatingTestimonial} />

                <Textarea name="quote" label="Kutipan Testimoni *" placeholder="Software ini sangat memudahkan pembukuan kami..." rows={3} required disabled={isCreatingTestimonial} />

                <ImageUploader name="avatar_url" label="Foto Avatar Pelanggan" folder="testimonials" helperText="Foto profil kotak/bulat (max 2MB)." />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input name="rank" type="number" label="Urutan Tampil (Rank)" defaultValue="1" disabled={isCreatingTestimonial} />
                  <div>
                    <label className="block text-[14px] font-medium text-ink-black mb-1.5">Status Tayang</label>
                    <select name="is_published" defaultValue="true" disabled={isCreatingTestimonial} className="w-full bg-pure-white text-ink-black px-4 py-3 rounded-[20px] border border-hairline-mist text-[14px]">
                      <option value="true">Langsung Tayang di Landing</option>
                      <option value="false">Sembunyikan Sementara</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button type="button" variant="ghost-pill" onClick={() => setIsAddTestimonialOpen(false)}>Batal</Button>
                  <Button type="submit" variant="grass-pill" disabled={isCreatingTestimonial}>{isCreatingTestimonial ? 'Menyimpan...' : 'Simpan Testimoni'}</Button>
                </div>
              </form>
            </Modal>
          )}

          {/* Modal Edit Testimoni */}
          {editingTestimonial && (
            <Modal
              isOpen={Boolean(editingTestimonial)}
              onClose={() => setEditingTestimonial(null)}
              title={`Edit Testimoni: ${editingTestimonial.name}`}
              description="Perbarui review pelanggan atau ganti foto avatar."
              maxWidth="md"
            >
              <form action={updateTestimonialAct} className="space-y-4">
                <input type="hidden" name="id" value={editingTestimonial.id} />

                {updateTestimonialState.error && (
                  <div className="p-3 rounded-[14px] bg-coral-pop/10 text-coral-pop text-[13px] font-medium">
                    {updateTestimonialState.error}
                  </div>
                )}
                {updateTestimonialState.success && (
                  <div className="p-3 rounded-[14px] bg-fresh-grass/10 text-fresh-grass text-[13px] font-medium">
                    {updateTestimonialState.message}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input name="name" label="Nama Pelanggan *" defaultValue={editingTestimonial.name} required disabled={isUpdatingTestimonial} />
                  <Input name="role" label="Jabatan / Profesi" defaultValue={editingTestimonial.role || ''} disabled={isUpdatingTestimonial} />
                </div>

                <Input name="company" label="Nama Bisnis / Toko" defaultValue={editingTestimonial.company || ''} disabled={isUpdatingTestimonial} />

                <Textarea name="quote" label="Kutipan Testimoni *" defaultValue={editingTestimonial.quote} rows={3} required disabled={isUpdatingTestimonial} />

                <ImageUploader name="avatar_url" label="Foto Avatar Pelanggan" folder="testimonials" defaultValue={editingTestimonial.avatar_url} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input name="rank" type="number" label="Urutan Tampil (Rank)" defaultValue={String(editingTestimonial.rank)} disabled={isUpdatingTestimonial} />
                  <div>
                    <label className="block text-[14px] font-medium text-ink-black mb-1.5">Status Tayang</label>
                    <select name="is_published" defaultValue={editingTestimonial.is_published ? 'true' : 'false'} disabled={isUpdatingTestimonial} className="w-full bg-pure-white text-ink-black px-4 py-3 rounded-[20px] border border-hairline-mist text-[14px]">
                      <option value="true">Tayang di Landing</option>
                      <option value="false">Sembunyikan</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button type="button" variant="ghost-pill" onClick={() => setEditingTestimonial(null)}>Batal</Button>
                  <Button type="submit" variant="grass-pill" disabled={isUpdatingTestimonial}>{isUpdatingTestimonial ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
                </div>
              </form>
            </Modal>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: FAQS */}
      {/* ===================================================================== */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-[20px] font-semibold text-ink-black">
                Daftar Tanya Jawab FAQ
              </h3>
              <p className="text-[14px] text-stone-gray">
                Pertanyaan yang sering diajukan calon pembeli di landing page.
              </p>
            </div>
            <Button
              variant="grass-pill"
              size="md"
              onClick={() => setIsAddFaqOpen(true)}
            >
              + Tambah FAQ Baru
            </Button>
          </div>

          <Card surface="white" className="p-6 sm:p-8 rounded-[35px] border border-hairline-mist">
            {faqs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-hairline-mist text-stone-gray font-medium">
                      <th className="pb-3 pr-4">Urutan</th>
                      <th className="pb-3 pr-4">Pertanyaan</th>
                      <th className="pb-3 pr-4">Jawaban Ringkas</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-mist/50">
                    {faqs.map((f) => (
                      <tr key={f.id} className="hover:bg-cream-paper/40 transition-colors">
                        <td className="py-3.5 pr-4 font-mono font-medium">
                          #{f.rank}
                        </td>
                        <td className="py-3.5 pr-4 font-semibold text-ink-black max-w-xs">
                          {f.question}
                        </td>
                        <td className="py-3.5 pr-4 max-w-sm text-stone-gray">
                          <p className="line-clamp-2 text-[13px]">{f.answer}</p>
                        </td>
                        <td className="py-3.5 pr-4">
                          {f.is_published ? (
                            <Badge variant="grass">Tayang</Badge>
                          ) : (
                            <Badge variant="neutral">Draft</Badge>
                          )}
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingFaq(f)}
                            className="text-[13px] text-fresh-grass hover:underline font-medium cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Hapus pertanyaan: "${f.question}"?`)) {
                                await deleteFaqAction(f.id);
                              }
                            }}
                            className="text-[13px] text-coral-pop hover:underline ml-2 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-stone-gray">
                Belum ada FAQ. Klik tombol di atas untuk menambahkan pertanyaan pertama.
              </div>
            )}
          </Card>

          {/* Modal Tambah FAQ */}
          {isAddFaqOpen && (
            <Modal
              isOpen={isAddFaqOpen}
              onClose={() => setIsAddFaqOpen(false)}
              title="Tambah Pertanyaan FAQ"
              description="Pertanyaan akan langsung tampil di accordion FAQ landing page."
              maxWidth="md"
            >
              <form action={createFaqAct} className="space-y-4">
                {createFaqState.error && (
                  <div className="p-3 rounded-[14px] bg-coral-pop/10 text-coral-pop text-[13px] font-medium">
                    {createFaqState.error}
                  </div>
                )}
                {createFaqState.success && (
                  <div className="p-3 rounded-[14px] bg-fresh-grass/10 text-fresh-grass text-[13px] font-medium">
                    {createFaqState.message}
                  </div>
                )}

                <Input name="question" label="Pertanyaan *" placeholder="Apakah tersedia versi uji coba (free trial)?" required disabled={isCreatingFaq} />

                <Textarea name="answer" label="Jawaban *" placeholder="Ya, Anda dapat mencoba paket Pro gratis selama 14 hari..." rows={4} required disabled={isCreatingFaq} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input name="rank" type="number" label="Urutan Tampil (Rank)" defaultValue="1" disabled={isCreatingFaq} />
                  <div>
                    <label className="block text-[14px] font-medium text-ink-black mb-1.5">Status Tayang</label>
                    <select name="is_published" defaultValue="true" disabled={isCreatingFaq} className="w-full bg-pure-white text-ink-black px-4 py-3 rounded-[20px] border border-hairline-mist text-[14px]">
                      <option value="true">Tayang di Landing Page</option>
                      <option value="false">Simpan sebagai Draft</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button type="button" variant="ghost-pill" onClick={() => setIsAddFaqOpen(false)}>Batal</Button>
                  <Button type="submit" variant="grass-pill" disabled={isCreatingFaq}>{isCreatingFaq ? 'Menyimpan...' : 'Simpan FAQ'}</Button>
                </div>
              </form>
            </Modal>
          )}

          {/* Modal Edit FAQ */}
          {editingFaq && (
            <Modal
              isOpen={Boolean(editingFaq)}
              onClose={() => setEditingFaq(null)}
              title="Edit Pertanyaan FAQ"
              description="Perbarui pertanyaan atau jawaban."
              maxWidth="md"
            >
              <form action={updateFaqAct} className="space-y-4">
                <input type="hidden" name="id" value={editingFaq.id} />

                {updateFaqState.error && (
                  <div className="p-3 rounded-[14px] bg-coral-pop/10 text-coral-pop text-[13px] font-medium">
                    {updateFaqState.error}
                  </div>
                )}
                {updateFaqState.success && (
                  <div className="p-3 rounded-[14px] bg-fresh-grass/10 text-fresh-grass text-[13px] font-medium">
                    {updateFaqState.message}
                  </div>
                )}

                <Input name="question" label="Pertanyaan *" defaultValue={editingFaq.question} required disabled={isUpdatingFaq} />

                <Textarea name="answer" label="Jawaban *" defaultValue={editingFaq.answer} rows={4} required disabled={isUpdatingFaq} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input name="rank" type="number" label="Urutan Tampil (Rank)" defaultValue={String(editingFaq.rank)} disabled={isUpdatingFaq} />
                  <div>
                    <label className="block text-[14px] font-medium text-ink-black mb-1.5">Status Tayang</label>
                    <select name="is_published" defaultValue={editingFaq.is_published ? 'true' : 'false'} disabled={isUpdatingFaq} className="w-full bg-pure-white text-ink-black px-4 py-3 rounded-[20px] border border-hairline-mist text-[14px]">
                      <option value="true">Tayang di Landing Page</option>
                      <option value="false">Sembunyikan</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button type="button" variant="ghost-pill" onClick={() => setEditingFaq(null)}>Batal</Button>
                  <Button type="submit" variant="grass-pill" disabled={isUpdatingFaq}>{isUpdatingFaq ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
                </div>
              </form>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}
