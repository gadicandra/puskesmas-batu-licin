import { notFound } from "next/navigation";
import Breadcrumb from "@/components/common/Breadcrumb";
import PageHeader from "@/components/common/PageHeader";
import KontrolProfilDokter from "@/components/dokter/KontrolProfilDokter";
import ProfilDokterDetail from "@/components/dokter/ProfilDokterDetail";
import Container from "@/components/layout/Container/Container";
import { ambilDokter } from "@/lib/konten/dokter";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
    const dokter = await ambilDokter();
    return dokter.map((item) => ({ id: String(item.id) }));
}

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const dokter = (await ambilDokter()).find((item) => String(item.id) === id);

    if (!dokter) return { title: "Dokter tidak ditemukan | Puskesmas Batu Licin" };

    return {
        title: dokter.nama + " | Dokter Puskesmas Batu Licin",
        description: "Profil " + dokter.nama + ", " + dokter.spesialisasi + ", beserta jadwal praktik mingguan di UPTD Puskesmas Batulicin.",
    };
}

export default async function DetailDokterPage({ params }: Props) {
    const { id } = await params;
    const semuaDokter = await ambilDokter();
    const dokter = semuaDokter.find((item) => String(item.id) === id);

    if (!dokter) notFound();

    return (
        <div className="min-h-screen bg-base">
            <PageHeader image="/batulicin.webp" title="Dokter Kami" />
            <h1 className="sr-only">Profil {dokter.nama}</h1>
            <Breadcrumb
                items={[
                    { label: "Beranda", href: "/" },
                    { label: "Dokter Kami", href: "/dokter" },
                    { label: dokter.nama, href: "/dokter/" + dokter.id },
                ]}
            />
            <Container sectionClassName="pb-16 pt-8 md:pb-24 md:pt-10">
                <KontrolProfilDokter dokter={semuaDokter} dokterAktif={dokter} />
                <ProfilDokterDetail dokter={dokter} />
            </Container>
        </div>
    );
}
