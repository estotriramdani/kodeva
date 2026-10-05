'use client';

import React, { useState, useRef } from 'react';
import { Code, Eye, Link2, Quote } from 'lucide-react';

export interface RichTextEditorProps {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

export function RichTextEditor({
  name,
  label,
  defaultValue = '',
  placeholder = 'Tulis konten artikel dalam format HTML...',
  rows = 8,
  disabled = false,
}: RichTextEditorProps) {
  const [content, setContent] = useState<string>(defaultValue);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync jika defaultValue berubah dari luar saat buka modal edit
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);
  if (defaultValue !== prevDefaultValue) {
    setPrevDefaultValue(defaultValue);
    setContent(defaultValue || '');
  }

  const insertTag = (before: string, after: string = '', placeholderText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || placeholderText;

    const replacement = `${before}${selectedText}${after}`;
    const newContent =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    setContent(newContent);

    // Kembalikan posisi cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[14px] font-medium text-ink-black">
          {label}
        </label>
        <div className="flex rounded-full bg-sandstone/60 p-0.5 text-[12px] font-medium">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors cursor-pointer ${
              mode === 'edit'
                ? 'bg-pure-white text-ink-black shadow-xs font-semibold'
                : 'text-stone-gray hover:text-ink-black'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Editor HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors cursor-pointer ${
              mode === 'preview'
                ? 'bg-pure-white text-ink-black shadow-xs font-semibold'
                : 'text-stone-gray hover:text-ink-black'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau</span>
          </button>
        </div>
      </div>

      {mode === 'edit' ? (
        <div className="border border-hairline-mist rounded-[20px] bg-pure-white overflow-hidden focus-within:border-fresh-grass transition-colors">
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 bg-cream-paper/70 border-b border-hairline-mist/70 text-[12px]">
            <button
              type="button"
              disabled={disabled}
              onClick={() => insertTag('<h2>', '</h2>', 'Judul Sub-Bagian')}
              className="px-2 py-1 rounded-[8px] bg-pure-white hover:bg-sandstone text-ink-black font-bold border border-hairline-mist/50 cursor-pointer"
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => insertTag('<h3>', '</h3>', 'Sub-Judul Poin')}
              className="px-2 py-1 rounded-[8px] bg-pure-white hover:bg-sandstone text-ink-black font-bold border border-hairline-mist/50 cursor-pointer"
              title="Heading 3"
            >
              H3
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => insertTag('<p>', '</p>', 'Teks paragraf baru di sini...')}
              className="px-2 py-1 rounded-[8px] bg-pure-white hover:bg-sandstone text-ink-black font-medium border border-hairline-mist/50 cursor-pointer"
              title="Paragraf"
            >
              P
            </button>
            <div className="h-4 w-px bg-hairline-mist mx-1" />
            <button
              type="button"
              disabled={disabled}
              onClick={() => insertTag('<strong>', '</strong>', 'teks tebal')}
              className="px-2.5 py-1 rounded-[8px] bg-pure-white hover:bg-sandstone text-ink-black font-bold border border-hairline-mist/50 cursor-pointer"
              title="Tebal (Bold)"
            >
              B
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => insertTag('<em>', '</em>', 'teks miring')}
              className="px-2.5 py-1 rounded-[8px] bg-pure-white hover:bg-sandstone text-ink-black italic border border-hairline-mist/50 cursor-pointer"
              title="Miring (Italic)"
            >
              I
            </button>
            <div className="h-4 w-px bg-hairline-mist mx-1" />
            <button
              type="button"
              disabled={disabled}
              onClick={() =>
                insertTag(
                  '<ul>\n  <li>',
                  '</li>\n  <li>Poin kedua</li>\n</ul>',
                  'Poin pertama'
                )
              }
              className="px-2 py-1 rounded-[8px] bg-pure-white hover:bg-sandstone text-ink-black border border-hairline-mist/50 cursor-pointer"
              title="Bullet List"
            >
              • List
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() =>
                insertTag('<a href="https://" target="_blank" rel="noopener noreferrer">', '</a>', 'Nama Tautan')
              }
              className="inline-flex items-center gap-1 px-2 py-1 rounded-[8px] bg-pure-white hover:bg-sandstone text-ink-black border border-hairline-mist/50 cursor-pointer"
              title="Tautan / Link"
            >
              <Link2 className="w-3 h-3" />
              <span>Link</span>
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => insertTag('<blockquote>', '</blockquote>', 'Kutipan inspiratif atau kutipan penting...')}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-[8px] bg-pure-white hover:bg-sandstone text-ink-black border border-hairline-mist/50 cursor-pointer"
              title="Blockquote"
            >
              <Quote className="w-3 h-3" />
              <span>Quote</span>
            </button>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            name={name}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className="w-full bg-transparent text-ink-black px-4 py-3 outline-none text-[14px] font-mono leading-relaxed resize-y"
          />
        </div>
      ) : (
        /* Live Preview */
        <div className="border border-hairline-mist rounded-[20px] bg-cream-paper/50 p-6 min-h-[200px] overflow-y-auto max-h-[400px]">
          {/* Input hidden agar value tetap terkirim saat form disubmit di mode preview */}
          <input type="hidden" name={name} value={content} />

          {content.trim() ? (
            <div
              className="prose prose-sm max-w-none text-ink-black/90 leading-relaxed space-y-3 [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:text-ink-black [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:text-ink-black [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_blockquote]:border-l-4 [&_blockquote]:border-fresh-grass [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-stone-gray [&_a]:text-fresh-grass [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-stone-gray text-[13px] italic text-center py-8">
              Belum ada konten artikel yang ditulis.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
