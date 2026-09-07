import Breadcrumb from "@/components/common/Breadcrumb";
import PencarianLayanan from "@/components/layanan/PencarianLayanan";
import Container from "@/components/layout/Container/Container";
import { ambilLayanan } from "@/lib/konten/layanan";

export const metadata = {
    title: "Layanan Kesehatan | Puskesmas Batu Licin",
    description:
        "Daftar layanan kesehatan yang tersedia di UPTD Puskesmas Batulicin beserta jadwal dan persyaratannya.",
};

// Tanpa `force-dynamic`: datanya di-cache dan hanya diambil ulang saat admin
// menyimpan perubahan (revalidateTag di dashboard/layanan/actions.ts).
// Lihat docs/KONTRAK-DATA.md.

export default async function LayananPage() {
    const layanan = await ambilLayanan();

    return (
        <div className="min-h-screen bg-base">
            <Breadcrumb
                items={[
                    { label: "Beranda", href: "/" },
                    { label: "Layanan", href: "/layanan" },
                ]}
            />

            <Container sectionClassName="py-10 md:py-16">
                <header className="mx-auto max-w-2xl text-center">
                    <h1 className="text-3xl font-bold text-primary md:text-4xl">
                        Layanan Kesehatan Kami
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-tertiary md:text-[16px]">
                        Puskesmas Batulicin menyediakan berbagai layanan kesehatan untuk memenuhi
                        kebutuhan masyarakat dengan tenaga kesehatan yang profesional
                    </p>
                </header>

                <div className="mt-8">
                    {layanan.length === 0 ? (
                        <div className="rounded-2xl border border-primary/10 bg-white p-12 text-center">
                            <p className="text-lg font-bold text-primary">Belum ada layanan</p>
                            <p className="mt-1 text-sm text-tertiary">
                                Daftar layanan akan tampil di sini setelah ditambahkan.
                            </p>
                        </div>
                    ) : (
                        <PencarianLayanan layanan={layanan} />
                    )}
                </div>
            </Container>
        </div>
    );
}
