import React from "react";
import Container from "@/components/layout/Container/Container";
import { Phone, Mail, ChevronRight } from "lucide-react";
import Link from "next/link";
import { FaTiktok, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

const LokasiContent = () => {
    return (
        <Container sectionClassName="py-2">
            <div className="flex flex-col gap-5 lg:gap-10 lg:mb-20">

                {/* Title */}
                <div className="mb-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">Lokasi Kami</h2>
                    <div className="h-1.5 w-[200px] bg-secondary rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
                    {/* Left Column: Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">

                        {/* Jam Operasional */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold text-secondary">Jam Operasional</h3>
                            <button className="flex items-center cursor-pointer justify-between w-full max-w-[250px] bg-[#6B7584] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#555d6a] transition-colors">
                                <span>Waktu Pelayanan</span>
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Kunjungi Kami */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold text-secondary">Kunjungi Kami</h3>
                            <p className="text-slate-700 leading-relaxed font-medium">
                                H223+QRJ, Batulicin, Tanah Bumbu, Kabupaten Tanah Bumbu, Kalimantan Selatan 72273
                            </p>
                        </div>

                        {/* Hubungi Kami */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold text-secondary">Hubungi Kami</h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-slate-700">
                                    <Phone size={20} />
                                    <span className="font-medium">+62 831-1319-1220</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700">
                                    <Mail size={20} />
                                    <a href="mailto:puskesmasbatulicin@yahoo.com" className="font-medium hover:text-secondary hover:underline">
                                        puskesmasbatulicin@yahoo.com
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700">
                                    <FaInstagram size={20} />
                                    <a href="https://instagram.com" className="font-medium hover:text-secondary hover:underline">
                                        @puskesmas.batulicin
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Media Sosial */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold text-secondary">Media Sosial Lainnya</h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-slate-700">
                                    <FaFacebook size={20} />
                                    <a href="#" className="font-medium hover:text-secondary hover:underline">
                                        Uptd Puskesmas Batulicin
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700">
                                    <FaTiktok size={20} />
                                    <a href="#" className="font-medium hover:text-secondary hover:underline">
                                        @puskesmasbatulicin
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700">
                                    <FaYoutube size={20} />
                                    <a href="#" className="font-medium hover:text-secondary hover:underline">
                                        @PuskesmasBatulicin
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Map */}
                    <div className="w-full h-[400px] lg:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.5953688857967!2d116.0046296078733!3d-3.448132600453725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2de8b6653897fc7b%3A0xe4508941a810ff17!2sPuskesmas%20Batulicin!5e0!3m2!1sen!2sid!4v1770201356598!5m2!1sen!2sid"
                            className="w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default LokasiContent;
