import Breadcrumb from "@/components/common/Breadcrumb";
import PageHeader from "@/components/common/PageHeader";
import FasilitasContent from "@/components/fasilitas/FasilitasContent";
import { ambilFasilitas } from "@/lib/konten/fasilitas";

export const metadata = {
    title: "Fasilitas Kesehatan | Puskesmas Batu Licin",
    description:
        "Daftar fasilitas kesehatan, ruang pelayanan, ruang kantor, dan sarana penunjang UPTD Puskesmas Batulicin.",
};

export default async function FasilitasPage() {
    const fasilitas = await ambilFasilitas();

    return (
        <div className="min-h-screen bg-base">
            <PageHeader image="/batulicin.webp" title="Fasilitas Kesehatan" subtitle="Melayani dengan Hati, Merawat seperti Keluarga." />
            <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Fasilitas Kesehatan", href: "/fasilitas" }]} />
            <FasilitasContent fasilitas={fasilitas} />
        </div>
    );
}
