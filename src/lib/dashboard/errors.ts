/** Menerjemahkan error Payload ke pesan Bahasa Indonesia yang bisa ditindaklanjuti. */
export function pesanError(err: unknown): string {
    const pesan = err instanceof Error ? err.message : String(err ?? '')

    if (/forbidden|not allowed|unauthorized/i.test(pesan)) {
        return 'Anda tidak punya izin untuk melakukan tindakan ini.'
    }
    if (/not found/i.test(pesan)) {
        return 'Data tidak ditemukan. Mungkin sudah dihapus orang lain.'
    }
    if (/duplicate|unique/i.test(pesan)) {
        return 'Ada data lain yang sudah memakai nilai yang sama. Coba ubah sedikit.'
    }
    if (/validation/i.test(pesan)) {
        return 'Ada isian yang belum benar. Periksa kembali lalu simpan lagi.'
    }
    return 'Terjadi kesalahan saat menyimpan. Coba lagi beberapa saat lagi.'
}
