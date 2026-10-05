'use client';

import { useEffect } from 'react';
import { captureUtmParams } from '@/shared/lib/utm';

export function UtmTracker() {
  useEffect(() => {
    captureUtmParams();
  }, []);

  return null;
}
