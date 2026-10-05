import React from 'react';
import Image from 'next/image';
import { Card } from '@/shared/ui';
import type { Testimonial } from '../model/types';

export interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card
      surface="white"
      className="flex flex-col justify-between h-full border border-hairline-mist/60 hover:border-ink-black/20 transition-all p-7 sm:p-8"
    >
      {/* Kutipan Testimoni */}
      <blockquote className="text-[17px] sm:text-[18px] text-ink-black leading-relaxed italic mb-6">
        “{testimonial.quote}”
      </blockquote>

      {/* Profil Pelanggan */}
      <div className="flex items-center gap-3.5 pt-4 border-t border-hairline-mist/50">
        <div className="relative w-11 h-11 rounded-full bg-sandstone overflow-hidden shrink-0 flex items-center justify-center">
          {testimonial.avatar_url ? (
            <Image
              src={testimonial.avatar_url}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-[14px] font-semibold text-ink-black uppercase">
              {testimonial.name.slice(0, 2)}
            </span>
          )}
        </div>

        <div>
          <h4 className="text-[15px] font-semibold text-ink-black leading-tight">
            {testimonial.name}
          </h4>
          {(testimonial.role || testimonial.company) && (
            <p className="text-[13px] text-stone-gray leading-tight mt-0.5">
              {[testimonial.role, testimonial.company].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
