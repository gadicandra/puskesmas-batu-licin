import Container from "@/components/layout/Container/Container";
import Image from "next/image";
import React from "react";
import KontenHeroParalaks from "./KontenHeroParalaks";

interface PageHeaderProps {
    image: string;
    title: string;
    subtitle?: string;
    variant?: "default" | "pengaduan";
    /** Ikon dalam lingkaran hijau di sebelah kiri judul (lihat design/posyandu.png).
     *
     *  Saat diisi, judulnya memakai skala yang lebih kecil daripada varian
     *  polos: di desain, judul berdampingan dengan lingkaran ikon, dan ukuran
     *  96px milik varian polos akan membuat lingkarannya tampak seperti noda di
     *  samping teks raksasa. */
    icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ image, title, subtitle, variant = "default", icon }) => {
    const isPengaduan = variant === "pengaduan";

    // Tinggi hero MINIMUM, bukan tetap. Dulu tinggi hero dikunci (`h-[200px]`
    // dst.), sehingga judul panjang yang terbungkus beberapa baris meluber ke
    // bawah hero (mis. /informasi-layanan-mutu 24px di 320px, 8px di
    // 1024–1279px) atau naik ke bawah navbar yang fixed (teks mulai di y=56,
    // navbar 64px).
    //
    // Susunan lama (`py-16`/`py-22` + `mt-10` + `h-full`) menghasilkan kotak isi
    // yang dimulai di y=104 (mobile) / y=128 (md+) dengan tinggi
    // 32px / 84px (md) / 184px (lg) — dan 47px / 234px (xl) untuk varian ikon.
    // Teks ditengahkan di kotak itu; bila lebih tinggi, teks menempel di atas
    // dan memanjang ke bawah. Ukuran kotak itu dipertahankan persis (`min-h`
    // pada isi), jadi posisi teks tidak berubah sepiksel pun. Bedanya: hero kini
    // ikut bertambah tinggi bila jarak teks ke tepi bawah hero kurang dari 24px
    // (mobile) / 48px (md+), alih-alih meluber.
    // Varian pengaduan tidak diubah: diukur aman di 320–1920px.
    //
    // Judul hero adalah judul halaman, jadi dirender sebagai <h1> (sebelumnya
    // <p>, sehingga 7 halaman sama sekali tidak punya <h1>). Kelas CSS-nya tidak
    // diubah; Tailwind preflight sudah menormalkan ukuran dan margin <h1>.
    const kelasIsi = isPengaduan
        ? "relative z-30 flex h-full flex-col justify-center pt-10"
        : icon
            ? "relative z-30 flex flex-col justify-center min-h-[47px] md:min-h-[84px] lg:min-h-[184px] xl:min-h-[234px]"
            : "relative z-30 flex flex-col justify-center min-h-8 md:min-h-[84px] lg:min-h-[184px]";

    return (
        <Container
            color="primary"
            className={
                isPengaduan
                    ? "h-[190px] py-14 md:h-[300px] md:py-20 lg:h-[360px]"
                    : icon
                        ? "pt-26 pb-6 md:pt-32 md:pb-12 min-h-[215px] md:min-h-[300px] lg:min-h-[400px] xl:min-h-[450px]"
                        : "pt-26 pb-6 md:pt-32 md:pb-12 min-h-[200px] md:min-h-[300px] lg:min-h-[400px]"
            }
        >
            <div className="absolute inset-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className={isPengaduan ? "object-cover object-center" : "object-cover"}
                    priority
                />
            </div>
            <div
                className={
                    isPengaduan
                        ? "absolute inset-0 bg-gradient-to-r from-secondary/90 from-0% via-secondary/75 via-45% to-secondary/20 to-85%"
                        : "absolute inset-0 bg-gradient-to-r from-primary/90 from-20% to-primary/10 to-80%"
                }
            ></div>
            <div className={kelasIsi}>
                {icon ? (
                    <KontenHeroParalaks>
                        <div className="flex items-center gap-3 md:gap-5">
                            <span
                                aria-hidden="true"
                                className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-white shadow-lg md:size-16 lg:size-[88px] xl:size-[100px] [&>svg]:size-5 md:[&>svg]:size-8 lg:[&>svg]:size-11 xl:[&>svg]:size-[60px]"
                            >
                                {icon}
                            </span>
                            <div className="min-w-0">
                                <h1 className="text-white font-extrabold leading-none tracking-[-0.02em] text-[24px] md:text-[40px] lg:text-[48px] xl:text-[56px] 2xl:text-[60px]">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="mt-1 text-white font-normal tracking-[-0.02em] text-[15px] md:text-[18px] lg:text-[24px] xl:text-[26px] 2xl:text-[30px] md:mt-2">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    </KontenHeroParalaks>
                ) : (
                    <>
                        <h1
                            className={
                                isPengaduan
                                    ? "max-w-[760px] text-[30px] font-black leading-[1] text-white md:text-[64px] lg:text-[76px]"
                                    : "text-white font-bold text-[40px] md:text-[60px] lg:text-[96px] leading-none"
                            }
                        >
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-white font-semibold text-[16px] md:text-[32px] lg:text-[48px]">{subtitle}</p>
                        )}
                    </>
                )}
            </div>
        </Container>
    );
};

export default PageHeader;
