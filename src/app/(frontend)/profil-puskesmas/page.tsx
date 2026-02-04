import PageHeader from "@/components/common/PageHeader";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function profil() {
  return (
    <>
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
    </>
  )
}