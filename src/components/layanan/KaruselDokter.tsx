"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import KartuDokter from "./KartuDokter";
import type { DokterPublik } from "@/lib/konten/dokter";

/** Karusel dokter berbasis scroll-snap, bukan library.
 *
 *  Wadahnya tetap sebuah daftar yang bisa digulir — dengan jari, roda tetikus,
 *  atau Tab ke kartu berikutnya — sehingga tombol panah murni tambahan. Kalau
 *  JavaScript-nya gagal dimuat, daftarnya masih utuh dan bisa dijelajahi. */
export default function KaruselDokter({ dokter }: { dokter: DokterPublik[] }) {
    const wadahRef = useRef<HTMLDivElement>(null);
    const [aktif, setAktif] = useState(0);
    const [bisaKiri, setBisaKiri] = useState(false);
    const [bisaKanan, setBisaKanan] = useState(false);

    const perbarui = useCallback(() => {
        const el = wadahRef.current;
        if (!el) return;
        setBisaKiri(el.scrollLeft > 8);
        setBisaKanan(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);

        const anak = el.children[0] as HTMLElement | undefined;
        if (anak) {
            const lebarLangkah = anak.offsetWidth + 24; // 24px = gap-6
            setAktif(Math.round(el.scrollLeft / lebarLangkah));
        }
    }, []);

    useEffect(() => {
        perbarui();
        const el = wadahRef.current;
        if (!el) return;
        el.addEventListener("scroll", perbarui, { passive: true });
        window.addEventListener("resize", perbarui);
        return () => {
            el.removeEventListener("scroll", perbarui);
            window.removeEventListener("resize", perbarui);
        };
    }, [perbarui]);

    const geser = (arah: -1 | 1) => {
        const el = wadahRef.current;
        if (!el) return;
        const anak = el.children[0] as HTMLElement | undefined;
        const langkah = anak ? anak.offsetWidth + 24 : el.clientWidth;
        el.scrollBy({ left: arah * langkah, behavior: "smooth" });
    };

    return (
        <div className="relative">
            <div
                ref={wadahRef}
                // `snap-x` + overflow-auto: geseran jari terasa wajar di ponsel,
                // dan kartu selalu berhenti rapi di tepi kiri.
                className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
            >
                {dokter.map((d) => (
                    <div
                        key={d.id}
                        className="w-[280px] shrink-0 snap-start sm:w-[320px] lg:w-[360px]"
                    >
                        <KartuDokter dokter={d} />
                    </div>
                ))}
            </div>

            {dokter.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={() => geser(-1)}
                        disabled={!bisaKiri}
                        aria-label="Dokter sebelumnya"
                        className="absolute -left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/10 bg-white text-primary shadow-md transition disabled:opacity-0 md:flex"
                    >
                        <ChevronLeft aria-hidden className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => geser(1)}
                        disabled={!bisaKanan}
                        aria-label="Dokter berikutnya"
                        className="absolute -right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/10 bg-white text-primary shadow-md transition disabled:opacity-0 md:flex"
                    >
                        <ChevronRight aria-hidden className="h-5 w-5" />
                    </button>

                    <div aria-hidden className="mt-5 flex justify-center gap-2">
                        {dokter.map((d, i) => (
                            <span
                                key={d.id}
                                className={`h-2 rounded-full transition-all ${i === aktif ? "w-6 bg-secondary" : "w-2 bg-primary/20"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
