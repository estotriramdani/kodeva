import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Card, Badge } from '@/shared/ui';
import type { Product } from '@/entities/product';
import { PricingTable } from '@/widgets/pricing-table';
import { LeadForm } from '@/features/submit-lead';

export interface ProductDetailPageProps {
  product: Product;
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-[14px] text-stone-gray flex items-center gap-2">
          <Link href="/" className="hover:text-ink-black transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/produk" className="hover:text-ink-black transition-colors">
            Produk
          </Link>
          <span>/</span>
          <span className="text-ink-black font-medium">{product.name}</span>
        </nav>

        {/* Hero Section Produk */}
        <div className="bg-pure-white rounded-[50px] p-6 sm:p-12 border border-hairline-mist mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Informasi Detail */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {product.category && (
                  <Badge variant="neutral">{product.category.name}</Badge>
                )}
                {product.promo_quota_remaining > 0 && (
                  <Badge variant="coral">
                    Sisa Promo: {product.promo_quota_remaining} Kuota
                  </Badge>
                )}
              </div>

              <h1 className="text-[36px] sm:text-[50px] font-medium text-ink-black leading-tight tracking-tight">
                {product.name}
              </h1>

              {product.tagline && (
                <p className="text-[18px] sm:text-[20px] text-stone-gray mt-3 leading-relaxed">
                  {product.tagline}
                </p>
              )}

              {/* Fitur Utama */}
              {product.features && product.features.length > 0 && (
                <div className="mt-8 space-y-2.5">
                  <h4 className="text-[14px] font-semibold text-ink-black uppercase tracking-wider">
                    Keunggulan Utama:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-[14px] text-ink-black bg-cream-paper/70 px-3 py-2 rounded-[12px]"
                      >
                        <span className="text-fresh-grass font-bold">✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Utama */}
            <div className="relative w-full h-64 sm:h-96 rounded-[35px] bg-sandstone overflow-hidden flex items-center justify-center border border-hairline-mist">
              {product.thumbnail_url ? (
                <Image
                  src={product.thumbnail_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="text-stone-gray/40 text-6xl font-bold uppercase select-none">
                  {product.name.slice(0, 2)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Deskripsi Lengkap */}
        {product.description && (
          <div className="bg-pure-white rounded-[50px] p-6 sm:p-12 border border-hairline-mist mb-12">
            <h2 className="text-[26px] sm:text-[32px] font-medium text-ink-black mb-4">
              Tentang {product.name}
            </h2>
            <div className="text-[16px] sm:text-[17px] text-ink-black/85 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>
        )}

        {/* Galeri Screenshot Produk */}
        {product.screenshots && product.screenshots.length > 0 && (
          <div className="mb-12">
            <h2 className="text-[26px] sm:text-[32px] font-medium text-ink-black mb-6">
              Tangkapan Layar & Tampilan Antarmuka
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.screenshots.map((s, idx) => (
                <div
                  key={idx}
                  className="relative w-full h-60 sm:h-80 rounded-[35px] bg-sandstone overflow-hidden border border-hairline-mist"
                >
                  <Image
                    src={s.url}
                    alt={s.alt || `Tangkapan layar ${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabel Paket & Harga Lisensi */}
        {product.plans && product.plans.length > 0 && (
          <div className="mb-12">
            <PricingTable
              plans={product.plans}
              productName={product.name}
              promoQuota={product.promo_quota_remaining}
            />
          </div>
        )}

        {/* Form Permintaan Penawaran Langsung */}
        <div className="max-w-2xl mx-auto my-12">
          <Card surface="white" className="p-8 sm:p-10 border border-hairline-mist">
            <div className="text-center mb-6">
              <h3 className="text-[26px] font-medium text-ink-black">
                Tertarik dengan {product.name}?
              </h3>
              <p className="text-[15px] text-stone-gray mt-2">
                Dapatkan demo gratis atau konsultasikan penyesuaian paket sesuai anggaran perusahaan Anda.
              </p>
            </div>
            <LeadForm
              sourceCta={`product_detail_${product.slug}`}
              submitButtonText={`Minta Penawaran ${product.name}`}
            />
          </Card>
        </div>
      </Container>
    </div>
  );
}
