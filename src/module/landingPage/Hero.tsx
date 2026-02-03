import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative w-full min-h-screen flex flex-col pt-30 lg:pt-0 lg:justify-center overflow-hidden font-sans bg-black">
            {/* Background Image */}
            <div className="absolute inset-0 -z-20">
                <Image
                    src=" /bgHero.webp"
                    alt="Background Puskesmas"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-900/85 -z-10" />

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-20 items-center h-full pb-32 pt-10 lg:pb-0 lg:pt-0">

                {/* Left Section: Text & CTAs */}
                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-full shadow-md">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-700 text-xs md:text-sm font-bold tracking-wide">
                            Fasilitas Kesehatan Tingkat Pertama
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
                        Selamat Datang di <br />
                        <span className="text-green-500">Puskesmas Batulicin</span>
                    </h1>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button className="px-6 py-3.5 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2 group">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Lihat Layanan
                        </button>
                        <button className="px-6 py-3.5 rounded-xl bg-green-500 text-white font-bold shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Hubungi Kami
                        </button>
                    </div>

                    {/* Info Box */}
                    <div className="mt-8 bg-green-500/20 backdrop-blur-md border-l-4 border-green-400 p-5 rounded-r-xl rounded-bl-xl text-white/90 text-sm md:text-base leading-relaxed max-w-lg shadow-lg">
                        Melayani kesehatan Anda sepenuh hati. Kami hadir untuk memberikan pelayanan kesehatan dasar yang berkualitas, mudah diakses, dan terjangkau bagi seluruh masyarakat.
                    </div>
                </div>

                {/* Right Section: Akses Cepat Card */}
                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end mt-10 lg:mt-0 pb-10">
                    <div className="relative w-full max-w-md bg-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-700">
                        {/* Header Card */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl  font-bold text-white">Akses Cepat</h2>
                            </div>
                            
                        </div>

                        {/* List Items */}
                        <div className="space-y-4">
                            {/* Item 1 */}
                            <div className="group bg-white rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 shrink-0">
                                        <Image src="/layananPuskesmas.webp" alt="Layanan" fill className="object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors">Layanan Puskesmas</h3>
                                        <p className="text-xs text-slate-500 font-medium">Daftar layanan yang ada di UPTD...</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-green-500 group-hover:text-white transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="group bg-white rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 shrink-0">
                                        <Image src="/posyandu.webp" alt="Posyandu" fill className="object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors">Posyandu</h3>
                                        <p className="text-xs text-slate-500 font-medium">Jadwal posyandu dan juga...</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-green-500 group-hover:text-white transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="group bg-white rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors">Jadwal Puskesmas</h3>
                                        <p className="text-xs text-slate-500 font-medium">Jadwal semua fasilitas...</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-green-500 group-hover:text-white transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>

            {/* Bottom Stats - Responsive */}
            <div className="relative z-10 w-full bg-white md:bg-white/80 md:backdrop-blur-md py-8 md:rounded-t-[3rem] mt-auto border-t border-slate-100 md:border-none">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-20">
                        <div className="text-center group">
                            <h3 className="text-3xl lg:text-4xl font-black text-green-500 group-hover:scale-110 transition-transform">24/7</h3>
                            <p className="text-slate-400 font-medium text-sm mt-1">UGD Siaga</p>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-slate-300/50" />

                        <div className="text-center group">
                            <h3 className="text-3xl lg:text-4xl font-black text-green-500 group-hover:scale-110 transition-transform">15+</h3>
                            <p className="text-slate-400 font-medium text-sm mt-1">Layanan Kesehatan</p>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-slate-300/50" />

                        <div className="text-center group">
                            <h3 className="text-3xl lg:text-4xl font-black text-green-500 group-hover:scale-110 transition-transform">10k+</h3>
                            <p className="text-slate-400 font-medium text-sm mt-1">Pasien Terlayani</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}




{/*
    {/* Floating Badge Bottom Left 
                        <div className="absolute -bottom-6 left-6 md:-left-6 bg-white py-2 px-4 rounded-xl shadow-lg flex items-center gap-3 border border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Jam Operasional</p>
                                <p className="text-sm font-bold text-green-600">08.00-16.00</p>
                            </div>
                        </div> 





                        <div className="bg-white px-3 py-2 rounded-xl text-center shadow-md transform rotate-1 hover:rotate-0 transition-transform">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Nomor Darurat</p>
                                <p className="text-2xl font-black text-red-500 leading-none">119</p>
                            </div>
                        */}