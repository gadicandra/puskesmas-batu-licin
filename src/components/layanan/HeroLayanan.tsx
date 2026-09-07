import Container from "@/components/layout/Container/Container";
import type { LayananLengkap } from "@/lib/konten/layanan";

/** Hero halaman detail layanan: foto layanan di belakang, lapisan hijau tua di
 *  atasnya agar judul dan tombol tetap terbaca.
 *
 *  Tombol pintasan hanya dirender bila bagian tujuannya benar-benar ada —
 *  tombol yang melompat ke ruang kosong lebih membingungkan daripada tidak ada
 *  tombol sama sekali. */
export default function HeroLayanan({ layanan }: { layanan: LayananLengkap }) {
    const { gambar } = layanan;
    const adaDokter = layanan.dokter.length > 0;
    const adaSubLayanan = layanan.subLayanan.length > 0;

    return (
        <div className="relative isolate overflow-hidden bg-primary">
            {gambar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={gambar.src}
                    alt={gambar.alt}
                    className="absolute inset-0 -z-10 h-full w-full object-cover"
                />
            ) : null}
            <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/97 via-primary/90 to-primary/75"
            />

            {/* Navbar melayang di atas hero, jadi ruang atas dihitung untuk
                    melewatinya — tanpa ini judul tertutup di layar sempit. */}
            <Container sectionClassName="pb-14 pt-28 md:pb-24 md:pt-36">
                <div className="max-w-2xl">
                    <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                        {layanan.nama}
                    </h1>
                    {layanan.deskripsi && (
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-[16px]">
                            {layanan.deskripsi}
                        </p>
                    )}

                    {layanan.jadwal && (
                        <p className="mt-4 inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
                            {layanan.jadwal}
                        </p>
                    )}

                    {(adaDokter || adaSubLayanan) && (
                        <div className="mt-7 flex flex-wrap gap-3">
                            {adaDokter && (
                                <a
                                    href="#tim-dokter"
                                    className="inline-flex min-h-[44px] items-center rounded-full bg-secondary px-6 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    Lihat Tim Dokter
                                </a>
                            )}
                            {adaSubLayanan && (
                                <a
                                    href="#layanan-tersedia"
                                    className="inline-flex min-h-[44px] items-center rounded-full border border-white/60 px-6 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    Lihat Pelayanan
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}
