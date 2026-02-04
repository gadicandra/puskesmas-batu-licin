import Breadcrumb from "@/components/common/Breadcrumb";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/layout/Container/Container";
import StrukturOrganisasiContent from "@/components/struktur-organisasi/StrukturOrganisasiContent";

export default function StrukturOrganisasiPage() {
    return (
        <div className="bg-base min-h-screen">
            <PageHeader
                image="/batulicin.webp"
                title="Struktur Organisasi"
                subtitle="Profil Puskesmas dan Struktur Organisasi"
            />
            <Breadcrumb
                items={[
                    { label: "Beranda", href: "/" },
                    { label: "Struktur Organisasi", href: "/struktur-organisasi" },
                ]}
            />
            <Container sectionClassName="py-2">
                <StrukturOrganisasiContent />
            </Container>
        </div>
    );
}