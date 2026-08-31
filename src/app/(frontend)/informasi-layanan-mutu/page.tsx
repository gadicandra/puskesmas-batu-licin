import Breadcrumb from "@/components/common/Breadcrumb";
import PageHeader from "@/components/common/PageHeader";
import InformasiLayananLayout from "@/components/informasi-layanan/InformasiLayananLayout";

export const metadata = {
    title: "Informasi Layanan dan Mutu | Puskesmas Batu Licin",
    description:
        "Standar pelayanan, tarif, hak dan kewajiban pasien, layanan BPJS & non-BPJS, serta indikator mutu dan keselamatan pasien Puskesmas Batu Licin.",
};

export default function InformasiLayananMutuPage() {
    return (
        <div className="bg-base min-h-screen">
            <PageHeader
                image="/batulicin.webp"
                title="Informasi Layanan dan Mutu"
                subtitle="Standar, tarif, hak pasien, dan komitmen mutu kami"
            />
            <Breadcrumb
                items={[
                    { label: "Beranda", href: "/" },
                    { label: "Informasi Layanan dan Mutu", href: "/informasi-layanan-mutu" },
                ]}
            />
            <InformasiLayananLayout />
        </div>
    );
}
