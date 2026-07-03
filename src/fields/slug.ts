import type { Field } from 'payload'

export const slugify = (input: string): string =>
    input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

/** Field slug otomatis dari field sumber (default `title`) bila dikosongkan. */
export const slugField = (source = 'title'): Field => ({
    name: 'slug',
    type: 'text',
    index: true,
    unique: true,
    admin: {
        position: 'sidebar',
        description: 'Dikosongkan = dibuat otomatis dari judul.',
    },
    hooks: {
        beforeValidate: [
            ({ value, data }) => {
                if (typeof value === 'string' && value.length > 0) return slugify(value)
                const src = (data as Record<string, unknown>)?.[source]
                return typeof src === 'string' ? slugify(src) : value
            },
        ],
    },
})
