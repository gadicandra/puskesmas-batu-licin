"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    FaInstagram,
    FaYoutube,
    FaTwitter,
    FaWhatsapp,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
} from "react-icons/fa";

const Nav = [
    { name: 'Beranda', href: '/' },
    { name: 'Profil Puskesmas', href: '/profil-puskesmas' },
    { name: 'Struktur Organisasi', href: '/struktur-organisasi' },
    { name: 'Informasi Layanan dan Mutu', href: '/informasi-layanan-mutu' },
    { name: 'Artikel', href: '/artikel' },
    { name: 'Lokasi Puskesmas', href: '/lokasi-puskesmas' },
]

const Footer = () => {
    return (
        <footer className="relative w-full text-white overflow-hidden ">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/11.webp"
                    alt="Background footer"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-[#243117] opacity-85"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 mx-auto px-8 lg:px-16 py-5 pt-10 pb-2 lg:pt-9 lg:pb-2 ">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 ">

                    {/* Column 1: Brand Info */}
                    <div className="flex items-center lg:items-start flex-col space-y-6 ">
                        <div className="flex items-center gap-3 ">
                            <div className="relative w-[50px] h-[50px]">
                                <Image
                                    src="/logo_puskesmas.webp"
                                    alt="Logo Puskesmas"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col font-bold leading-tight">
                                <span className="text-xl">Puskesmas Batulicin</span>
                                <span className="text-sm font-normal text-gray-300">
                                    Kab. Tanah Bumbu
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-center md:text-left leading-relaxed text-gray-200">
                            Melayani Kesehatan Masyarakat dengan sepenuh hati. Kami berkomitmen memberikan pelayanan kesehatan dasar yang berkualitas dan mudah diakses.
                        </p>

                        <div className="flex flex-col items-center lg:items-start gap-3">
                            <h3 className="font-bold text-lg">Sosial Media Kami :</h3>
                            <div className="flex gap-4">
                                <Link href="#" className="hover:text-green-400 transition">
                                    <FaInstagram size={24} />
                                </Link>
                                <Link href="#" className="hover:text-green-400 transition">
                                    <FaYoutube size={24} />
                                </Link>
                                <Link href="#" className="hover:text-green-400 transition">
                                    <FaTwitter size={24} />
                                </Link>
                                <Link href="#" className="hover:text-green-400 transition">
                                    <FaWhatsapp size={24} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Contact Info */}
                    <div className="flex flex-col items-center lg:items-start space-y-6">
                        <h3 className="text-xl font-bold">Hubungi Kami</h3>
                        <ul className="space-y-4  text-sm text-gray-200">
                            <li className="flex items-start gap-3">
                                <FaMapMarkerAlt className="mt-1 text-green-400 flex-shrink-0" size={16} />
                                <span>
                                    Jl. Pemerintahan No.071 RT.005 RW.001, Kel. Batulicin, Kec. Batulicin,
                                    Kab. Tanah Bumbu, Kalimantan Selatan
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="text-green-400 flex-shrink-0" size={16} />
                                <a href="mailto:puskesmasbatulicin@yahoo.com" className="hover:underline">
                                    puskesmasbatulicin@yahoo.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhoneAlt className="text-green-400 flex-shrink-0" size={16} />
                                <a href="tel:081148812882" className="hover:underline">
                                    0811 4881 2882 (Telepon / WhatsApp)
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhoneAlt className="text-green-400 flex-shrink-0" size={16} />
                                <a href="tel:085249312786" className="hover:underline">
                                    0852 4931 2786 (Darurat / PSC 119)
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaClock className="mt-1 text-green-400 flex-shrink-0" size={16} />
                                <span>
                                    Senin&ndash;Kamis: 08.00&ndash;11.00<br />
                                    Jumat: 07.30&ndash;10.30<br />
                                    Sabtu: 08.00&ndash;11.00<br />
                                    <span className="text-green-400">UGD &amp; UGD Kebidanan: 24 jam</span>
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Navigation */}
                    <div className="flex flex-col space-y-6 pl-0 lg:pl-10 hidden lg:block">
                        <h3 className="text-xl font-bold">Navigation</h3>
                        <ul className="space-y-3 text-sm text-gray-200">
                            {Nav.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-green-400 hover:translate-x-1 transition-all inline-block">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Newsletter & Map */}
                    <div className="flex flex-col space-y-6">
                        <h3 className="text-xl font-bold text-green-400">Lokasi Kami</h3>

                        {/* Map Integration */}
                        <div className="w-full h-40 bg-gray-300 rounded-xl overflow-hidden relative shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.366299136979!2d115.95574577496796!3d-3.4566739965157836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2de64f69741634ad%3A0x6295556213768228!2sPuskesmas%20Batulicin%201!5e0!3m2!1sen!2sid!4v1706691234567!5m2!1sen!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="opacity-90 hover:opacity-100 transition"
                            ></iframe>
                        </div>

                    </div>

                </div>

                {/* Copyright */}
                <div className="border-t border-gray-500 mt-12 pt-3 text-center text-xs text-gray-400">
                    <p>&copy; 2026 UPTD Puskesmas Batulicin. Hak Cipta Dilindungi.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
