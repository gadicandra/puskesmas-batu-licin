import Breadcrumb from "@/components/common/Breadcrumb";
import PageHeader from "@/components/common/PageHeader";
import DirektoriDokter from "@/components/dokter/DirektoriDokter";
import Container from "@/components/layout/Container/Container";
import { ambilDokter } from "@/lib/konten/dokter";

export const metadata = {
    title: "Dokter Kami | Puskesmas Batu Licin",
    description:
        "Daftar dokter UPTD Puskesmas Batulicin beserta spesialisasi dan jadwal praktik mingguan.",
};

export default async function DokterPage() {
    const dokter = await ambilDokter();

    return (
        <div className="min-h-screen bg-base">
            <PageHeader image="/batulicin.webp" title="Dokter Kami" />
            <h1 className="sr-only">Dokter Kami</h1>
            <Breadcrumb
                items={[
                    { label: "Beranda", href: "/" },
                    { label: "Dokter Kami", href: "/dokter" },
                ]}
            />
            <Container sectionClassName="pb-16 pt-8 md:pb-24 md:pt-10">
                <DirektoriDokter dokter={dokter} />
            </Container>
        </div>
    );
}
