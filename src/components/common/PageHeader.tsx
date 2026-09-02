import Container from "@/components/layout/Container/Container";
import Image from "next/image";
import React from "react";

interface PageHeaderProps {
    image: string;
    title: string;
    subtitle?: string;
    variant?: "default" | "pengaduan";
}

const PageHeader: React.FC<PageHeaderProps> = ({ image, title, subtitle, variant = "default" }) => {
    const isPengaduan = variant === "pengaduan";

    return (
        <Container
            color="primary"
            className={
                isPengaduan
                    ? "h-[190px] py-14 md:h-[300px] md:py-20 lg:h-[360px]"
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
            </div>
        </Container>
    );
};

export default PageHeader;
