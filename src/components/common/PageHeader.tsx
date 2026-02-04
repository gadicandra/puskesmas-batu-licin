import Container from "@/components/layout/Container/Container";
import Image from "next/image";
import React from "react";

interface PageHeaderProps {
    image: string;
    title: string;
    subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ image, title, subtitle }) => {
    return (
        <Container color="primary" className="py-16 md:py-22 h-[400px]">
            <div className="absolute inset-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 from-20% to-primary/10 to-80%"></div>
            <div className="relative z-30 flex flex-col h-full justify-center mt-10">
                <p className="text-white font-bold text-[64px] md:text-[96px] leading-none">{title}</p>
                {subtitle && (
                    <p className="text-white font-semibold text-[32px] md:text-[48px]">{subtitle}</p>
                )}
            </div>
        </Container>
    );
};

export default PageHeader;
