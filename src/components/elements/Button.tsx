"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Button180Props {
    text: string;
    icon?: React.ReactNode;
    leftIcon?: React.ReactNode;
    color?: "transparent" | "primary" | "secondary";
    className?: string;
    onClick?: () => void;
}

export default function Button({
    text,
    icon,
    leftIcon,
    color = "primary",
    className,
    onClick,
}: Button180Props) {
    const baseStyles =
        "flex items-center justify-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer";

    const colorStyles = {
        transparent: "bg-transparent hover:bg-white/10",
        primary: "bg-green-500 text-white hover:bg-green-600",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
    };

    return (
        <button
            className={cn(baseStyles, colorStyles[color], className)}
            onClick={onClick}
        >
            {leftIcon && <span>{leftIcon}</span>}
            {text}
            {icon && <span>{icon}</span>}
        </button>
    );
}
