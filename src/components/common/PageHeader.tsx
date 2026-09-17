import Container from "@/components/layout/Container/Container";
import Image from "next/image";
import React from "react";

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

    return (
        <Container
            color="primary"
            className={
                isPengaduan
                    ? "h-[190px] py-14 md:h-[300px] md:py-20 lg:h-[360px]"
                    : icon
                        ? "py-16 md:py-22 h-[215px] md:h-[300px] lg:h-[400px] xl:h-[450px]"
                        : "py-16 md:py-22 h-[200px] md:h-[300px] lg:h-[400px]"
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
            <div className={isPengaduan ? "relative z-30 flex h-full flex-col justify-center pt-10" : "relative z-30 flex flex-col h-full justify-center mt-10"}>
                {icon ? (
                    <div className="flex items-center gap-3 md:gap-5">
                        <span
                            aria-hidden="true"
                            className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-white shadow-lg md:size-16 lg:size-[88px] xl:size-[100px] [&>svg]:size-5 md:[&>svg]:size-8 lg:[&>svg]:size-11 xl:[&>svg]:size-[60px]"
                        >
                            {icon}
                        </span>
                        <div className="min-w-0">
                            <p className="text-white font-extrabold leading-none tracking-[-0.02em] text-[24px] md:text-[40px] lg:text-[48px] xl:text-[56px] 2xl:text-[60px]">
                                {title}
                            </p>
                            {subtitle && (
                                <p className="mt-1 text-white font-normal tracking-[-0.02em] text-[15px] md:text-[18px] lg:text-[24px] xl:text-[26px] 2xl:text-[30px] md:mt-2">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <p
                            className={
                                isPengaduan
                                    ? "max-w-[760px] text-[30px] font-black leading-[1] text-white md:text-[64px] lg:text-[76px]"
                                    : "text-white font-bold text-[40px] md:text-[60px] lg:text-[96px] leading-none"
                            }
                        >
                            {title}
                        </p>
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
