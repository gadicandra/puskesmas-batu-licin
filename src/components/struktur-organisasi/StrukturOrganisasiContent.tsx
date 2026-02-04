"use client";
import React, { useState } from "react";
import Image from "next/image";

// Tipe Data untuk Struktur Organisasi
type PJ = {
    name: string;
    role: string;
};

type Cluster = {
    name: string;
    role: string;
    image: string;
    pjs: PJ[];
};

type OrgData = {
    kepala: {
        name: string;
        role: string;
        image: string;
    };
    clusters: Cluster[];
};

const orgData: OrgData = {
    kepala: {
        name: "drg. Rian Prasetya Munaji",
        role: "Kepala Puskesmas",
        image: "/kpl.webp",
    },
    clusters: [
        {
            name: "drg. Rian Prasetya Munaji",
            role: "Klaster 1: Manajemen",
            image: "/placeholder_avatar.webp",
            pjs: [
                { name: "drg. Rian Prasetya Munaji", role: "PJ Manajemen SDM" },
                { name: "drg. Rian Prasetya Munaji", role: "PJ Manajemen Data" },
                { name: "drg. Rian Prasetya Munaji", role: "PJ Manajemen Keuangan" },
            ]
        },
        {
            name: "drg. Rian Prasetya Munaji",
            role: "Klaster 2: UKM Esensial",
            image: "/placeholder_avatar.webp",
            pjs: [
                { name: "drg. Rian Prasetya Munaji", role: "PJ Promosi Kesehatan" },
                { name: "drg. Rian Prasetya Munaji", role: "PJ Kesehatan Lingkungan" },
                { name: "drg. Rian Prasetya Munaji", role: "PJ KIA & KB" },
                { name: "drg. Rian Prasetya Munaji", role: "PJ Gizi" },
                { name: "drg. Rian Prasetya Munaji", role: "PJ Pencegahan Penyakit" },
            ]
        },
        {
            name: "drg. Rian Prasetya Munaji",
            role: "Klaster 3: UKM Pengembangan",
            image: "/placeholder_avatar.webp",
            pjs: [
                { name: "drg. Rian Prasetya Munaji", role: "PJ Kesehatan Jiwa" },
                { name: "drg. Rian Prasetya Munaji", role: "PJ Kesehatan Gigi" },
                { name: "drg. Rian Prasetya Munaji", role: "PJ Kesehatan Tradisional" },
                { name: "drg. Rian Prasetya Munaji", role: "PJ Kesehatan Olahraga" },
            ]
        },
        {
            name: "drg. Rian Prasetya Munaji",
            role: "Klaster 4: UKP",
            image: "/placeholder_avatar.webp",
            pjs: [
                { name: "drg. Rian Prasetya Munaji", role: "PJ Pendaftaran" },
                { name: "drg. Rian Prasetya Munaji", role: "PJ Pemeriksaan Umum" },
                { name: "drg. Rian Prasetya Munaji", role: "PJ Farmasi" },
                { name: "drg. Rian Prasetya Munaji", role: "PJ Laboratorium" },
            ]
        },
        {
            name: "drg. Rian Prasetya Munaji",
            role: "Klaster 5: Jejaring & Jaringan",
            image: "/placeholder_avatar.webp",
            pjs: [
                { name: "drg. Rian Prasetya Munaji", role: "PJ Pustu" },
                { name: "drg. Rian Prasetya Munaji", role: "PJ Poskesdes" },
            ]
        },
    ]
};

const OrgNode = ({ name, role, image, isTextOnly = false }: { name: string, role: string, image?: string, isTextOnly?: boolean }) => {
    if (isTextOnly) {
        return (
            <div className="relative z-10 w-48 md:w-56 py-2 px-1 text-center bg-white/50 backdrop-blur-sm rounded-lg border border-slate-200 min-h-[50px] flex flex-col justify-center items-center">
                <p className="text-secondary font-bold text-sm leading-tight mb-0.5">{role}</p>
                <p className="text-primary font-medium text-xs">{name}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center shrink-0 z-10 relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-3 relative bg-slate-200">
                <Image
                    src={image || "/placeholder_avatar.webp"}
                    alt={role}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col justify-start items-center w-48 md:w-56 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-primary font-bold text-center leading-tight mb-1 text-sm">{name}</h4>
                <p className="text-secondary text-xs md:text-sm text-center font-medium">{role}</p>
            </div>
        </div>
    );
};

const StrukturOrganisasiContent = () => {
    const [activeClusterIndex, setActiveClusterIndex] = useState(0);
    const activeCluster = orgData.clusters[activeClusterIndex];

    return (
        <div className="w-full flex flex-col items-center">

            {/* Mobile/Tablet Navigation */}
            <div className="flex lg:hidden w-full overflow-x-auto py-2 px-4 gap-2 mb-8 items-center scroll-smooth snap-x animate-scroll-hint md:justify-center">
                {orgData.clusters.map((cluster, index) => {
                    const isActive = activeClusterIndex === index;
                    const label = cluster.role.split(':')[0];

                    return (
                        <button
                            key={index}
                            onClick={() => setActiveClusterIndex(index)}
                            className={`
                                whitespace-nowrap cursor-pointer px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border snap-center
                                ${isActive
                                    ? 'bg-secondary text-white border-secondary shadow-md scale-105'
                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-secondary hover:text-secondary'
                                }
                            `}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Mobile/Tablet Vertical View */}
            <div className="flex lg:hidden flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom duration-500">
                {/* Level 1: Kepala Puskesmas */}
                <div className="relative flex flex-col items-center">
                    <OrgNode
                        name={orgData.kepala.name}
                        role={orgData.kepala.role}
                        image={orgData.kepala.image}
                    />
                    {/* Connector Line Down */}
                    <div className="w-[3px] h-8 bg-slate-400"></div>
                </div>

                {/* Level 2: Active Cluster Head */}
                <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-300" key={`cluster-${activeClusterIndex}`}>
                    <OrgNode
                        name={activeCluster.name}
                        role={activeCluster.role}
                        image={activeCluster.image}
                    />

                    {/* Connector to PJs */}
                    {activeCluster.pjs.length > 0 && (
                        <div className="w-[3px] h-8 bg-slate-400"></div>
                    )}

                    {/* Level 3: Active Cluster PJs */}
                    <div className="flex flex-col gap-4 items-center relative">
                        {activeCluster.pjs.map((pj, pjIndex) => (
                            <div key={pjIndex} className="relative flex flex-col items-center animate-in slide-in-from-bottom-2 fade-in duration-300" style={{ animationDelay: `${pjIndex * 100}ms` }}>
                                <OrgNode
                                    name={pj.name}
                                    role={pj.role}
                                    isTextOnly={true}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop Tree View */}
            <div className="hidden lg:flex min-w-[1000px] flex-col items-center gap-20 p-10 overflow-x-auto">

                {/* Level 1: Kepala Puskesmas */}
                <div className="relative">
                    <OrgNode
                        name={orgData.kepala.name}
                        role={orgData.kepala.role}
                        image={orgData.kepala.image}
                    />
                    {/* Connector Line Down */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[3px] h-14 bg-slate-400"></div>
                </div>

                {/* Level 2: Clusters Wrapper */}
                <div className="relative flex justify-center gap-4 items-start w-fit mx-auto">
                    {/* Horizontal Connector Line */}
                    {/* Spans from center of first to center of last. With w-64 items (16rem/256px), center is 32 tailwind unit (8rem/128px) from edge */}
                    <div className="absolute -top-10 left-32 right-32 h-16 border-t-[3px] border-slate-400"></div>

                    {orgData.clusters.map((cluster, index) => (
                        <div key={index} className="flex flex-col items-center relative gap-8 w-64">
                            {/* Vertical Connector from Horizontal Line */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[3px] h-16 bg-slate-400"></div>

                            {/* Cluster Node */}
                            <OrgNode
                                name={cluster.name}
                                role={cluster.role}
                                image={cluster.image}
                            />

                            {/* Connector to PJs */}
                            {cluster.pjs.length > 0 && (
                                <div className="w-[3px] h-8 bg-slate-400"></div>
                            )}

                            {/* PJs List */}
                            <div className="flex flex-col gap-3 w-full relative items-center">
                                {cluster.pjs.map((pj, pjIndex) => (
                                    <div key={pjIndex} className="relative">
                                        <OrgNode
                                            name={pj.name}
                                            role={pj.role}
                                            isTextOnly={true}
                                        />
                                        {/* No vertical line between stacked PJs, just gap */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default StrukturOrganisasiContent;
