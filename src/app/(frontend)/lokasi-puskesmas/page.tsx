import Breadcrumb from "@/components/common/Breadcrumb";
import PageHeader from "@/components/common/PageHeader";
import LokasiContent from "@/components/lokasi/LokasiContent";

export default function LokasiPuskesmasPage() {
    return (
        <div className="bg-base min-h-screen">
            <PageHeader
                image="/batulicin.webp"
                title="Lokasi Puskesmas"
                subtitle="Informasi kontak dan lokasi kami"
            />
            <Breadcrumb
                items={[
                    { label: "Beranda", href: "/" },
                    { label: "Lokasi Puskesmas", href: "/lokasi-puskesmas" },
                ]}
            />

            <LokasiContent />
        </div>
    );
}