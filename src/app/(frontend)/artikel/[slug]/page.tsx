import { notFound } from "next/navigation";
import Breadcrumb from "@/components/common/Breadcrumb";
import Container from "@/components/layout/Container/Container";
import { ambilArtikel } from "@/lib/konten/artikel";

// Tanpa `force-dynamic`: datanya di-cache dan hanya diambil ulang saat admin
// menyimpan perubahan. Lihat docs/KONTRAK-DATA.md.

const formatTanggal = (iso?: string | null) =>
    iso
        ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
        : "";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const a = await ambilArtikel(slug);
    if (!a) return { title: "Artikel tidak ditemukan" };
    return { title: `${a.judul} | Puskesmas Batu Licin`, description: a.ringkasan ?? undefined };
}

export default async function ArtikelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const a = await ambilArtikel(slug);
    if (!a) notFound();

    const cover = a.sampul;

    return (
        <div className="bg-base min-h-screen">
            <div className="h-16" />
            <Breadcrumb
                items={[
                    { label: "Beranda", href: "/" },
                    { label: "Artikel", href: "/artikel" },
                    { label: a.judul, href: `/artikel/${a.slug}` },
                ]}
            />

            <Container sectionClassName="py-8 md:py-12">
                <article className="mx-auto max-w-3xl">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-secondary">
                        <span>{a.labelKategori}</span>
                        <span className="text-tertiary/50">•</span>
                        <span className="font-medium normal-case text-tertiary">
                            {formatTanggal(a.tanggal)}
                        </span>
                        {a.isiHtml && (
                            <>
                                <span className="text-tertiary/50">•</span>
                                <span className="font-medium normal-case text-tertiary">
                                    {a.menitBaca} menit baca
                                </span>
                            </>
                        )}
                    </div>
                    <h1 className="mt-3 text-3xl md:text-4xl font-black leading-tight text-primary">
                        {a.judul}
                    </h1>
                    {a.ringkasan && (
                        <p className="mt-4 text-lg leading-relaxed text-tertiary">{a.ringkasan}</p>
                    )}

                    {cover && (
                        <div className="mt-8 overflow-hidden rounded-2xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={cover.src} alt={cover.alt} className="w-full object-cover" />
                        </div>
                    )}

                    {a.isiHtml && (
                        // `isiHtml` sudah disanitasi di lapisan konten — HTML dari
                        // editor tidak pernah dianggap tepercaya, dan dibersihkan dua
                        // kali: saat disimpan dan saat dibaca dari database.
                        <div
                            className="prose-artikel mt-8"
                            dangerouslySetInnerHTML={{ __html: a.isiHtml }}
                        />
                    )}
                </article>
            </Container>
        </div>
    );
}
