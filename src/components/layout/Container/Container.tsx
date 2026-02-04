import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps {
    children?: React.ReactNode;
    className?: string;
    sectionClassName?: string;
    color?: "base" | "primary" | "secondary";
}

const Container = ({ children, className, sectionClassName, color }: ContainerProps) => {
    const bgColor =
        color === "base"
            ? "bg-base"
            : color === "primary"
                ? "bg-primary"
                : color === "secondary"
                    ? "bg-secondary"
                    : "";

    return (
        <section
            className={cn(`relative mx-auto flex w-full flex-col gap-4 px-[20px] md:px-[60px] py-10 md:py-0`, bgColor, sectionClassName)}
        >
            <div className={cn("mx-auto h-full w-full max-w-[2160px]", className)}>{children}</div>
        </section>
    );
};

export default Container;
