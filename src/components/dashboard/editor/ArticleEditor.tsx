'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { useCallback, useState } from 'react'
import {
    Bold, Italic, Heading2, Heading3, List, ListOrdered,
    Link2, Link2Off, ImageIcon, Quote, Undo2, Redo2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import MediaPicker from '@/components/dashboard/media/MediaPicker'

/** Tombol toolbar. Sengaja hanya yang benar-benar dibutuhkan — setiap tombol
 *  tambahan adalah beban bagi pengguna awam (docs/DASHBOARD.md §3). */
function TombolToolbar({
    aktif = false,
    label,
    onClick,
    children,
    disabled,
}: {
    aktif?: boolean
    label: string
    onClick: () => void
    children: React.ReactNode
    disabled?: boolean
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={label}
            aria-label={label}
            aria-pressed={aktif}
            disabled={disabled}
            className={cn(
                'inline-flex h-10 min-w-[40px] items-center justify-center rounded-lg px-2 transition',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary',
                'disabled:cursor-not-allowed disabled:opacity-40',
                aktif ? 'bg-secondary text-white' : 'text-tertiary hover:bg-base hover:text-primary'
            )}
        >
            {children}
        </button>
    )
}

function Toolbar({ editor }: { editor: Editor }) {
    const [pemilihGambarTerbuka, setPemilihGambarTerbuka] = useState(false)

    const aturTautan = useCallback(() => {
        const sekarang = editor.getAttributes('link').href as string | undefined
        const url = window.prompt('Alamat tautan (contoh: https://kemkes.go.id)', sekarang ?? 'https://')
        if (url === null) return
        if (url.trim() === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
    }, [editor])

    return (
        <>
            <div className="flex flex-wrap items-center gap-1 border-b border-primary/10 bg-white px-2 py-2">
                <TombolToolbar
                    label="Tebal"
                    aktif={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold size={18} />
                </TombolToolbar>
                <TombolToolbar
                    label="Miring"
                    aktif={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic size={18} />
                </TombolToolbar>

                <span className="mx-1 h-6 w-px bg-primary/10" />

                <TombolToolbar
                    label="Judul bagian"
                    aktif={editor.isActive('heading', { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 size={18} />
                </TombolToolbar>
                <TombolToolbar
                    label="Sub-judul"
                    aktif={editor.isActive('heading', { level: 3 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 size={18} />
                </TombolToolbar>

                <span className="mx-1 h-6 w-px bg-primary/10" />

                <TombolToolbar
                    label="Daftar berpoin"
                    aktif={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List size={18} />
                </TombolToolbar>
                <TombolToolbar
                    label="Daftar bernomor"
                    aktif={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered size={18} />
                </TombolToolbar>
                <TombolToolbar
                    label="Kutipan"
                    aktif={editor.isActive('blockquote')}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote size={18} />
                </TombolToolbar>

                <span className="mx-1 h-6 w-px bg-primary/10" />

                <TombolToolbar label="Tautan" aktif={editor.isActive('link')} onClick={aturTautan}>
                    <Link2 size={18} />
                </TombolToolbar>
                <TombolToolbar
                    label="Hapus tautan"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    disabled={!editor.isActive('link')}
                >
                    <Link2Off size={18} />
                </TombolToolbar>
                <TombolToolbar label="Sisipkan gambar" onClick={() => setPemilihGambarTerbuka(true)}>
                    <ImageIcon size={18} />
                </TombolToolbar>

                <span className="mx-1 h-6 w-px bg-primary/10" />

                <TombolToolbar
                    label="Batalkan"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo2 size={18} />
                </TombolToolbar>
                <TombolToolbar
                    label="Ulangi"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo2 size={18} />
                </TombolToolbar>
            </div>

            {pemilihGambarTerbuka && (
                <MediaPicker
                    onTutup={() => setPemilihGambarTerbuka(false)}
                    onPilih={(media) => {
                        editor.chain().focus().setImage({ src: media.url, alt: media.alt }).run()
                        setPemilihGambarTerbuka(false)
                    }}
                />
            )}
        </>
    )
}

export default function ArticleEditor({
    name,
    nilaiAwal,
    onChange,
}: {
    name: string
    nilaiAwal: string
    onChange?: (html: string) => void
}) {
    const [html, setHtml] = useState(nilaiAwal)

    const editor = useEditor({
        immediatelyRender: false, // wajib untuk SSR Next.js
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3, 4] },
                link: false, // dipasang terpisah di bawah dengan konfigurasi sendiri
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                protocols: ['http', 'https', 'mailto', 'tel'],
            }),
            Image.configure({ inline: false }),
        ],
        content: nilaiAwal,
        editorProps: {
            attributes: {
                class:
                    'prose-dashboard min-h-[320px] w-full px-4 py-4 focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            const isi = editor.getHTML()
            setHtml(isi)
            onChange?.(isi)
        },
    })

    return (
        <div className="overflow-hidden rounded-xl border border-primary/15 bg-white focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/30">
            {editor && <Toolbar editor={editor} />}
            <EditorContent editor={editor} />
            {/* Nilai sebenarnya yang dikirim ke server action */}
            <input type="hidden" name={name} value={html} />
        </div>
    )
}
