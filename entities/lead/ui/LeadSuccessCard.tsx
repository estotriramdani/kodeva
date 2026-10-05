import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card, Button } from '@/shared/ui';

export interface LeadSuccessCardProps {
  onReset?: () => void;
  title?: string;
  message?: string;
}

export function LeadSuccessCard({
  onReset,
  title = 'Permintaan Anda Telah Terkirim!',
  message = 'Tim konsultan Kodeva akan segera menghubungi Anda melalui WhatsApp atau Email untuk memberikan penawaran harga terbaik.',
}: LeadSuccessCardProps) {
  return (
    <Card surface="white" className="text-center py-10 px-6 border border-hairline-mist">
      <div className="w-16 h-16 rounded-full bg-fresh-grass/20 text-ink-black flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-fresh-grass" />
      </div>
      <h3 className="text-[24px] font-medium text-ink-black leading-snug mb-2">
        {title}
      </h3>
      <p className="text-[15px] text-stone-gray max-w-md mx-auto leading-relaxed mb-6">
        {message}
      </p>
      {onReset && (
        <Button variant="ghost-pill" size="sm" onClick={onReset}>
          Kirim Permintaan Lain
        </Button>
      )}
    </Card>
  );
}
