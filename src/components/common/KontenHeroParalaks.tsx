"use client";

import { useEffect, useRef } from "react";

/** Proporsi hero versi compact di Figma (frame "Posyandu", node `12:171`):
 *  254px dari 450px. */
const RASIO_COMPACT = 254 / 450;

/** Batas bawah navbar saat halaman digulir di md+: `md:top-6` (24px) + `h-16`
 *  (64px) di Navbar.tsx. Ubah juga di sini kalau ukuran navbar berubah. */
const NAVBAR_BAWAH_SAAT_SCROLL = 88;

/** Jarak minimum isi hero dari tepi bawah hero. */
const JARAK_BAWAH = 8;

/**
 * Badge + judul hero yang bergerak lebih lambat dari scroll — varian
 * "hero scrolled/compact" di Figma.
 *
 * Di Figma, state compact adalah halaman yang sudah digulir 196px: hero
 * tinggal terlihat 254px, breadcrumb dan kartu ikut naik 196px, tetapi badge
 * hanya naik 82px (y 199 → 117) sehingga tetap di tengah sisa hero di bawah
 * navbar yang mengambang. Tinggi hero TIDAK diubah: mengecilkan elemen saat
 * digulir menggeser seluruh isi halaman di bawahnya dan membuat scroll melompat.
 *
 * - Jarak gulir efek = tinggi hero × (1 − 254/450); untuk hero 450px = 196px.
 * - Geseran akhir dihitung dari ukuran nyata, supaya di hero 300px (md) dan
 *   400px (lg) isi hero juga berakhir di tengah sisa hero di bawah navbar.
 * - Mati di bawah `md` (Figma tidak punya state compact untuk Mobile; sisa hero
 *   di ponsel terlalu pendek) dan bila pengguna memilih kurangi animasi.
 *
 * Sengaja tanpa library animasi: versi pertama memakai `motion.div` dan
 * menambah ±42 kB First Load JS ke SEMUA halaman yang memakai `PageHeader`,
 * padahal efeknya hanya dipakai satu halaman. `transform` ditulis langsung ke
 * elemen lewat `requestAnimationFrame`, tanpa render ulang React.
 */
export default function KontenHeroParalaks({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        const hero = el?.closest("section");
        if (!el || !hero) return;

        const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)");
        const layarMd = window.matchMedia("(min-width: 768px)");
        let jarak = 1;
        let geserAkhir = 0;
        let bingkai = 0;

        const terapkan = () => {
            bingkai = 0;
            if (!geserAkhir) {
                el.style.transform = "";
                return;
            }
            const gulir = Math.min(Math.max(window.scrollY, 0), jarak);
            el.style.transform = `translate3d(0, ${((geserAkhir * gulir) / jarak).toFixed(1)}px, 0)`;
        };

        const hitung = () => {
            // Ukur posisi asli, tanpa geseran yang sedang berlaku.
            el.style.transform = "";
            if (kurangiGerak.matches || !layarMd.matches) {
                geserAkhir = 0;
                terapkan();
                return;
            }
            const gulir = window.scrollY;
            const kotakHero = hero.getBoundingClientRect();
            const kotakIsi = el.getBoundingClientRect();
            const atasHero = kotakHero.top + gulir;
            const tinggiHero = kotakHero.height;
            const tengahIsi = kotakIsi.top + gulir + kotakIsi.height / 2;

            jarak = Math.max(1, Math.round(tinggiHero * (1 - RASIO_COMPACT)));
            const bawahHeroSaatCompact = atasHero + tinggiHero - jarak;
            const tengahTarget = (NAVBAR_BAWAH_SAAT_SCROLL + bawahHeroSaatCompact) / 2;
            let geser = tengahTarget - (tengahIsi - jarak);
            // Jangan sampai isi keluar dari bawah hero.
            const bawahIsiAkhir = tengahIsi + geser + kotakIsi.height / 2;
            const batas = atasHero + tinggiHero - JARAK_BAWAH;
            if (bawahIsiAkhir > batas) geser -= bawahIsiAkhir - batas;

            geserAkhir = Math.max(0, Math.round(geser));
            terapkan();
        };

        const saatGulir = () => {
            if (!bingkai) bingkai = requestAnimationFrame(terapkan);
        };

        hitung();
        window.addEventListener("scroll", saatGulir, { passive: true });
        window.addEventListener("resize", hitung);
        kurangiGerak.addEventListener("change", hitung);
        layarMd.addEventListener("change", hitung);
        const pengamat = new ResizeObserver(hitung);
        pengamat.observe(hero);

        return () => {
            if (bingkai) cancelAnimationFrame(bingkai);
            window.removeEventListener("scroll", saatGulir);
            window.removeEventListener("resize", hitung);
            kurangiGerak.removeEventListener("change", hitung);
            layarMd.removeEventListener("change", hitung);
            pengamat.disconnect();
            el.style.transform = "";
        };
    }, []);

    return (
        <div ref={ref} className="will-change-transform">
            {children}
        </div>
    );
}
