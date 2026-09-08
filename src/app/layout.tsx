import type { Metadata, Viewport } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Puskesmas Batu Licin",
    description: "Website Puskesmas Batu Licin",
};

// Situs hanya punya tema terang; ini mencegah browser dengan auto-dark-mode
// menerapkan inversi warnanya sendiri.
export const viewport: Viewport = {
    colorScheme: "only light",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" suppressHydrationWarning>
            <body className="antialiased bg-white">{children}</body>
        </html>
    );
}
