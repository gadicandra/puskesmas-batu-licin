"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaRegCalendarAlt } from "react-icons/fa";
import { IoMdPricetag } from "react-icons/io";
import { BsArrowRight } from "react-icons/bs";

const DUMMY_DATA = [
    {
        id: 1,
        category: "Vaksinasi",
        date: "15 Jan 2025",
        title: "Jadwal Vaksinasi Covid-19 Booster Bulan Januari 2026",
        excerpt: "Puskesmas Batulicin membuka layanan vaksinasi booster untuk masyarakat umum setiap hari...",
        imageUrl: null,
    },
    {
        id: 2,
        category: "Vaksinasi",
        date: "15 Jan 2025",
        title: "Jadwal Vaksinasi Covid-19 Booster Bulan Januari 2026",
        excerpt: "Puskesmas Batulicin membuka layanan vaksinasi booster untuk masyarakat umum setiap hari...",
        imageUrl: null,
    },
    {
        id: 3,
        category: "Vaksinasi",
        date: "15 Jan 2025",
        title: "Jadwal Vaksinasi Covid-19 Booster Bulan Januari 2026",
        excerpt: "Puskesmas Batulicin membuka layanan vaksinasi booster untuk masyarakat umum setiap hari...",
        imageUrl: null,
    },
    {
        id: 4,
        category: "Vaksinasi",
        date: "15 Jan 2025",
        title: "Jadwal Vaksinasi Covid-19 Booster Bulan Januari 2026",
        excerpt: "Puskesmas Batulicin membuka layanan vaksinasi booster untuk masyarakat umum setiap hari...",
        imageUrl: null,
    },
    {
        id: 5,
        category: "Vaksinasi",
        date: "15 Jan 2025",
        title: "Jadwal Vaksinasi Covid-19 Booster Bulan Januari 2026",
        excerpt: "Puskesmas Batulicin membuka layanan vaksinasi booster untuk masyarakat umum setiap hari...",
        imageUrl: null,
    },
];

const BeritaCard = ({ item }: { item: typeof DUMMY_DATA[0] }) => {
    return (
        <div className="bg-white border border-slate-100 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            {/* Image Placeholder */}
            <div className="aspect-[4/3] bg-[#EAF8F2] rounded-lg flex flex-col items-center justify-center text-slate-400 mb-3 relative overflow-hidden group">
                {/* Simulated Image Content */}
                {item.imageUrl ? (
                    <div className="relative w-full h-full">
                        {/* Use dummy image or actual image here if available */}
                    </div>
                ) : (
                    <>
                        <svg className="w-8 h-8 mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <span className="text-xs font-medium opacity-70">Gambar artikel</span>
                    </>
                )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="inline-flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                    <IoMdPricetag className="text-green-500 w-3 h-3" />
                    <span className="text-xs font-bold text-green-700">{item.category}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                    <FaRegCalendarAlt className="w-3 h-3" />
                    <span className="text-xs font-medium">{item.date}</span>
                </div>
            </div>

            {/* Content */}
            <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-2 leading-snug line-clamp-2">
                {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
                {item.excerpt}
            </p>

            {/* Footer */}
            <div className="mt-auto">
                <button className="flex items-center gap-2 text-green-500 font-bold text-xs sm:text-sm hover:gap-3 transition-all group">
                    Baca selengkapnya
                    <BsArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
            </div>
        </div>
    );
};



export default function BeritaSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);

    // Initial check and resize listener
    useEffect(() => {
        const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkIsDesktop();
        window.addEventListener("resize", checkIsDesktop);
        return () => window.removeEventListener("resize", checkIsDesktop);
    }, []);

    // Configuration
    const itemsPerPage = isDesktop ? 4 : 1;
    const totalItems = DUMMY_DATA.length;
    // For desktop, we don't need a slider if items <= 4
    const enableSlider = isDesktop ? totalItems > 4 : totalItems > 1;

    // Max index we can slide to
    // Example: 5 items, 4 per page.
    // Index 0: Shows 0,1,2,3
    // Index 1: Shows 1,2,3,4 (End) -> Max index = 5 - 4 = 1.
    const maxSlideIndex = Math.max(0, totalItems - itemsPerPage);

    // Reset slide if screen changes and we are out of bounds
    useEffect(() => {
        if (currentSlide > maxSlideIndex) {
            setCurrentSlide(maxSlideIndex);
        }
    }, [itemsPerPage, maxSlideIndex, currentSlide]);

    // Auto-slide every 6 seconds
    useEffect(() => {
        if (!enableSlider) return;
        
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
        }, 3000);
        
        return () => clearInterval(interval);
    }, [enableSlider, maxSlideIndex]);

    const nextSlide = () => {
        if (!enableSlider) return;
        setCurrentSlide((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        if (!enableSlider) return;
        setCurrentSlide((prev) => (prev <= 0 ? maxSlideIndex : prev - 1));
    };

    const goToSlide = (index: number) => {
        // Clamp index to valid range
        const validIndex = Math.min(index, maxSlideIndex);
        setCurrentSlide(validIndex);
    };

    return (
        <section className="bg-white py-8 md:py-12">
            <div className="mx-automax-w-7xl">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-10">
                    <div className="max-w-xl">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 md:mb-4">
                            Berita & Artikel Terbaru
                        </h2>
                        <p className="text-slate-900 text-sm sm:text-slate-900 md:text-lg lg:text-slate-900 leading-relaxed">
                            Informasi terkini seputar kegiatan dan edukasi kesehatan dari Puskesmas Batulicin
                        </p>
                    </div>

                    {/* Desktop "See All" Button */}
                    <div className="hidden md:block shrink-0">
                        <button className="inline-flex text-slate-900  items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl border border-green-500 text-green-600 font-bold text-sm md:text-green-500 hover:bg-green-50 transition-colors">
                            Lihat Semua
                            <BsArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>

                {/* Unified Carousel / Grid */}
                <div className="relative group">
                    <div className="overflow-hidden">
                        <div
                            className={`flex transition-transform duration-500 ease-in-out ${!enableSlider ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 transform-none' : ''}`}
                            style={{
                                transform: enableSlider ? `translateX(-${currentSlide * (100 / itemsPerPage)}%)` : "none",
                                gap: enableSlider ? "0" : undefined // Gap is handled by grid
                            }}
                        >
                            {DUMMY_DATA.map((item) => (
                                <div
                                    key={item.id}
                                    className={`
                                        ${enableSlider ? 'flex-shrink-0' : ''}
                                        w-full md:w-1/4 lg:w-1/4
                                        ${enableSlider ? 'px-1.5 sm:px-2 md:px-3' : ''}
                                    `}
                                >
                                    <BeritaCard item={item} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons (Only if slider is enabled) */}
                    {enableSlider && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute top-1/2 -left-3 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-green-600 z-10 hover:scale-110 transition-transform md:-left-5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                                aria-label="Previous Slide"
                            >
                                <FaChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute top-1/2 -right-3 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-green-600 z-10 hover:scale-110 transition-transform md:-right-5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                                aria-label="Next Slide"
                            >
                                <FaChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {/* Pagination Dots (Mobile Only mainly, or Desktop if desired) */}
                    {enableSlider && (
                        <div className="flex justify-center gap-2 mt-6 md:mt-8">
                            {/* Show dots only for valid slide positions */}
                            {Array.from({ length: maxSlideIndex + 1 }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === index ? "w-8 bg-green-500" : "w-2.5 bg-green-200"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile "See All" Button (Bottom) */}
                <div className="mt-6 md:mt-8 text-center md:hidden">
                    <button className="inline-flex items-center gap-2 text-green-600 font-bold text-sm hover:gap-3 transition-all">
                        Lihat Semua Berita
                        <BsArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}
