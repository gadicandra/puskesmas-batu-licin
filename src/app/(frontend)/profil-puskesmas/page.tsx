import PageHeader from "@/components/common/PageHeader";
import Breadcrumb from "@/components/common/Breadcrumb";
import ProfilLayout from "@/components/profil/ProfilLayout";

export default function profil() {
  return (
    <div className="bg-base min-h-screen">
      <PageHeader
        image="/batulicin.webp"
        title="Profil Puskesmas"
        subtitle="Profil Puskesmas & Struktur Organisasi"
      />
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Profil Puskesmas", href: "/profil-puskesmas" },
        ]}
      />
      <ProfilLayout />
    </div>
  )
}