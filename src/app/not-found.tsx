import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import Custom404Page from "@/components/page/404-page";
import { ambilJamPelayanan } from "@/lib/konten/jam-pelayanan";

export default async function NotFound() {
    // Halaman 404 memakai Footer yang sama, jadi ikut butuh jam pelayanan.
    const jamPelayanan = await ambilJamPelayanan();

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <Custom404Page />
            </main>
            <Footer jamPelayanan={jamPelayanan} />
        </div>
    );
}
