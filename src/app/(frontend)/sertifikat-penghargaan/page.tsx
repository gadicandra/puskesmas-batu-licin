import Breadcrumb from "@/components/common/Breadcrumb";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/layout/Container/Container";
import SertifikatPenghargaanContent from "@/components/sertifikat/SertifikatPenghargaanContent";

import styles from "@/components/sertifikat/sertifikat.module.css";

export const metadata = {
    title: "Sertifikat dan Penghargaan | Puskesmas Batu Licin",
    description:
        "Daftar sertifikat akreditasi dan piagam penghargaan UPTD Puskesmas Batulicin.",
};

export default function SertifikatPenghargaanPage() {
    return (
        <div className="min-h-screen bg-latar">
            <div className={styles.hero}>
                <PageHeader
                    image="/Design%20Puskesmas%20Batulicin%20(4)/hero-penghargaan.png"
                    title="Akreditasi & Penghargaan"
                    subtitle="Capaian pelayanan Puskesmas Batulicin"
                />
            </div>
            <Breadcrumb
                items={[
                    { label: "Beranda", href: "/" },
                    { label: "Sertifikat dan Penghargaan", href: "/sertifikat-penghargaan" },
                ]}
            />
            <Container sectionClassName="pb-16 pt-4 md:pb-24 md:pt-6">
                <SertifikatPenghargaanContent />
            </Container>
        </div>
    );
}
