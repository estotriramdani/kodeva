import React from 'react';
import { cn } from '@/shared/lib';

export interface ArticleContentProps {
  contentHtml: string;
  className?: string;
}

export function ArticleContent({ contentHtml, className }: ArticleContentProps) {
  return (
    <article
      className={cn(
        'prose prose-lg max-w-none text-ink-black text-[17px] leading-[1.7]',
        '[&_h2]:text-[30px] [&_h2]:font-medium [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-ink-black',
        '[&_h3]:text-[22px] [&_h3]:font-medium [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-ink-black',
        '[&_p]:mb-6 [&_p]:text-ink-black/90',
        '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2',
        '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2',
        '[&_blockquote]:border-l-4 [&_blockquote]:border-fresh-grass [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-stone-gray [&_blockquote]:my-6',
        '[&_img]:rounded-[30px] [&_img]:my-8 [&_img]:border [&_img]:border-hairline-mist',
        '[&_a]:text-ink-black [&_a]:underline [&_a]:decoration-fresh-grass [&_a]:decoration-2 [&_a]:underline-offset-4',
        className
      )}
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
