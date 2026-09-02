"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown } from "lucide-react";
import type { LayananLengkap } from "@/lib/konten/layanan";

/** Batas jumlah yang langsung tampak di layar sempit. Di layar lebar semuanya
 *  ditampilkan — dua kolom membuat daftar panjang pun masih ringkas. */
const TAMPIL_AWAL_MOBILE = 6;

export default function DaftarSubLayanan({ sub }: { sub: LayananLengkap[] }) {
    const [terbuka, setTerbuka] = useState(false);
    const adaYangDisembunyikan = sub.length > TAMPIL_AWAL_MOBILE;

    return (
        <div>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {sub.map((s, i) => {
                    // Hanya disembunyikan di layar sempit; `sm:` mengembalikannya.
                    const sembunyiDiMobile =
                        adaYangDisembunyikan && !terbuka && i >= TAMPIL_AWAL_MOBILE;

                    return (
                        <li
                            key={s.id}
                            className={sembunyiDiMobile ? "hidden sm:flex" : "flex"}
                        >
                            <span className="flex items-start gap-2.5">
                                <CheckCircle2
                                    aria-hidden
                                    className="mt-0.5 h-5 w-5 shrink-0 text-secondary"
                                />
                                {/* Sub-layanan yang punya rincian sendiri layak
                                    jadi tautan; yang tidak, cukup teks. */}
                                {s.subLayanan.length > 0 || s.deskripsi || s.persyaratan.length > 0 ? (
                                    <Link
                                        href={`/layanan/${s.slug}`}
                                        className="text-sm leading-relaxed text-primary underline-offset-4 hover:text-secondary hover:underline md:text-[16px]"
                                    >
                                        {s.nama}
                                    </Link>
                                ) : (
                                    <span className="text-sm leading-relaxed text-primary md:text-[16px]">
                                        {s.nama}
                                    </span>
                                )}
                            </span>
                        </li>
                    );
                })}
            </ul>

            {adaYangDisembunyikan && (
                <button
                    type="button"
                    onClick={() => setTerbuka((v) => !v)}
                    aria-expanded={terbuka}
                    className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-secondary sm:hidden"
                >
                    {terbuka ? "Sembunyikan" : "Layanan Lainnya"}
                    <ChevronDown
                        aria-hidden
                        className={`h-4 w-4 transition-transform ${terbuka ? "rotate-180" : ""}`}
                    />
                </button>
            )}
        </div>
    );
}
