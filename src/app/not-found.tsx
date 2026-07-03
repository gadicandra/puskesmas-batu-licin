import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import Custom404Page from "@/components/page/404-page";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <Custom404Page />
            </main>
            <Footer />
        </div>
    );
}
