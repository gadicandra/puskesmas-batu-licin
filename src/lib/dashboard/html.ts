import sanitizeHtml from 'sanitize-html'

/** Tag & atribut yang boleh ada di isi artikel. Sengaja ketat: apa pun yang
 *  dikirim editor tetap dianggap tidak tepercaya. Disanitasi DUA KALI —
 *  saat menyimpan (server action) dan saat merender di halaman publik. */
const ATURAN: sanitizeHtml.IOptions = {
    allowedTags: [
        'p', 'br', 'strong', 'em', 'u', 's',
        'h2', 'h3', 'h4',
        'ul', 'ol', 'li',
        'blockquote',
        'a', 'img',
        'hr',
    ],
    allowedAttributes: {
        a: ['href', 'title', 'target', 'rel'],
        img: ['src', 'alt', 'title', 'width', 'height'],
    },
    // Hanya http(s), mailto, tel, dan path internal. Memblokir javascript: dan data:
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesAppliedToAttributes: ['href', 'src'],
    allowProtocolRelative: false,
    transformTags: {
        // Tautan keluar selalu aman dari tabnabbing.
        a: (tagName, attribs) => {
            const href = attribs.href || ''
            const keluar = /^https?:\/\//i.test(href)
            return {
                tagName,
                attribs: keluar
                    ? { ...attribs, target: '_blank', rel: 'noopener noreferrer' }
                    : { ...attribs },
            }
        },
    },
}

export function bersihkanHtml(html: string): string {
    return sanitizeHtml(html, ATURAN)
}

/** Apakah isi artikel benar-benar kosong (hanya tag tanpa teks)? */
export function htmlKosong(html: string): boolean {
    return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim().length === 0
}

/** Perkiraan waktu baca dalam menit — dipakai halaman artikel publik. */
export function waktuBaca(html: string): number {
    const kata = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    return Math.max(1, Math.round(kata / 200))
}

/** Ringkasan otomatis dari isi artikel bila penulis mengosongkan ringkasan. */
export function ringkasanOtomatis(html: string, maks = 180): string {
    const teks = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
        .replace(/\s+/g, ' ')
        .trim()
    if (teks.length <= maks) return teks
    return `${teks.slice(0, maks).replace(/\s+\S*$/, '')}…`
}
