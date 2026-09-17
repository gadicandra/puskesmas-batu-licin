import { HiOutlineFingerPrint } from "react-icons/hi";
import PageHeader from "@/components/common/PageHeader";
import Breadcrumb from "@/components/common/Breadcrumb";
import GridPosyandu from "@/components/posyandu/GridPosyandu";
import { ambilPosyandu } from "@/lib/konten/posyandu";

export const metadata = {
    title: "Posyandu & Lokasi | Puskesmas Batulicin",
    description:
        "Daftar posyandu binaan Puskesmas Batulicin beserta lokasi desa dan jadwal kegiatannya.",
};

// Tanpa `force-dynamic`: datanya di-cache dan hanya diambil ulang saat admin
// menyimpan perubahan (revalidateTag di dashboard/posyandu/actions.ts).
// Lihat docs/KONTRAK-DATA.md.

export default async function HalamanPosyandu() {
    const posyandu = await ambilPosyandu();

    return (
        <div className="bg-latar min-h-screen">
            <PageHeader
                image="/batulicin.webp"
                title="Posyandu & Lokasi"
                subtitle="Mengenal lebih dekat Puskesmas Batulicin"
                icon={<HiOutlineFingerPrint />}
            />
            <Breadcrumb
                items={[
                    { label: "Beranda", href: "/" },
                    { label: "Profil", href: "/profil-puskesmas" },
                    { label: "Posyandu & lokasi", href: "/posyandu" },
                ]}
            />
            <GridPosyandu posyandu={posyandu} />
        </div>
    );
}
