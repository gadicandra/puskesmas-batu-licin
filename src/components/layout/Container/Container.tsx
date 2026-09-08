import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps {
    children?: React.ReactNode;
    className?: string;
    sectionClassName?: string;
    color?: "base" | "primary" | "secondary";
    fullWidth?: boolean;
}

const Container = ({ children, className, sectionClassName, color, fullWidth = false }: ContainerProps) => {
    const bgColor =
        color === "base"
            ? "bg-latar"
            : color === "primary"
                ? "bg-primary"
                : color === "secondary"
                    ? "bg-secondary"
                    : "";

    return (
        <section
            className={cn(`relative flex w-full flex-col`, bgColor, sectionClassName)}
        >
            <div className={cn(
                fullWidth
                    ? "w-full"
                    : "mx-auto h-full w-full max-w-[2160px] px-[20px] md:px-[60px] py-10 md:py-0 flex flex-col gap-4",
                className
            )}>{children}</div>
        </section>
    );
};

export default Container;
