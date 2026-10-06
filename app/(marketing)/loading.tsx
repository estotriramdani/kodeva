import React from 'react';
import { Container } from '@/shared/ui';

export default function MarketingLoading() {
  return (
    <div className="py-10 sm:py-16 animate-pulse">
      <Container>
        {/* Header Skeleton */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="h-10 sm:h-14 bg-sandstone/70 rounded-full w-3/4 mx-auto" />
          <div className="h-5 bg-sandstone/50 rounded-full w-1/2 mx-auto" />
        </div>

        {/* Filter / Tabs Skeleton */}
        <div className="flex justify-center gap-3 mb-10">
          <div className="h-10 bg-sandstone/60 rounded-full w-28" />
          <div className="h-10 bg-sandstone/60 rounded-full w-32" />
          <div className="h-10 bg-sandstone/60 rounded-full w-24" />
          <div className="h-10 bg-sandstone/60 rounded-full w-36 hidden sm:block" />
        </div>

        {/* Grid Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-pure-white rounded-[35px] p-6 border border-hairline-mist flex flex-col justify-between h-[420px]"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="h-6 bg-sandstone/60 rounded-full w-24" />
                  <div className="h-6 bg-sandstone/40 rounded-full w-20" />
                </div>
                <div className="w-full h-44 rounded-[28px] bg-sandstone/60 mb-5" />
                <div className="h-6 bg-sandstone/80 rounded-full w-3/4 mb-2.5" />
                <div className="h-4 bg-sandstone/50 rounded-full w-full mb-2" />
                <div className="h-4 bg-sandstone/50 rounded-full w-2/3" />
              </div>

              <div className="pt-5 border-t border-hairline-mist/50 flex items-center justify-between">
                <div>
                  <div className="h-3 bg-sandstone/40 rounded-full w-16 mb-1.5" />
                  <div className="h-6 bg-sandstone/70 rounded-full w-28" />
                </div>
                <div className="h-10 bg-sandstone/60 rounded-full w-24" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
