import { notFound } from "next/navigation";
import Breadcrumb from "@/components/common/Breadcrumb";
import DaftarSubLayanan from "@/components/layanan/DaftarSubLayanan";
import HeroLayanan from "@/components/layanan/HeroLayanan";
import KaruselDokter from "@/components/layanan/KaruselDokter";
import Container from "@/components/layout/Container/Container";
import { ambilLayananDetail, ambilSlugLayanan } from "@/lib/konten/layanan";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    const slugs = await ambilSlugLayanan();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const layanan = await ambilLayananDetail(slug);
    if (!layanan) return { title: "Layanan tidak ditemukan | Puskesmas Batu Licin" };

    return {
        title: `${layanan.nama} | Puskesmas Batu Licin`,
        description:
            layanan.deskripsi ??
            `Informasi layanan ${layanan.nama} di UPTD Puskesmas Batulicin.`,
    };
}

export default async function DetailLayananPage({ params }: Props) {
    const { slug } = await params;
    const layanan = await ambilLayananDetail(slug);
    if (!layanan) notFound();

    const adaTentang =
        Boolean(layanan.deskripsi) ||
        layanan.subLayanan.length > 0 ||
        layanan.persyaratan.length > 0;

    return (
        <div className="min-h-screen bg-base">
            <HeroLayanan layanan={layanan} />

            <Breadcrumb
                items={[
                    { label: "Beranda", href: "/" },
                    { label: "Layanan", href: "/layanan" },
                    { label: layanan.nama, href: `/layanan/${layanan.slug}` },
                ]}
            />

            {adaTentang && (
                <Container sectionClassName="py-12 md:py-16">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="text-center text-2xl font-bold text-primary md:text-3xl">
                            Tentang {layanan.nama}
                        </h2>

                        {layanan.deskripsi && (
                            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-tertiary md:text-[16px]">
                                {layanan.deskripsi}
                            </p>
                        )}

                        {layanan.subLayanan.length > 0 && (
                            <section id="layanan-tersedia" className="mt-10 scroll-mt-24">
                                <h3 className="text-center text-lg font-bold text-primary md:text-xl">
                                    Layanan yang Tersedia
                                </h3>
                                <div className="mt-5">
                                    <DaftarSubLayanan sub={layanan.subLayanan} />
                                </div>
                            </section>
                        )}

                        {layanan.persyaratan.length > 0 && (
                            <section className="mt-10">
                                <h3 className="text-center text-lg font-bold text-primary md:text-xl">
                                    Syarat &amp; Berkas yang Dibawa
                                </h3>
                                <ul className="mx-auto mt-5 max-w-xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-tertiary md:text-[16px]">
                                    {layanan.persyaratan.map((p) => (
                                        <li key={p}>{p}</li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </Container>
            )}

            {layanan.dokter.length > 0 && (
                <Container sectionClassName="pb-16 pt-4 md:pb-24">
                    <section id="tim-dokter" className="scroll-mt-24">
                        <h2 className="text-center text-2xl font-bold text-primary md:text-3xl">
                            Tim Dokter
                        </h2>
                        <div
                            aria-hidden
                            className="mx-auto mt-2 h-1 w-16 rounded-full bg-secondary"
                        />
                        <div className="mt-8">
                            <KaruselDokter dokter={layanan.dokter} />
                        </div>
                    </section>
                </Container>
            )}
        </div>
    );
}
