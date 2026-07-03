"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Beacon ringan: kirim path ke /api/track setiap kali route berubah.
 *  Tidak melacak halaman admin. */
export default function PageViewTracker() {
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname || pathname.startsWith("/admin")) return;
        const controller = new AbortController();
        fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: pathname, referrer: document.referrer }),
            keepalive: true,
            signal: controller.signal,
        }).catch(() => { });
        return () => controller.abort();
    }, [pathname]);

    return null;
}
