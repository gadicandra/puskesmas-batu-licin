import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative w-full max-h-screen flex flex-col overflow-hidden font-sans">
            {/* Background Image */}


            {/* Overlay - Gradient from left */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent -z-10" />

            {/* Main Content */}
            <div className=" relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-20 items-center lg:items-center flex-1 justify-start md:pt-30 ">

                {/* Left Section: Text & CTAs */}
                <div className="w-full lg:w-1/2 flex flex-col items-start text-left space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/95 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-700 text-xs md:text-sm font-semibold tracking-wide">
                            Fasilitas Kesehatan Tingkat Pertama
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        Selamat Datang di <br />
                        <span className="text-secondary font-bold">UPTD Puskesmas Batulicin</span>
                    </h1>

                    {/* Description */}
                    <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-xl">
                        Melayani kesehatan Anda sepenuh hati. Kami hadir untuk memberikan pelayanan kesehatan dasar yang berkualitas, mudah diakses, dan terjangkau bagi seluruh masyarakat.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-row sm:flex-row gap-4 w-full sm:w-auto pt-2">
                        <Link
                            href="/layanan"
                            className="text-sm px-3 md:px-8 py-2 md:py-3.5 rounded-lg border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-2 group"
                        >
                            <svg className="w-10 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Lihat Layanan
                        </Link>
                        <Link
                            href="/kontak"
                            className="px-3 md:px-8 py-2 md:py-3.5 rounded-lg bg-secondary text-white font-bold shadow-sm shadow-secondary hover:bg-secondary hover:shadow-sm hover:shadow-secondary transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-10 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Hubungi Kami
                        </Link>
                    </div>
                </div>

                {/* Right Section: Akses Cepat Card */}
                <div className="w-full lg:w-auto lg:ml-auto flex flex-col items-stretch lg:items-end">
                    <div className="relative w-auto lg:w-[650px]  bg-primary backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50">
                        {/* Header Card */}
                        <div className="mb-5">
                            <h2 className="text-xl font-bold text-white">Akses Cepat</h2>
                        </div>

                        {/* List Items */}
                        <div className="space-y-3">
                            {/* Item 1 - Layanan Puskesmas */}
                            <Link href="/layanan" className="group bg-white rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="relative w-10 h-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors text-sm">
                                            Layanan Puskesmas
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium truncate">
                                            Daftar layanan yang ada di UPTD...
                                        </p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-green-500 group-hover:text-white transition-all shrink-0 ml-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>

                            {/* Item 2 - Posyandu */}
                            <Link href="/posyandu" className="group bg-white rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="relative w-10 h-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors text-sm">
                                            Posyandu
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium truncate">
                                            Jadwal posyandu dan juga...
                                        </p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-green-500 group-hover:text-white transition-all shrink-0 ml-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>

                            {/* Item 3 - Jadwal Puskesmas */}
                            <Link href="/jadwal" className="group bg-white rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors text-sm">
                                            Jadwal Puskesmas
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium truncate">
                                            Jadwal semua fasilitas...
                                        </p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-green-500 group-hover:text-white transition-all shrink-0 ml-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        </div>

                        {/* Jam Operasional Badge - Bottom Left 
                        <div className="absolute -bottom-4 -left-4 bg-white py-3 px-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                                    Jam Operasional
                                </p>
                                <p className="text-sm font-bold text-green-600">08.00 - 16.00</p>
                            </div>
                        </div>

                        {/* Nomor Darurat Badge - Top Right 
                        <div className="absolute -top-3 -right-3 bg-red-500 px-4 py-3 rounded-2xl text-center shadow-xl transform hover:rotate-0 transition-transform border-4 border-white">
                            <p className="text-[10px] text-white font-bold uppercase tracking-wider">
                                Nomor Darurat
                            </p>
                            <p className="text-2xl font-black text-white leading-none">119</p>
                        </div>
                        */}
                    </div>
                </div>
            </div>

            {/* Bottom Stats - White Card with Rounded Top 
            <div className="relative z-10 w-full bg-white py-8 md:py-10 rounded-t-[2.5rem] md:rounded-t-[3rem] mt-auto shadow-2xl">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 lg:gap-24">
                        
                        <div className="text-center group">
                            <h3 className="text-4xl lg:text-5xl font-black text-green-500 group-hover:scale-110 transition-transform">
                                24/7
                            </h3>
                            <p className="text-slate-600 font-semibold text-sm mt-2">UGD Siaga</p>
                        </div>


                        <div className="hidden md:block w-px h-14 bg-slate-200" />

                        
                        <div className="text-center group">
                            <h3 className="text-4xl lg:text-5xl font-black text-green-500 group-hover:scale-110 transition-transform">
                                15+
                            </h3>
                            <p className="text-slate-600 font-semibold text-sm mt-2">Layanan Kesehatan</p>
                        </div>


                        <div className="hidden md:block w-px h-14 bg-slate-200" />

                        
                        <div className="text-center group">
                            <h3 className="text-4xl lg:text-5xl font-black text-green-500 group-hover:scale-110 transition-transform">
                                10k+
                            </h3>
                            <p className="text-slate-600 font-semibold text-sm mt-2">Pasien Terlayani</p>
                        </div>
                    </div>
                </div>
            </div>
            */}
        </section>
    );
}