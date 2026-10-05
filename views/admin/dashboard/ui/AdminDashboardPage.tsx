import React from 'react';
import { Container, Card, Badge, Button } from '@/shared/ui';
import { logoutAction } from '@/features/auth';
import { formatDateID } from '@/shared/lib';
import type { Lead } from '@/entities/lead';

export interface AdminDashboardPageProps {
  leads: Lead[];
  adminEmail?: string;
}

export function AdminDashboardPage({
  leads,
  adminEmail,
}: AdminDashboardPageProps) {
  return (
    <div className="min-h-screen py-10">
      <Container>
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-hairline-mist">
          <div>
            <h1 className="text-[30px] font-semibold text-ink-black">
              Dashboard Prospek (Leads)
            </h1>
            <p className="text-[14px] text-stone-gray mt-1">
              Masuk sebagai: <span className="font-medium text-ink-black">{adminEmail}</span>
            </p>
          </div>

          <form action={logoutAction}>
            <Button type="submit" variant="ghost-pill" size="sm">
              Keluar (Logout)
            </Button>
          </form>
        </div>

        {/* Lead Table Card */}
        <Card surface="white" className="p-6 sm:p-8 border border-hairline-mist">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[20px] font-semibold text-ink-black">
              Daftar Permintaan Penawaran Terkini
            </h3>
            <Badge variant="grass">{leads.length} Prospek Terdaftar</Badge>
          </div>

          {leads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-hairline-mist text-stone-gray font-medium">
                    <th className="pb-3 pr-4">Tanggal</th>
                    <th className="pb-3 pr-4">Nama</th>
                    <th className="pb-3 pr-4">WhatsApp</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Sumber CTA</th>
                    <th className="pb-3">Kampanye</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline-mist/50">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-cream-paper/40 transition-colors">
                      <td className="py-3.5 pr-4 text-stone-gray whitespace-nowrap">
                        {formatDateID(lead.created_at)}
                      </td>
                      <td className="py-3.5 pr-4 font-medium text-ink-black">
                        {lead.name}
                      </td>
                      <td className="py-3.5 pr-4 text-ink-black">
                        {lead.whatsapp ? (
                          <a
                            href={`https://wa.me/${lead.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fresh-grass hover:underline font-semibold"
                          >
                            {lead.whatsapp}
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3.5 pr-4 text-stone-gray">
                        {lead.email || '-'}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="bg-sandstone/60 text-ink-black px-2 py-0.5 rounded-[6px] text-[12px]">
                          {lead.source_cta || 'direct'}
                        </span>
                      </td>
                      <td className="py-3.5 text-stone-gray text-[13px]">
                        {[lead.utm_source, lead.utm_campaign].filter(Boolean).join(' / ') || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-stone-gray">
              Belum ada data penawaran lead yang masuk.
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
}
