import Container from "@/components/layout/Container/Container";
import KartuPosyandu from "./KartuPosyandu";
import type { PosyanduPublik } from "@/lib/konten/posyandu";

/**
 * Grid kartu posyandu — dipakai halaman `/posyandu` DAN seksi posyandu di
 * halaman Profil Puskesmas, supaya keduanya tidak pernah berbeda tampilan.
 *
 * Datanya diterima lewat props, bukan diambil sendiri: yang menyentuh database
 * selalu server component pemanggilnya (lihat docs/KONTRAK-DATA.md).
 */
export default function GridPosyandu({
    posyandu,
    judul,
    keterangan,
}: {
    posyandu: PosyanduPublik[];
    /** Judul seksi. Dikosongkan di `/posyandu` karena hero sudah jadi judulnya. */
    judul?: string;
    keterangan?: string;
}) {
    return (
        <Container sectionClassName="bg-white py-10 md:py-16">
            {judul && (
                <div className="mb-6 md:mb-10">
                    <h2 className="text-[22px] font-black text-primary md:text-[32px]">{judul}</h2>
                    {keterangan && <p className="mt-1 text-sm text-tertiary md:text-base">{keterangan}</p>}
                </div>
            )}

            {posyandu.length === 0 ? (
                <div className="rounded-2xl border border-primary/10 bg-white p-12 text-center">
                    <p className="text-lg font-bold text-primary">Belum ada data Posyandu</p>
                    <p className="mt-1 text-sm text-tertiary">
                        Daftar posyandu akan tampil di sini setelah ditambahkan.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8 min-[1800px]:gap-x-[75px]">
                    {posyandu.map((p) => (
                        <KartuPosyandu key={p.id} posyandu={p} />
                    ))}
                </div>
            )}
        </Container>
    );
}
