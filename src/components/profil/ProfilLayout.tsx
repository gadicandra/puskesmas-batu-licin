"use client";

import React, { useState } from "react";
import Image from "next/image";
import Container from "@/components/layout/Container/Container";
import ProfilContent from "./content/ProfilContent";
import VisiMisiContent from "./content/VisiMisiContent";
import BudayaKerjaContent from "./content/BudayaKerjaContent";
import MottoContent from "./content/MottoContent";
import MaklumatContent from "./content/MaklumatContent";

type TabType = 'PROFIL' | 'VISI & MISI' | 'BUDAYA KERJA' | 'MOTTO PELAYANAN' | 'MAKLUMAT PELAYANAN';

const ProfilLayout = () => {
    const [activeTab, setActiveTab] = useState<TabType>('PROFIL');

    const contentConfig: Record<TabType, { title: React.ReactNode, component: React.ReactNode }> = {
        'PROFIL': {
            title: "Profil Puskesmas",
            component: <ProfilContent />
        },
        'VISI & MISI': {
            title: "Visi & Misi",
            component: <VisiMisiContent />
        },
        'BUDAYA KERJA': {
            title: "Budaya Kerja",
            component: <BudayaKerjaContent />
        },
        'MOTTO PELAYANAN': {
            title: <span>Motto <span className="text-secondary">CERDAS</span></span>,
            component: <MottoContent />
        },
        'MAKLUMAT PELAYANAN': {
            title: "Maklumat Pelayanan",
            component: <MaklumatContent />
        }
    };

    const navItems: TabType[] = ['PROFIL', 'VISI & MISI', 'BUDAYA KERJA', 'MOTTO PELAYANAN', 'MAKLUMAT PELAYANAN'];

    return (
        <Container sectionClassName="py-0 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-20">

                {/* Left Column: Title, Logo, Nav */}
                <div className="lg:col-span-4 flex flex-col relative h-fit items-center lg:items-start">

                    {/* Title Section */}
                    <div className="mb-4 lg:mb-8 text-center lg:text-left w-full">
                        <h1 className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-primary mb-2 lg:mb-4 leading-tight">
                            {contentConfig[activeTab].title}
                        </h1>
                        <div className="h-1.5 w-[150px] lg:w-full lg:max-w-[200px] bg-secondary rounded-full mx-auto lg:mx-0"></div>
                    </div>

                    {/* Logo Section */}
                    <div className="hidden lg:block lg:mb-10 px-4 w-full flex justify-center lg:justify-start">
                        <div className="relative flex justify-center w-full lg:w-auto opacity-20 lg:opacity-100">
                            <Image
                                src="/puskesmasOutline.webp"
                                alt="Outline Logo"
                                width={500}
                                height={500}
                                className="w-[40%] md:w-[30%] lg:w-[50%] object-contain"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-row lg:flex-col gap-2 lg:gap-1 z-10 w-full lg:w-[80%] mb-8 lg:mb-10 overflow-x-auto lg:overflow-visible items-center lg:items-stretch py-2 px-4 lg:px-0 scroll-smooth snap-x animate-scroll-hint [mask-image:linear-gradient(to_right,black_85%,transparent_100%)] lg:[mask-image:none]">
                        {navItems.map((item, index) => {
                            const isActive = activeTab === item;

                            return (
                                <div
                                    key={item}
                                    onClick={() => setActiveTab(item)}
                                    className={`
                                        snap-center shrink-0 px-4 lg:px-6 py-2 lg:py-3 font-bold cursor-pointer transition-all duration-300 border-b-4 lg:border-b-0 lg:border-l-4 text-sm whitespace-nowrap rounded-lg lg:rounded-none animate-in slide-in-from-right fade-in duration-500 fill-mode-backwards
                                        ${isActive
                                            ? 'text-white bg-secondary border-secondary shadow-md scale-100 lg:scale-105 origin-center lg:origin-left'
                                            : 'text-primary border-transparent hover:text-secondary hover:border-secondary/50 hover:bg-slate-50'
                                        }
                                    `}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-8 min-h-[500px]">
                    {contentConfig[activeTab].component}
                </div>
            </div>
        </Container>
    );
};

export default ProfilLayout;
