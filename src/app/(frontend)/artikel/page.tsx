import Link from "next/link";
import Breadcrumb from "@/components/common/Breadcrumb";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/layout/Container/Container";
import { ambilDaftarArtikel } from "@/lib/konten/artikel";

export const metadata = {
    title: "Artikel | Puskesmas Batu Licin",
    description: "Berita, pengumuman, dan informasi kesehatan dari Puskesmas Batulicin.",
};

// Tanpa `force-dynamic`: datanya di-cache dan hanya diambil ulang saat admin
// menyimpan perubahan (lihat revalidateTag di dashboard/artikel/actions.ts).
// Lihat docs/KONTRAK-DATA.md.

const formatTanggal = (iso?: string | null) =>
    iso
        ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
        : "";

export default async function ArtikelPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page } = await searchParams;
    const halaman = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);

    const { artikel, totalHalaman, adaSebelumnya, adaBerikutnya } =
        await ambilDaftarArtikel(halaman);

    return (
        <div className="bg-base min-h-screen">
            <PageHeader image="/batulicin.webp" title="Artikel" subtitle="Berita & informasi kesehatan" />
            <Breadcrumb
                items={[
                    { label: "Beranda", href: "/" },
                    { label: "Artikel", href: "/artikel" },
                ]}
            />

            <Container sectionClassName="py-10 md:py-16">
                {artikel.length === 0 ? (
                    <div className="rounded-2xl border border-primary/10 bg-white p-12 text-center">
                        <p className="text-lg font-bold text-primary">Belum ada artikel</p>
                        <p className="mt-1 text-sm text-tertiary">
                            Artikel yang dipublikasikan akan tampil di sini.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {artikel.map((a) => {
                            const cover = a.sampul;
                            return (
                                <Link
                                    key={a.id}
                                    href={`/artikel/${a.slug}`}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-[0_18px_40px_-24px_rgba(35,49,21,0.35)]"
                                >
                                    <div className="aspect-[16/10] w-full overflow-hidden bg-base">
                                        {cover ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={cover.src}
                                                alt={cover.alt}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-secondary/40">
                                                <span className="text-sm font-semibold">Puskesmas Batulicin</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-secondary">
                                            <span>{a.labelKategori}</span>
                                            <span className="text-tertiary/50">•</span>
                                            <span className="font-medium normal-case text-tertiary">
                                                {formatTanggal(a.tanggal)}
                                            </span>
                                        </div>
                                        <h2 className="mt-2 text-lg font-bold leading-snug text-primary group-hover:text-secondary">
                                            {a.judul}
                                        </h2>
                                        {a.ringkasan && (
                                            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-tertiary">
                                                {a.ringkasan}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {totalHalaman > 1 && (
                    <nav
                        aria-label="Navigasi halaman artikel"
                        className="mt-10 flex items-center justify-center gap-3"
                    >
                        {adaSebelumnya ? (
                            <Link
                                href={`/artikel?page=${halaman - 1}`}
                                className="rounded-full border border-primary/15 bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary"
                            >
                                Sebelumnya
                            </Link>
                        ) : (
                            <span className="rounded-full border border-primary/10 px-5 py-2.5 text-sm font-semibold text-tertiary/40">
                                Sebelumnya
                            </span>
                        )}

                        <span className="text-sm font-medium text-tertiary">
                            Halaman {halaman} dari {totalHalaman}
                        </span>

                        {adaBerikutnya ? (
                            <Link
                                href={`/artikel?page=${halaman + 1}`}
                                className="rounded-full border border-primary/15 bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary"
                            >
                                Berikutnya
                            </Link>
                        ) : (
                            <span className="rounded-full border border-primary/10 px-5 py-2.5 text-sm font-semibold text-tertiary/40">
                                Berikutnya
                            </span>
                        )}
                    </nav>
                )}
            </Container>
        </div>
    );
}
