import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Puskesmas Batu Licin",
    description: "Website Puskesmas Batu Licin",
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
