import React from 'react';
import { Container } from '@/shared/ui';
import { ProductPlanCard, type ProductPlan } from '@/entities/product';
import { ClaimPromoButton } from '@/features/claim-promo';

export interface PricingTableProps {
  plans: ProductPlan[];
  productName: string;
  promoQuota?: number;
}

export function PricingTable({
  plans,
  productName,
  promoQuota,
}: PricingTableProps) {
  if (!plans || plans.length === 0) return null;

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {plans.map((plan) => {
            const isPopular = plan.tier === 'pro';
            return (
              <ProductPlanCard
                key={plan.id}
                plan={plan}
                isPopular={isPopular}
                actionSlot={
                  <ClaimPromoButton
                    productName={productName}
                    planTier={plan.tier}
                    quotaRemaining={promoQuota}
                    className="w-full justify-center"
                  />
                }
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
