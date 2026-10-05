'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Package,
  FileText,
  Tag,
  MessageSquare,
  Inbox,
} from 'lucide-react';
import { Card, Badge } from '@/shared/ui';
import { formatDateID } from '@/shared/lib';
import type { Lead } from '@/entities/lead';

export interface AdminDashboardPageProps {
  leads: Lead[];
  productsCount?: number;
  articlesCount?: number;
  promoQuotaTotal?: number;
}

export function AdminDashboardPage({
  leads,
  productsCount = 0,
  articlesCount = 0,
  promoQuotaTotal = 0,
}: AdminDashboardPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeads = leads.filter((l) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      l.name.toLowerCase().includes(term) ||
      (l.email && l.email.toLowerCase().includes(term)) ||
      (l.whatsapp && l.whatsapp.includes(term)) ||
      (l.source_cta && l.source_cta.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div>
        <h1 className="text-[28px] sm:text-[32px] font-semibold text-ink-black tracking-tight">
          Ringkasan & Prospek
        </h1>
        <p className="text-[15px] text-stone-gray mt-1">
          Pantau seluruh permintaan penawaran dan performa katalog produk Anda.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card surface="white" className="p-6 rounded-[28px] border border-hairline-mist">
          <span className="text-[13px] font-medium text-stone-gray uppercase tracking-wider block">
            Total Prospek (Leads)
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-[34px] font-bold text-ink-black">{leads.length}</span>
            <BarChart3 className="w-6 h-6 text-fresh-grass" />
          </div>
          <p className="text-[12px] text-fresh-grass font-medium mt-1">
            Data kontak tervalidasi
          </p>
        </Card>

        <Card surface="white" className="p-6 rounded-[28px] border border-hairline-mist">
          <span className="text-[13px] font-medium text-stone-gray uppercase tracking-wider block">
            Produk Aktif
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-[34px] font-bold text-ink-black">{productsCount}</span>
            <Package className="w-6 h-6 text-stone-gray" />
          </div>
          <p className="text-[12px] text-stone-gray mt-1">Tersedia di katalog</p>
        </Card>

        <Card surface="white" className="p-6 rounded-[28px] border border-hairline-mist">
          <span className="text-[13px] font-medium text-stone-gray uppercase tracking-wider block">
            Artikel Terbit
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-[34px] font-bold text-ink-black">{articlesCount}</span>
            <FileText className="w-6 h-6 text-stone-gray" />
          </div>
          <p className="text-[12px] text-stone-gray mt-1">Konten edukasi & SEO</p>
        </Card>

        <Card surface="white" className="p-6 rounded-[28px] border border-hairline-mist">
          <span className="text-[13px] font-medium text-stone-gray uppercase tracking-wider block">
            Total Kuota Promo
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-[34px] font-bold text-coral-pop">{promoQuotaTotal}</span>
            <Tag className="w-6 h-6 text-coral-pop" />
          </div>
          <p className="text-[12px] text-stone-gray mt-1">Tersedia untuk klaim</p>
        </Card>
      </div>

      {/* Leads Table Card */}
      <Card surface="white" className="p-6 sm:p-8 rounded-[35px] border border-hairline-mist">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-[20px] font-semibold text-ink-black">
              Daftar Prospek Masuk (Leads)
            </h3>
            <p className="text-[13px] text-stone-gray">
              Calon pembeli yang mengisi formulir penawaran harga.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Cari nama, WA, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-cream-paper/70 rounded-full text-[14px] text-ink-black border border-hairline-mist focus:outline-none focus:border-fresh-grass"
            />
            <Badge variant="grass">{filteredLeads.length} Lead</Badge>
          </div>
        </div>

        {filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-hairline-mist text-stone-gray font-medium">
                  <th className="pb-3 pr-4">Tanggal</th>
                  <th className="pb-3 pr-4">Nama Lengkap</th>
                  <th className="pb-3 pr-4">WhatsApp (Aksi Cepat)</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Sumber CTA</th>
                  <th className="pb-3">Kampanye / Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-mist/50">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-cream-paper/40 transition-colors">
                    <td className="py-3.5 pr-4 text-stone-gray whitespace-nowrap">
                      {formatDateID(lead.created_at)}
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-ink-black">
                      {lead.name}
                    </td>
                    <td className="py-3.5 pr-4">
                      {lead.whatsapp ? (
                        <a
                          href={`https://wa.me/${lead.whatsapp}?text=Halo%20${encodeURIComponent(lead.name)},%20kami%20dari%20Kodeva%20ingin%20menindaklanjuti%20permintaan%20penawaran%20software%20Anda.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fresh-grass/20 hover:bg-fresh-grass/30 text-ink-black font-semibold text-[13px] transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-ink-black" />
                          <span>Chat WA</span>
                          <span className="text-[11px] text-stone-gray">({lead.whatsapp})</span>
                        </a>
                      ) : (
                        <span className="text-stone-gray">-</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 text-stone-gray">
                      {lead.email || '-'}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="bg-sandstone/60 text-ink-black px-2.5 py-1 rounded-[8px] text-[12px] font-mono">
                        {lead.source_cta || 'direct'}
                      </span>
                    </td>
                    <td className="py-3.5 text-stone-gray text-[13px]">
                      {[lead.utm_source, lead.utm_campaign].filter(Boolean).join(' • ') || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-stone-gray">
            <Inbox className="w-10 h-10 text-stone-gray/60 mx-auto mb-2" />
            <p className="font-medium text-ink-black">Belum ada prospek yang sesuai.</p>
            <p className="text-[13px] text-stone-gray mt-1">
              Data akan otomatis masuk saat calon pembeli mengisi formulir di landing page.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
