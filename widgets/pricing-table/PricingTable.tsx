import React from 'react';
import { Check, Minus, Layers } from 'lucide-react';
import { Container } from '@/shared/ui';
import { ProductPlanCard, type ProductPlan } from '@/entities/product';
import { ClaimPromoButton } from '@/features/claim-promo';
import { formatIDR } from '@/shared/lib';

export interface PricingTableProps {
  plans: ProductPlan[];
  productName: string;
  productId?: string;
  promoQuota?: number;
}

const tierOrder: Record<string, number> = {
  basic: 1,
  pro: 2,
  business: 3,
};

const tierNames: Record<string, string> = {
  basic: 'Basic',
  pro: 'Pro',
  business: 'Business',
};

export function PricingTable({
  plans,
  productName,
  productId,
  promoQuota,
}: PricingTableProps) {
  if (!plans || plans.length === 0) return null;

  const sortedPlans = [...plans].sort(
    (a, b) => (tierOrder[a.tier] || 99) - (tierOrder[b.tier] || 99)
  );

  // Kumpulkan seluruh kapabilitas unik dari seluruh paket
  const allFeatures = Array.from(
    new Set(sortedPlans.flatMap((p) => p.features || []))
  );

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-[32px] sm:text-[42px] font-medium text-ink-black leading-tight">
            Pilihan Paket & Harga Lisensi
          </h2>
          <p className="text-[16px] text-stone-gray mt-2">
            Pilih paket yang paling sesuai dengan skala dan kebutuhan tim Anda.
          </p>
        </div>

        {/* 1. Kartu Paket (Pricing Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-16">
          {sortedPlans.map((plan) => {
            const isPopular = plan.tier === 'pro';
            return (
              <ProductPlanCard
                key={plan.id}
                plan={plan}
                isPopular={isPopular}
                actionSlot={
                  <ClaimPromoButton
                    productName={productName}
                    productId={productId || plans[0]?.product_id}
                    planTier={plan.tier}
                    quotaRemaining={promoQuota}
                    className="w-full justify-center"
                  />
                }
              />
            );
          })}
        </div>

        {/* 2. Tabel Perbandingan Fitur Antar Paket (Bonus Requirement) */}
        {allFeatures.length > 0 && (
          <div className="bg-pure-white rounded-[40px] p-6 sm:p-10 border border-hairline-mist shadow-xs">
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-hairline-mist">
              <div className="w-8 h-8 rounded-full bg-fresh-grass/20 text-fresh-grass flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[20px] font-semibold text-ink-black">
                  Tabel Perbandingan Fitur Antar Paket
                </h3>
                <p className="text-[13px] text-stone-gray mt-0.5">
                  Rincian komparasi kapabilitas teknis dan batas lisensi setiap tingkatan paket
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-hairline-mist text-ink-black">
                    <th className="py-4 pr-4 font-semibold text-stone-gray w-2/5">
                      Fitur & Kapabilitas
                    </th>
                    {sortedPlans.map((plan) => (
                      <th
                        key={plan.id}
                        className={`py-4 px-4 text-center font-bold ${
                          plan.tier === 'pro' ? 'text-fresh-grass' : 'text-ink-black'
                        }`}
                      >
                        <div className="text-[15px]">{tierNames[plan.tier] || plan.tier}</div>
                        <div className="text-[12px] font-normal text-stone-gray mt-0.5">
                          {formatIDR(plan.promo_price || plan.price)}/{plan.unit}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline-mist/50">
                  {allFeatures.map((feature, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-cream-paper/40 transition-colors"
                    >
                      <td className="py-3.5 pr-4 text-ink-black font-medium">
                        {feature}
                      </td>
                      {sortedPlans.map((plan) => {
                        const hasFeature = plan.features?.includes(feature);
                        return (
                          <td
                            key={plan.id}
                            className={`py-3.5 px-4 text-center ${
                              plan.tier === 'pro' ? 'bg-cream-paper/30' : ''
                            }`}
                          >
                            {hasFeature ? (
                              <div className="w-6 h-6 rounded-full bg-fresh-grass/15 text-fresh-grass flex items-center justify-center mx-auto">
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 flex items-center justify-center mx-auto text-stone-gray/40">
                                <Minus className="w-4 h-4" />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
