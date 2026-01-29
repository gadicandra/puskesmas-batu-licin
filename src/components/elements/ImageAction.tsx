"use client";

import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

interface ImageActionProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
}

export default function ImageAction({
    src,
    alt,
    className,
    width = 48,
    height = 48,
}: ImageActionProps) {
    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn("object-contain", className)}
        />
    );
}
