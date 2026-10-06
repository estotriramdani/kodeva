'use client';

import React, { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading2,
  Heading3,
  Type,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link2,
  Unlink,
  Image as ImageIcon,
  Undo,
  Redo,
  Eraser,
  Eye,
  Edit3,
} from 'lucide-react';
import { cn } from '@/shared/lib';

export interface RichTextEditorProps {
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
  onChange?: (html: string) => void;
}

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function RichTextEditor({
  name,
  label,
  defaultValue = '',
  placeholder = 'Mulai tulis ulasan, perbandingan software, atau panduan bisnis di sini...',
  disabled = false,
  className,
  onChange,
}: RichTextEditorProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const [content, setContent] = useState<string>(defaultValue);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageInputOpen, setImageInputOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-fresh-grass underline font-medium hover:opacity-80 transition-opacity',
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-[24px] max-w-full my-6 border border-hairline-mist shadow-xs',
        },
      }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-base max-w-none focus:outline-none min-h-[360px] p-5 sm:p-7 text-ink-black text-[16px] leading-[1.7]',
          '[&_h2]:text-[24px] sm:[&_h2]:text-[28px] [&_h2]:font-bold [&_h2]:text-ink-black [&_h2]:mt-8 [&_h2]:mb-3',
          '[&_h3]:text-[20px] sm:[&_h3]:text-[22px] [&_h3]:font-semibold [&_h3]:text-ink-black [&_h3]:mt-6 [&_h3]:mb-2.5',
          '[&_p]:mb-4 [&_p]:text-ink-black/90',
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5',
          '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5',
          '[&_blockquote]:border-l-4 [&_blockquote]:border-fresh-grass [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-stone-gray [&_blockquote]:my-5',
          '[&_code]:bg-sandstone/50 [&_code]:text-ink-black [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-[14px]',
          '[&_pre]:bg-ink-black [&_pre]:text-pure-white [&_pre]:p-4 [&_pre]:rounded-[18px] [&_pre]:overflow-x-auto [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:my-4',
          '[&_hr]:my-6 [&_hr]:border-hairline-mist'
        ),
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      setContent(html);
      onChange?.(html);
    },
  });

  // Update editor content if defaultValue updates externally (e.g. initial fetch)
  useEffect(() => {
    if (editor && defaultValue && editor.getHTML() !== defaultValue && !editor.isFocused) {
      editor.commands.setContent(defaultValue, { emitUpdate: true });
    }
  }, [defaultValue, editor]);

  // Sync disabled state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
      setLinkInputOpen(false);
      return;
    }

    const formattedUrl = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') || linkUrl.startsWith('mailto:')
      ? linkUrl
      : `https://${linkUrl}`;

    editor.chain().focus().extendMarkRange('link').setLink({ href: formattedUrl }).run();
    setLinkUrl('');
    setLinkInputOpen(false);
  }, [editor, linkUrl]);

  const handleInsertImage = useCallback(() => {
    if (!editor || !imageUrl.trim()) return;

    editor.chain().focus().setImage({ src: imageUrl.trim(), alt: imageAlt.trim() || '' }).run();
    setImageUrl('');
    setImageAlt('');
    setImageInputOpen(false);
  }, [editor, imageUrl, imageAlt]);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-2">
        {label ? (
          <label className="block text-[14px] font-semibold text-ink-black">
            {label}
          </label>
        ) : <div />}

        {/* View Mode Toggle (Visual Editor vs Public Preview) */}
        <div className="flex items-center rounded-full bg-sandstone/50 p-0.5 text-[12px] font-medium border border-hairline-mist/50">
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer',
              viewMode === 'editor'
                ? 'bg-pure-white text-ink-black shadow-xs font-semibold'
                : 'text-stone-gray hover:text-ink-black'
            )}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Visual Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer',
              viewMode === 'preview'
                ? 'bg-pure-white text-ink-black shadow-xs font-semibold'
                : 'text-stone-gray hover:text-ink-black'
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau Baca</span>
          </button>
        </div>
      </div>

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={content} />

      {viewMode === 'editor' ? (
        <div className="rounded-[24px] border border-hairline-mist bg-pure-white overflow-hidden shadow-xs focus-within:border-fresh-grass transition-colors">
          {/* TipTap Toolbar */}
          {isMounted && editor ? (
            <div className="flex flex-wrap items-center gap-1 p-2 bg-cream-paper/70 border-b border-hairline-mist text-[13px]">
              {/* Heading / Paragraph Selector */}
              <div className="flex items-center bg-pure-white rounded-[12px] border border-hairline-mist/60 p-0.5 mr-1">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setParagraph().run()}
                  className={cn(
                    'p-1.5 rounded-[9px] transition-colors cursor-pointer',
                    editor.isActive('paragraph') && !editor.isActive('heading')
                      ? 'bg-fresh-grass text-ink-black font-semibold'
                      : 'text-stone-gray hover:text-ink-black hover:bg-sandstone/40'
                  )}
                  title="Paragraf Normal"
                  disabled={disabled}
                >
                  <Type className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={cn(
                    'p-1.5 rounded-[9px] transition-colors cursor-pointer',
                    editor.isActive('heading', { level: 2 })
                      ? 'bg-fresh-grass text-ink-black font-semibold'
                      : 'text-stone-gray hover:text-ink-black hover:bg-sandstone/40'
                  )}
                  title="Heading 2 (Judul Bagian)"
                  disabled={disabled}
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={cn(
                    'p-1.5 rounded-[9px] transition-colors cursor-pointer',
                    editor.isActive('heading', { level: 3 })
                      ? 'bg-fresh-grass text-ink-black font-semibold'
                      : 'text-stone-gray hover:text-ink-black hover:bg-sandstone/40'
                  )}
                  title="Heading 3 (Sub-Judul Poin)"
                  disabled={disabled}
                >
                  <Heading3 className="w-4 h-4" />
                </button>
              </div>

              {/* Text Styling: Bold, Italic, Strike, Inline Code */}
              <div className="flex items-center bg-pure-white rounded-[12px] border border-hairline-mist/60 p-0.5 mr-1">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={cn(
                    'p-1.5 rounded-[9px] transition-colors cursor-pointer',
                    editor.isActive('bold')
                      ? 'bg-fresh-grass text-ink-black font-semibold'
                      : 'text-stone-gray hover:text-ink-black hover:bg-sandstone/40'
                  )}
                  title="Tebal (Ctrl+B)"
                  disabled={disabled}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={cn(
                    'p-1.5 rounded-[9px] transition-colors cursor-pointer',
                    editor.isActive('italic')
                      ? 'bg-fresh-grass text-ink-black font-semibold'
                      : 'text-stone-gray hover:text-ink-black hover:bg-sandstone/40'
                  )}
                  title="Miring (Ctrl+I)"
                  disabled={disabled}
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={cn(
                    'p-1.5 rounded-[9px] transition-colors cursor-pointer',
                    editor.isActive('strike')
                      ? 'bg-fresh-grass text-ink-black font-semibold'
                      : 'text-stone-gray hover:text-ink-black hover:bg-sandstone/40'
                  )}
                  title="Coret Teks (Strikethrough)"
                  disabled={disabled}
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={cn(
                    'p-1.5 rounded-[9px] transition-colors cursor-pointer',
                    editor.isActive('code')
                      ? 'bg-fresh-grass text-ink-black font-semibold'
                      : 'text-stone-gray hover:text-ink-black hover:bg-sandstone/40'
                  )}
                  title="Format Kode Singkat"
                  disabled={disabled}
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>

              {/* Lists and Quotes */}
              <div className="flex items-center bg-pure-white rounded-[12px] border border-hairline-mist/60 p-0.5 mr-1">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={cn(
                    'p-1.5 rounded-[9px] transition-colors cursor-pointer',
                    editor.isActive('bulletList')
                      ? 'bg-fresh-grass text-ink-black font-semibold'
                      : 'text-stone-gray hover:text-ink-black hover:bg-sandstone/40'
                  )}
                  title="Bullet List (Daftar Poin)"
                  disabled={disabled}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={cn(
                    'p-1.5 rounded-[9px] transition-colors cursor-pointer',
                    editor.isActive('orderedList')
                      ? 'bg-fresh-grass text-ink-black font-semibold'
                      : 'text-stone-gray hover:text-ink-black hover:bg-sandstone/40'
                  )}
                  title="Numbered List (Daftar Angka)"
                  disabled={disabled}
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={cn(
                    'p-1.5 rounded-[9px] transition-colors cursor-pointer',
                    editor.isActive('blockquote')
                      ? 'bg-fresh-grass text-ink-black font-semibold'
                      : 'text-stone-gray hover:text-ink-black hover:bg-sandstone/40'
                  )}
                  title="Kutipan (Blockquote)"
                  disabled={disabled}
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  className="p-1.5 rounded-[9px] text-stone-gray hover:text-ink-black hover:bg-sandstone/40 transition-colors cursor-pointer"
                  title="Garis Pemisah (Divider)"
                  disabled={disabled}
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              {/* Media & Links */}
              <div className="flex items-center bg-pure-white rounded-[12px] border border-hairline-mist/60 p-0.5 mr-1">
                <button
                  type="button"
                  onClick={() => {
                    const previousUrl = editor.getAttributes('link').href;
                    setLinkUrl(previousUrl || '');
                    setLinkInputOpen((prev) => !prev);
                    setImageInputOpen(false);
                  }}
                  className={cn(
                    'p-1.5 rounded-[9px] transition-colors cursor-pointer',
                    editor.isActive('link')
                      ? 'bg-fresh-grass text-ink-black font-semibold'
                      : 'text-stone-gray hover:text-ink-black hover:bg-sandstone/40'
                  )}
                  title="Sisipkan / Edit Tautan (Link)"
                  disabled={disabled}
                >
                  <Link2 className="w-4 h-4" />
                </button>
                {editor.isActive('link') && (
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    className="p-1.5 rounded-[9px] text-coral-pop hover:bg-coral-pop/10 transition-colors cursor-pointer"
                    title="Hapus Tautan"
                    disabled={disabled}
                  >
                    <Unlink className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setImageInputOpen((prev) => !prev);
                    setLinkInputOpen(false);
                  }}
                  className={cn(
                    'p-1.5 rounded-[9px] transition-colors cursor-pointer',
                    imageInputOpen
                      ? 'bg-sandstone text-ink-black'
                      : 'text-stone-gray hover:text-ink-black hover:bg-sandstone/40'
                  )}
                  title="Sisipkan Gambar via URL"
                  disabled={disabled}
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Utilities & History */}
              <div className="flex items-center bg-pure-white rounded-[12px] border border-hairline-mist/60 p-0.5 ml-auto">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                  className="p-1.5 rounded-[9px] text-stone-gray hover:text-ink-black hover:bg-sandstone/40 transition-colors cursor-pointer"
                  title="Hapus Pemformatan Teks"
                  disabled={disabled}
                >
                  <Eraser className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-hairline-mist mx-0.5" />
                <button
                  type="button"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={disabled || !editor.can().undo()}
                  className="p-1.5 rounded-[9px] text-stone-gray hover:text-ink-black hover:bg-sandstone/40 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={disabled || !editor.can().redo()}
                  className="p-1.5 rounded-[9px] text-stone-gray hover:text-ink-black hover:bg-sandstone/40 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-12 bg-cream-paper/70 border-b border-hairline-mist animate-pulse" />
          )}

          {/* Inline Link Modal Input */}
          {linkInputOpen && (
            <div className="p-3 bg-cream-paper border-b border-hairline-mist flex items-center gap-2">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://contoh.com/artikel"
                className="flex-1 bg-pure-white px-3.5 py-1.5 text-[14px] rounded-[14px] border border-hairline-mist focus:border-fresh-grass focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSetLink();
                  }
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={handleSetLink}
                className="px-3.5 py-1.5 rounded-[12px] bg-fresh-grass text-ink-black font-semibold text-[13px] hover:opacity-90 cursor-pointer"
              >
                Terapkan
              </button>
              <button
                type="button"
                onClick={() => setLinkInputOpen(false)}
                className="px-3 py-1.5 rounded-[12px] bg-sandstone/60 text-ink-black text-[13px] hover:bg-sandstone cursor-pointer"
              >
                Batal
              </button>
            </div>
          )}

          {/* Inline Image Modal Input */}
          {imageInputOpen && (
            <div className="p-3 bg-cream-paper border-b border-hairline-mist flex flex-col sm:flex-row items-center gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL Gambar (https://...)"
                className="w-full sm:flex-1 bg-pure-white px-3.5 py-1.5 text-[14px] rounded-[14px] border border-hairline-mist focus:border-fresh-grass focus:outline-none"
                autoFocus
              />
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Alt Teks Gambar (opsional)"
                className="w-full sm:w-56 bg-pure-white px-3.5 py-1.5 text-[14px] rounded-[14px] border border-hairline-mist focus:border-fresh-grass focus:outline-none"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleInsertImage}
                  disabled={!imageUrl.trim()}
                  className="px-3.5 py-1.5 rounded-[12px] bg-fresh-grass text-ink-black font-semibold text-[13px] hover:opacity-90 disabled:opacity-40 cursor-pointer"
                >
                  Sisipkan
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputOpen(false)}
                  className="px-3 py-1.5 rounded-[12px] bg-sandstone/60 text-ink-black text-[13px] hover:bg-sandstone cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* TipTap Editor Content */}
          {isMounted && editor ? (
            <EditorContent editor={editor} />
          ) : (
            <div className="min-h-[360px] p-7 text-stone-gray/50 text-[15px]">
              Memuat Rich Text Editor...
            </div>
          )}
        </div>
      ) : (
        /* Live Article Preview */
        <div className="rounded-[24px] border border-hairline-mist bg-pure-white p-6 sm:p-10 min-h-[360px] shadow-xs">
          {content && content.replace(/<[^>]+>/g, '').trim().length > 0 ? (
            <article
              className={cn(
                'prose prose-base max-w-none text-ink-black text-[16px] leading-[1.7]',
                '[&_h2]:text-[24px] sm:[&_h2]:text-[28px] [&_h2]:font-bold [&_h2]:text-ink-black [&_h2]:mt-8 [&_h2]:mb-3',
                '[&_h3]:text-[20px] sm:[&_h3]:text-[22px] [&_h3]:font-semibold [&_h3]:text-ink-black [&_h3]:mt-6 [&_h3]:mb-2.5',
                '[&_p]:mb-4 [&_p]:text-ink-black/90',
                '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5',
                '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5',
                '[&_blockquote]:border-l-4 [&_blockquote]:border-fresh-grass [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-stone-gray [&_blockquote]:my-5',
                '[&_code]:bg-sandstone/50 [&_code]:text-ink-black [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-[14px]',
                '[&_pre]:bg-ink-black [&_pre]:text-pure-white [&_pre]:p-4 [&_pre]:rounded-[18px] [&_pre]:overflow-x-auto [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:my-4',
                '[&_a]:text-fresh-grass [&_a]:underline [&_a]:font-medium',
                '[&_img]:rounded-[24px] [&_img]:max-w-full [&_img]:border [&_img]:border-hairline-mist [&_img]:my-6',
                '[&_hr]:my-6 [&_hr]:border-hairline-mist'
              )}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="text-center py-16 text-stone-gray">
              <p className="font-medium text-ink-black">Belum ada konten artikel.</p>
              <p className="text-[13px] text-stone-gray mt-1">
                Ganti ke tab &quot;Visual Editor&quot; untuk mulai mengetik.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
