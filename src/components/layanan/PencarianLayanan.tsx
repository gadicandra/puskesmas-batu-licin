"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import KartuLayanan from "./KartuLayanan";
import type { LayananPublik } from "@/lib/konten/layanan";

/** Pencarian layanan disaring di sisi peramban, bukan lewat query ke server.
 *
 *  Daftarnya paling banyak beberapa puluh baris dan sudah ikut terkirim
 *  bersama halaman. Menyaring lewat server berarti halaman ini harus dinamis
 *  (`force-dynamic`) — dilarang untuk halaman publik oleh docs/KONTRAK-DATA.md
 *  — dan menukar hasil yang muncul seketika dengan satu perjalanan jaringan
 *  per ketikan. Tidak ada yang didapat dari itu. */
export default function PencarianLayanan({ layanan }: { layanan: LayananPublik[] }) {
    const [kata, setKata] = useState("");

    const hasil = useMemo(() => {
        const q = kata.trim().toLowerCase();
        if (!q) return layanan;
        return layanan.filter(
            (l) =>
                l.nama.toLowerCase().includes(q) ||
                (l.deskripsi ?? "").toLowerCase().includes(q),
        );
    }, [kata, layanan]);

    return (
        <div>
            <div className="mx-auto max-w-md">
                <label htmlFor="cari-layanan" className="sr-only">
                    Cari layanan kesehatan
                </label>
                <div className="relative">
                    <Search
                        aria-hidden
                        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tertiary/60"
                    />
                    <input
                        id="cari-layanan"
                        type="search"
                        value={kata}
                        onChange={(e) => setKata(e.target.value)}
                        placeholder="Cari layanan kesehatan..."
                        // 16px ditulis eksplisit, bukan lewat `text-base`: proyek ini
                        // mendefinisikan `--color-base` di @theme, sehingga `text-base`
                        // menjadi utilitas WARNA dan ukuran fontnya tidak pernah ikut
                        // berubah. Di bawah 16px, iOS memperbesar halaman begitu kolom
                        // ini disentuh.
                        className="h-12 w-full rounded-full border border-primary/15 bg-white pl-12 pr-4 text-[16px] text-primary placeholder:text-tertiary/60 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                </div>
            </div>

            <p aria-live="polite" className="sr-only">
                {hasil.length} layanan ditemukan
            </p>

            {hasil.length === 0 ? (
                <div className="mt-10 rounded-2xl border border-primary/10 bg-white p-12 text-center">
                    <p className="text-lg font-bold text-primary">Layanan tidak ditemukan</p>
                    <p className="mt-1 text-sm text-tertiary">
                        Coba kata lain, misalnya &ldquo;gigi&rdquo; atau &ldquo;imunisasi&rdquo;.
                    </p>
                </div>
            ) : (
                <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
                    {hasil.map((l) => (
                        <KartuLayanan key={l.id} layanan={l} />
                    ))}
                </div>
            )}
        </div>
    );
}
