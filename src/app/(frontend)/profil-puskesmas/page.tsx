import PageHeader from "@/components/common/PageHeader";
import Breadcrumb from "@/components/common/Breadcrumb";
import ProfilLayout from "@/components/profil/ProfilLayout";
import GridPosyandu from "@/components/posyandu/GridPosyandu";
import { ambilPosyandu } from "@/lib/konten/posyandu";

export default async function profil() {
  // Diambil di sini, bukan di dalam ProfilLayout: ProfilLayout komponen klien,
  // dan yang menyentuh database selalu server component (docs/KONTRAK-DATA.md).
  const posyandu = await ambilPosyandu();

  return (
    <div className="bg-latar min-h-screen">
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
      <GridPosyandu
        posyandu={posyandu}
        judul="Posyandu & Lokasi"
        keterangan="Posyandu binaan Puskesmas Batulicin beserta jadwal kegiatannya."
      />
    </div>
  )
}
