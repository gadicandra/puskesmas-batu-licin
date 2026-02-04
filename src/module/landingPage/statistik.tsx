"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { HiOutlineUsers, HiOutlineHeart, HiOutlineAcademicCap } from "react-icons/hi2";

interface StatisticItem {
    id: number;
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    suffix?: string;
}

const StatistikModule = () => {
    const [displayValues, setDisplayValues] = useState<{ [key: number]: number }>({});

    const statistics: StatisticItem[] = [
        {
            id: 1,
            label: "Pasien Terlayani",
            value: 5847,
            icon: <HiOutlineUsers className="w-8 h-8 sm:w-10 sm:h-10" />,
            color: "from-blue-500 to-blue-600",
            suffix: "+",
        },
        {
            id: 2,
            label: "Program Kesehatan",
            value: 24,
            icon: <HiOutlineHeart className="w-8 h-8 sm:w-10 sm:h-10" />,
            color: "from-red-500 to-red-600",
        },
        {
            id: 3,
            label: "Tenaga Profesional",
            value: 42,
            icon: <HiOutlineAcademicCap className="w-8 h-8 sm:w-10 sm:h-10" />,
            color: "from-green-500 to-green-600",
        },
        {
            id: 4,
            label: "Layanan Medis",
            value: 18,
            icon: <HiOutlineAcademicCap className="w-8 h-8 sm:w-10 sm:h-10" />,
            color: "from-purple-500 to-purple-600",
        },
    ];

    // Counter animation
    useEffect(() => {
        const intervals: NodeJS.Timeout[] = [];

        statistics.forEach((stat) => {
            const increment = Math.ceil(stat.value / 50);
            let currentValue = 0;

            const interval = setInterval(() => {
                if (currentValue < stat.value) {
                    currentValue = Math.min(currentValue + increment, stat.value);
                    setDisplayValues((prev) => ({
                        ...prev,
                        [stat.id]: currentValue,
                    }));
                } else {
                    clearInterval(interval);
                }
            }, 30);

            intervals.push(interval);
        });

        return () => intervals.forEach((interval) => clearInterval(interval));
    }, []);

    return (
        <section className="relative w-full overflow-hidden border">
            {/* Background Layer - Fixed position, limited height on desktop */}
            <div className="absolute inset-0 w-full h-full md:h-[70vh] bg-slate-900">
                <div className="sticky top-0 w-full h-screen md:h-[70vh]">
                    <Image
                        src="/batulicin.webp"
                        alt="Puskesmas Batu Licin Background"
                        fill
                        className="object-cover"
                        priority
                        quality={85}
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
            </div>

            {/* Content Container - Relative positioning */}
            <div className="relative z-10 bg-transparent">
                {/* Header Section */}
                <div className="px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                            Statistik Kesehatan
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed">
                            Pencapaian dan dedikasi Puskesmas Batu Licin dalam melayani kesehatan masyarakat
                        </p>
                    </motion.div>
                </div>

                {/* Statistics Grid */}
                <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                            {statistics.map((stat, index) => (
                                <motion.div
                                    key={stat.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                    }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -8 }}
                                    className="group"
                                >
                                    <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                                        {/* Gradient Background */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>

                                        {/* Content */}
                                        <div className="relative z-10 flex flex-col items-center text-center">
                                            {/* Icon */}
                                            <motion.div
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                                className={`bg-gradient-to-br ${stat.color} p-4 sm:p-5 rounded-full mb-4 sm:mb-6 text-white shadow-lg`}
                                            >
                                                {stat.icon}
                                            </motion.div>

                                            {/* Value */}
                                            <div className="mb-2 sm:mb-3">
                                                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                                                    {displayValues[stat.id] || 0}
                                                </span>
                                                {stat.suffix && (
                                                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white ml-1">
                                                        {stat.suffix}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Label */}
                                            <p className="text-sm sm:text-base lg:text-lg text-slate-200 font-semibold leading-tight">
                                                {stat.label}
                                            </p>
                                        </div>

                                        {/* Bottom accent line */}
                                        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color} rounded-b-2xl w-0 group-hover:w-full transition-all duration-500`}></div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom gradient fade - only visible on mobile */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white md:from-transparent to-transparent pointer-events-none md:hidden"></div>
        </section>
    );
};

export default StatistikModule;