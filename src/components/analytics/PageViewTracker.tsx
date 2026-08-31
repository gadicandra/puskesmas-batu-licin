"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Path yang tidak ikut dihitung sebagai kunjungan publik. */
const PATH_DIKECUALIKAN = ["/admin", "/dashboard", "/api"];

/** Beacon ringan: kirim path ke /api/track setiap kali route berubah.
 *  Halaman admin/dashboard/API tidak dilacak, dan path yang sama tidak
 *  dikirim dua kali berturut-turut (mencegah hitungan ganda saat navigasi cepat). */
export default function PageViewTracker() {
    const pathname = usePathname();
    const terakhirDikirim = useRef<string | null>(null);

    useEffect(() => {
        if (!pathname) return;
        if (PATH_DIKECUALIKAN.some((awalan) => pathname.startsWith(awalan))) return;
        if (terakhirDikirim.current === pathname) return;

        const controller = new AbortController();
        // Jeda singkat: kalau user melompat cepat antar halaman, hanya yang
        // benar-benar dibuka yang tercatat.
        const timer = setTimeout(() => {
            terakhirDikirim.current = pathname;
            fetch("/api/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: pathname, referrer: document.referrer }),
                keepalive: true,
                signal: controller.signal,
            }).catch(() => { });
        }, 800);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [pathname]);

    return null;
}
