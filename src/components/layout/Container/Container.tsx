import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps {
    children?: React.ReactNode;
    className?: string;
    color?: "base" | "primary" | "secondary";
}

const Container = ({ children, className, color }: ContainerProps) => {
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
            className={cn(`relative mx-auto flex w-full flex-col gap-4 px-[20px] md:px-[60px] py-10`, bgColor)}
        >
            <div className={cn("mx-auto h-full w-full max-w-[2160px]", className)}>{children}</div>
        </section>
    );
};

export default Container;
