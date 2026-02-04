"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { FaUsers, FaEye, FaCalendarAlt, FaHeartbeat } from "react-icons/fa";

interface VisitorStatItem {
    id: number;
    label: string;
    value: number;
    icon: React.ReactNode;
    suffix?: string;
}

const PengunjungModule = () => {
    const [displayValues, setDisplayValues] = useState<{ [key: number]: number }>({});

    const statistics: VisitorStatItem[] = [
        {
            id: 1,
            label: "Total Pengunjung Website",
            value: 125847,
            icon: <FaUsers className="w-6 h-6 sm:w-8 sm:h-8" />,
        },
        {
            id: 2,
            label: "Pengunjung Bulan Ini",
            value: 3542,
            icon: <FaEye className="w-6 h-6 sm:w-8 sm:h-8" />,
        },
        {
            id: 3,
            label: "Tahun Berserdiri",
            value: 1977,
            icon: <FaCalendarAlt className="w-6 h-6 sm:w-8 sm:h-8" />,
        },
        {
            id: 4,
            label: "Pasien Dilayani",
            value: 89243,
            icon: <FaHeartbeat className="w-6 h-6 sm:w-8 sm:h-8" />,
            suffix: "+",
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
            }, 20);

            intervals.push(interval);
        });

        return () => intervals.forEach((interval) => clearInterval(interval));
    }, []);

    const formatNumber = (num: number) => {
        return num.toLocaleString("id-ID");
    };

    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            {/* Background Image dengan Overlay */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/batulicin.webp"
                    alt="Puskesmas Batu Licin"
                    fill
                    className="object-cover"
                    quality={85}
                    priority
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 sm:mb-14 lg:mb-16"
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
                        Statistik Pengunjung Website
                    </h2>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                        Terima kasih telah mengunjungi website kami
                    </p>
                </motion.div>

                {/* Statistics Cards Grid */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                        {statistics.map((stat, index) => (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8 }}
                                className="group"
                            >
                                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-7 lg:p-8 text-center h-full flex flex-col items-center justify-center">
                                    {/* Icon */}
                                    <motion.div
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                        className="text-green-500 mb-4 sm:mb-5"
                                    >
                                        {stat.icon}
                                    </motion.div>

                                    {/* Value */}
                                    <div className="mb-2 sm:mb-3">
                                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                                            {formatNumber(displayValues[stat.id] || 0)}
                                            {stat.suffix && (
                                                <span className="ml-1">{stat.suffix}</span>
                                            )}
                                        </h3>
                                    </div>

                                    {/* Label */}
                                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium leading-snug">
                                        {stat.label}
                                    </p>

                                    {/* Bottom border accent */}
                                    <div className="w-0 group-hover:w-full h-1 bg-green-500 rounded-full mt-4 transition-all duration-500"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PengunjungModule;
