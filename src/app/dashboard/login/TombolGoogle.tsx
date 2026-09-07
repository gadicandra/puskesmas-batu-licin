/** Tombol "Masuk dengan Google". Sengaja tautan biasa, bukan tombol JavaScript:
 *  alurnya memang berpindah halaman ke Google, jadi tidak perlu komponen klien. */
export default function TombolGoogle({ tujuan }: { tujuan?: string | null }) {
    return (
        <a
            href={tujuan ? `/dashboard/login/google?lanjut=${encodeURIComponent(tujuan)}` : '/dashboard/login/google'}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-3 rounded-xl border border-primary/15 bg-white px-5 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
            <LogoGoogle />
            Masuk dengan Google
        </a>
    )
}

function LogoGoogle() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden focusable="false">
            <path
                fill="#4285F4"
                d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
            />
            <path
                fill="#34A853"
                d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
            />
            <path
                fill="#FBBC05"
                d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
            />
            <path
                fill="#EA4335"
                d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
            />
        </svg>
    )
}
