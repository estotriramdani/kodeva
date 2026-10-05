import React from 'react';
import { Card, Badge } from '@/shared/ui';
import { formatIDR } from '@/shared/lib';
import type { ProductPlan } from '../model/types';

export interface ProductPlanCardProps {
  plan: ProductPlan;
  isPopular?: boolean;
  actionSlot?: React.ReactNode;
}

export function ProductPlanCard({
  plan,
  isPopular = false,
  actionSlot,
}: ProductPlanCardProps) {
  const tierLabels = {
    basic: 'Paket Basic',
    pro: 'Paket Pro',
    business: 'Paket Business',
  };

  const hasPromo = plan.promo_price !== null && plan.promo_price > 0 && plan.promo_price < plan.price;

  return (
    <Card
      surface={isPopular ? 'white' : 'sandstone'}
      className={`flex flex-col justify-between h-full border ${
        isPopular ? 'border-fresh-grass ring-2 ring-fresh-grass/20' : 'border-transparent'
      }`}
    >
      <div>
        {/* Header Tier */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[18px] font-semibold text-ink-black capitalize">
            {tierLabels[plan.tier] || plan.tier}
          </span>
          {isPopular && (
            <Badge variant="grass">Paling Diminati</Badge>
          )}
        </div>

        {/* Harga */}
        <div className="my-4">
          {hasPromo ? (
            <div>
              <span className="text-[14px] text-stone-gray line-through block">
                {formatIDR(plan.price)}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-[32px] font-bold text-coral-pop">
                  {formatIDR(plan.promo_price!)}
                </span>
                <span className="text-[14px] text-stone-gray">
                  /{plan.unit}/bln
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-[32px] font-bold text-ink-black">
                {formatIDR(plan.price)}
              </span>
              <span className="text-[14px] text-stone-gray">
                /{plan.unit}/bln
              </span>
            </div>
          )}

          <p className="text-[13px] text-stone-gray mt-1">
            Minimal {plan.min_qty} lisensi {plan.max_qty ? `(maks. ${plan.max_qty})` : ''}
          </p>
        </div>

        {/* Daftar Fitur Paket */}
        {plan.features && plan.features.length > 0 && (
          <div className="mt-6 pt-6 border-t border-hairline-mist/60 space-y-2.5">
            <span className="text-[13px] font-medium text-stone-gray uppercase tracking-wider block">
              Termasuk Fitur:
            </span>
            <ul className="space-y-2 text-[14px] text-ink-black">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-fresh-grass font-bold">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Button */}
      {actionSlot && <div className="mt-8 pt-4">{actionSlot}</div>}
    </Card>
  );
}
