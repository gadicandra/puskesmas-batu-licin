import { getPayload } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import Breadcrumb from "@/components/common/Breadcrumb";
import Container from "@/components/layout/Container/Container";

export const dynamic = "force-dynamic";

const formatTanggal = (iso?: string | null) =>
    iso
        ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
        : "";

async function getArticle(slug: string) {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
        collection: "articles",
        where: { slug: { equals: slug }, _status: { equals: "published" } },
        depth: 1,
        limit: 1,
    });
    return docs[0] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const a = await getArticle(slug);
    if (!a) return { title: "Artikel tidak ditemukan" };
    return { title: `${a.title} | Puskesmas Batu Licin`, description: a.excerpt ?? undefined };
}

export default async function ArtikelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const a = await getArticle(slug);
    if (!a) notFound();

    const cover = typeof a.cover === "object" && a.cover ? a.cover : null;

    return (
        <div className="bg-base min-h-screen">
            <div className="h-16" />
            <Breadcrumb
                items={[
                    { label: "Beranda", href: "/" },
                    { label: "Artikel", href: "/artikel" },
                    { label: a.title, href: `/artikel/${a.slug}` },
                ]}
            />

            <Container sectionClassName="py-8 md:py-12">
                <article className="mx-auto max-w-3xl">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-secondary">
                        <span>{a.category}</span>
                        <span className="text-tertiary/50">•</span>
                        <span className="font-medium normal-case text-tertiary">
                            {formatTanggal(a.publishedDate)}
                        </span>
                    </div>
                    <h1 className="mt-3 text-3xl md:text-4xl font-black leading-tight text-primary">
                        {a.title}
                    </h1>
                    {a.excerpt && (
                        <p className="mt-4 text-lg leading-relaxed text-tertiary">{a.excerpt}</p>
                    )}

                    {cover?.url && (
                        <div className="mt-8 overflow-hidden rounded-2xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={cover.url} alt={cover.alt || a.title} className="w-full object-cover" />
                        </div>
                    )}

                    {a.content && (
                        <div className="prose prose-lg mt-8 max-w-none text-primary/90">
                            <RichText data={a.content as SerializedEditorState} />
                        </div>
                    )}
                </article>
            </Container>
        </div>
    );
}
