// Server Component: halaman ini tidak memakai satu pun hook — setiap bagian
// yang interaktif (Section, Hero, Berita, dst.) sudah menandai dirinya sendiri
// dengan "use client". Menjadikannya server-side yang memungkinkan daftar
// layanan dibaca lewat kontrak konten, bukan di-hardcode.
import Container from "@/components/layout/Container/Container";
import Button from "@/components/elements/Button";
import Section from "@/components/common/Section";
import ScrollIndicator from "@/components/common/ScrollProgress";
import { SectionProvider } from "@/context/SectionContext";
import { Heart, Clock, Users, Phone, MapPin, Calendar } from "lucide-react";
import Berita from "@/module/landingPage/berita";
import WaktuPelayanan from "@/module/landingPage/waktuPelayanan";
import Layanan from "@/module/landingPage/layanan";
import StatistikModule from "@/module/landingPage/pengunjung";
import Hero from "@/module/landingPage/Hero";
import Image from "next/image";
import { ambilLayanan } from "@/lib/konten/layanan";

const sectionLabels: Record<string, string> = {
    hero: "Beranda",
    layanan: "Layanan",
    info: "Informasi",
};

export default async function Home() {
    const layanan = await ambilLayanan();
    const kartuLayanan = layanan.slice(0, 8).map((l) => ({
        title: l.nama,
        subtitle: l.deskripsi ?? undefined,
        // Petak di beranda pendek dan mendatar — turunan 400×300 sudah cukup.
        image: l.gambar?.srcMini ?? l.gambar?.src,
        href: `/layanan/${l.slug}`,
    }));

    return (
        <SectionProvider>
            <div className="flex min-h-screen flex-col bg-latar">
                {/* Scroll Indicator */}
                <ScrollIndicator labels={sectionLabels} />

                {/* Hero Section */}
                <Section id="hero" isFirst>


                    <Container color="base" className="py-16 md:py-22">
                        <div className="absolute inset-0 h-7/7 md:h-7/7">
                            <Image
                                src="/batulicin.webp"
                                alt="Background Puskesmas"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {/*<div className="absolute inset-0 bg-gradient-to-r from-[#687643] via-black/50 to-transparent " />*/}
                        <div className="absolute inset-0 bg-primary opacity-65 md:h-7/7"></div>

                        <Hero />


                    </Container>
                    <div className="hidden lg:block relative w-full mt-auto">
                        {/* Lapisan putih di belakang: menutup celah di kiri-kanan sudut
                            lengkung, digambar sebelum kartu sehingga bayangan lengkungnya
                            tetap jatuh di atasnya dan lekuknya masih terbaca. */}
                        <div className="absolute inset-x-0 top-1/2 bottom-0 bg-white" />
                        <div className="relative z-10 w-full bg-white py-8 md:py-10 rounded-b-[5rem] md:rounded-b-[5rem] shadow-2xl">
                        <div className="container mx-auto px-4 ">
                            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 lg:gap-24">

                                <div className="text-center group">
                                    <h3 className="text-4xl lg:text-5xl font-black text-secondary group-hover:scale-110 transition-transform">
                                        24/7
                                    </h3>
                                    <p className="text-slate-600 font-semibold text-sm mt-2">UGD Siaga</p>
                                </div>


                                <div className="hidden md:block w-px h-14 bg-slate-200" />


                                <div className="text-center group">
                                    <h3 className="text-4xl lg:text-5xl font-black text-secondary group-hover:scale-110 transition-transform">
                                        15+
                                    </h3>
                                    <p className="text-slate-600 font-semibold text-sm mt-2">Layanan Kesehatan</p>
                                </div>


                                <div className="hidden md:block w-px h-14 bg-slate-200" />


                                <div className="text-center group">
                                    <h3 className="text-4xl lg:text-5xl font-black text-secondary group-hover:scale-110 transition-transform">
                                        10k+
                                    </h3>
                                    <p className="text-slate-600 font-semibold text-sm mt-2">Pasien Terlayani</p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </Section>

                <Section id="layanan">
                    <Container color="base" fullWidth>
                        <Layanan items={kartuLayanan} />
                    </Container>
                </Section>

                {/* Layanan Section */}
                <Section id="waktulayanan">
                    <Container color="base" fullWidth>
                        <WaktuPelayanan />
                    </Container>
                </Section>

                {/* Statistik Section */}
                <Section id="statistik">
                    <Container color="base" fullWidth>
                        <StatistikModule />
                    </Container>
                </Section>

                <Section id="berita" isLast>
                    <Container color="base" fullWidth>
                        <Berita />
                    </Container>

                </Section>
            </div>
        </SectionProvider>
    );
}
