import Link from "next/link";
import type { LayananPublik } from "@/lib/konten/layanan";

/** Kartu satu layanan di halaman /layanan: foto memenuhi kartu, keterangan
 *  duduk di atasnya.
 *
 *  Gradasi gelap bukan hiasan — itu yang menjamin teks putih tetap terbaca
 *  (target WCAG AA). Pekatnya diambil dari kasus terburuk, yaitu foto yang
 *  bagian bawahnya justru terang seperti dokumen berlatar putih; gradasi yang
 *  memudar sampai transparan tidak cukup untuk itu. */
export default function KartuLayanan({ layanan }: { layanan: LayananPublik }) {
    const { gambar } = layanan;

    return (
        <Link
            href={`/layanan/${layanan.slug}`}
            className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl border border-primary/10 bg-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(35,49,21,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:aspect-[4/5]"
        >
            {gambar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    // Turunan potret 768×1024, bukan berkas aslinya: kartu ini
                    // hanya selebar ~250px, dan gambar layanan bisa 2500px.
                    src={gambar.srcKartu ?? gambar.src}
                    alt={gambar.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
            ) : (
                <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary/60"
                />
            )}

            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20"
            />

            <div className="relative z-10 p-4 sm:p-5">
                <h2 className="text-[16px] font-bold leading-tight text-white sm:text-lg">
                    {layanan.nama}
                </h2>
                {layanan.deskripsi && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/85 sm:text-sm">
                        {layanan.deskripsi}
                    </p>
                )}
                {layanan.jumlahSubLayanan > 0 && (
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-white/70 sm:text-xs">
                        {layanan.jumlahSubLayanan} jenis pelayanan
                    </p>
                )}
            </div>
        </Link>
    );
}
