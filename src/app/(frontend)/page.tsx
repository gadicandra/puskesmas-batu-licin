"use client";

import Container from "@/components/layout/Container/Container";
import Button from "@/components/elements/Button";
import Section from "@/components/common/Section";
import ScrollIndicator from "@/components/common/ScrollProgress";
import { SectionProvider } from "@/context/SectionContext";
import { Heart, Clock, Users, Phone, MapPin, Calendar } from "lucide-react";
import Berita from "@/components/berita/page";

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
                    <Container color="primary" className="py-16 md:py-24">
                        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
                            <div className="flex-1 space-y-6">
                                <h1 className="text-4xl font-bold leading-tight text-base md:text-5xl lg:text-6xl">
                                    Selamat Datang di
                                    <span className="block text-secondary">Puskesmas Batu Licin</span>
                                </h1>
                                <p className="max-w-xl text-lg text-tertiary-200">
                                    Memberikan pelayanan kesehatan terbaik untuk masyarakat dengan
                                    penuh dedikasi dan profesionalisme. Kesehatan Anda adalah
                                    prioritas kami.
                                </p>
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <Button
                                        text="Daftar Online"
                                        color="secondary"
                                        leftIcon={<Calendar size={18} />}
                                    />
                                    <Button
                                        text="Hubungi Kami"
                                        color="transparent"
                                        leftIcon={<Phone size={18} />}
                                        className="border border-base/20 text-base"
                                    />
                                </div>
                            </div>
                            <div className="relative h-64 w-64 flex-shrink-0 md:h-80 md:w-80">
                                <div className="absolute inset-0 rounded-full bg-secondary/20" />
                                <div className="absolute inset-4 flex items-center justify-center rounded-full bg-secondary/30">
                                    <Heart className="h-24 w-24 text-secondary" />
                                </div>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* Layanan Section */}
                <Section id="layanan">
                    <Container color="base" className="py-16">
                        <div className="space-y-12">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-primary md:text-4xl">
                                    Layanan Kami
                                </h2>
                                <p className="mt-4 text-tertiary">
                                    Berbagai layanan kesehatan untuk memenuhi kebutuhan Anda
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        icon: <Heart className="h-8 w-8" />,
                                        title: "Pemeriksaan Umum",
                                        desc: "Layanan pemeriksaan kesehatan umum untuk semua usia",
                                    },
                                    {
                                        icon: <Users className="h-8 w-8" />,
                                        title: "Kesehatan Ibu & Anak",
                                        desc: "Program kesehatan khusus ibu hamil, menyusui, dan balita",
                                    },
                                    {
                                        icon: <Clock className="h-8 w-8" />,
                                        title: "Pelayanan 24 Jam",
                                        desc: "Unit gawat darurat yang siap melayani kapan saja",
                                    },
                                ].map((service, index) => (
                                    <div
                                        key={index}
                                        className="group rounded-2xl border border-tertiary-100 bg-base p-6 shadow-sm transition-all duration-300 hover:border-secondary hover:shadow-lg"
                                    >
                                        <div className="mb-4 inline-flex rounded-xl bg-secondary/10 p-3 text-secondary transition-colors group-hover:bg-secondary group-hover:text-base">
                                            {service.icon}
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold text-primary">
                                            {service.title}
                                        </h3>
                                        <p className="text-tertiary">{service.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Container>
                </Section>

                <Section id="makan" isLast>
                    <Container color="base" >
                        <Berita />
                    </Container>
                        
                </Section>

                {/* Info Section 
                <Section id="info" isLast>
                    <Container color="secondary" className="py-16">
                        <div className="flex flex-col items-center gap-8 text-center text-base md:flex-row md:text-left">
                            <div className="flex-1 space-y-4">
                                <h2 className="text-3xl font-bold md:text-4xl">
                                    Informasi Puskesmas
                                </h2>
                                <p className="text-base/80">
                                    Melayani masyarakat dengan sepenuh hati untuk Indonesia yang
                                    lebih sehat.
                                </p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3 rounded-xl bg-base/10 p-4">
                                    <MapPin className="h-6 w-6" />
                                    <div>
                                        <p className="font-semibold">Alamat</p>
                                        <p className="text-sm text-base/80">Jl. Batu Licin No. 1</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-xl bg-base/10 p-4">
                                    <Phone className="h-6 w-6" />
                                    <div>
                                        <p className="font-semibold">Telepon</p>
                                        <p className="text-sm text-base/80">(021) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-xl bg-base/10 p-4">
                                    <Clock className="h-6 w-6" />
                                    <div>
                                        <p className="font-semibold">Jam Operasional</p>
                                        <p className="text-sm text-base/80">Senin - Sabtu, 08:00 - 16:00</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-xl bg-base/10 p-4">
                                    <Calendar className="h-6 w-6" />
                                    <div>
                                        <p className="font-semibold">Pendaftaran</p>
                                        <p className="text-sm text-base/80">Online & Offline</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </Section>
                */}
            </div>
        </SectionProvider>
    );
}
