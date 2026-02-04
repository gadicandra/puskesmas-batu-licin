"use client";

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

const sectionLabels: Record<string, string> = {
    hero: "Beranda",
    layanan: "Layanan",
    info: "Informasi",
};

export default function Home() {
    return (
        <SectionProvider>
            <div className="flex min-h-screen flex-col bg-base">
                {/* Scroll Indicator */}
                <ScrollIndicator labels={sectionLabels} />

                {/* Hero Section */}
                <Section id="hero" isFirst>
                    
                    
                    <Container color="primary" className="py-16 md:py-22">
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
                        <div className="absolute inset-0 bg-[#243117] opacity-65 md:h-7/7"></div>
                        
                        <Hero />
                        
                        
                    </Container>
                    <div className="hidden lg:block relative z-10 w-full bg-white py-8 md:py-10 rounded-b-[5rem] md:rounded-b-[5rem] mt-auto shadow-2xl ">
                            <div className="container mx-auto px-4 ">
                                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 lg:gap-24">
                                    
                                    <div className="text-center group">
                                        <h3 className="text-4xl lg:text-5xl font-black text-[#67943B] group-hover:scale-110 transition-transform">
                                            24/7
                                        </h3>
                                        <p className="text-slate-600 font-semibold text-sm mt-2">UGD Siaga</p>
                                    </div>


                                    <div className="hidden md:block w-px h-14 bg-slate-200" />

                                    
                                    <div className="text-center group">
                                        <h3 className="text-4xl lg:text-5xl font-black text-[#67943B] group-hover:scale-110 transition-transform">
                                            15+
                                        </h3>
                                        <p className="text-slate-600 font-semibold text-sm mt-2">Layanan Kesehatan</p>
                                    </div>


                                    <div className="hidden md:block w-px h-14 bg-slate-200" />

                                    
                                    <div className="text-center group">
                                        <h3 className="text-4xl lg:text-5xl font-black text-[#67943B] group-hover:scale-110 transition-transform">
                                            10k+
                                        </h3>
                                        <p className="text-slate-600 font-semibold text-sm mt-2">Pasien Terlayani</p>
                                    </div>
                                </div>
                            </div>
                    </div>
                </Section>

                <Section id="layanan">
                    <Container color="base" className="">
                        <Layanan />
                    </Container>
                </Section>

                {/* Layanan Section */}
                <Section id="waktulayanan">
                    <Container color="base" className="">
                        <WaktuPelayanan/>
                    </Container>
                </Section>

                {/* Statistik Section 
                <Section id="statistik">
                    <Container color="base" >
                        <StatistikModule />
                    </Container>
                </Section>
                */}

                <Section id="berita" isLast>
                    <Container color="base" >
                        <Berita />
                    </Container>
                        
                </Section>
            </div>
        </SectionProvider>
    );
}
