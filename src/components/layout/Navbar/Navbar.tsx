"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, DoorOpen, ArrowUpRight, BookOpen } from "lucide-react";
import { AiOutlineAlert } from "react-icons/ai";
import Link from "next/link";
import ImageAction from "@/components/elements/ImageAction";
import Button from "@/components/elements/Button";
import { cn } from "@/lib/utils";
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from "motion/react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setActiveAccordion(null); // Reset accordion when closing menu
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  useEffect(() => {
    // Hanya tutup mobile menu saat scroll di desktop (lg breakpoint ke atas)
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setMobileMenuOpen(false);
      }
    };

    // Tutup mobile menu saat scroll hanya di desktop
    if (window.innerWidth >= 1024) {
      setMobileMenuOpen(false);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 flex w-full items-center justify-center transition-all duration-300",
        isScrolled && "md:top-6"
      )}
    >
      <div
        className={cn(
          `w-full bg-[#243117] transition-all duration-300 ${mobileMenuOpen ? "rounded-b-[20px]" : ""}`,
          isScrolled &&
          `mx-0 w-full bg-[#243117]/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)] md:backdrop-blur-xl md:mx-8 md:rounded-2xl ${mobileMenuOpen ? "bg-[#243117]" : ""}`
        )}
      >
        <div
          className={`${mobileMenuOpen ? "overflow-y-clip" : ""} mx-auto flex h-16 w-full items-center justify-between gap-2 rounded-b-[20px] px-6 text-base transition-all md:px-10 ${mobileMenuOpen ? "duration-0" : "duration-300"} ease-in-out`}
        >
          {/* Logo */}
          <Link className="flex flex-row items-center gap-2" href="/">
            <ImageAction
              src="/logo_puskesmas.webp"
              alt="Logo Puskesmas Batulicin"
              className="w-[36px]transition-transform duration-500 hover:scale-[1.05]"
            />
            <div className="flex flex-col">
              <p className="font-avenir text-[20px] font-black text-white leading-none"> UPTD Puskesmas</p>
              <p className="font-avenir text-[20px] font-black text-white leading-none">Batulicin</p>
            </div>
          </Link>
          <>
            {/* Navigation Menu */}
            <div className="font-avenir-regular hidden flex-row lg:flex">
              <NavigationMenu
                //viewport harus selalu false untuk menghindari error
                viewport={false}
              >
                <div className="mr-6 hidden lg:block">
                  <AnimatePresence>
                    <NavigationMenuList className="gap-1">
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Profil</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <motion.div
                            key="about-accordion"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex h-auto w- flex-col"
                          >
                            <div className="flex w-full flex-col">
                              <ListItem href="/about/us" title="Profil Puskesmas" />
                              <ListItem href="/about/services" title="Struktur Organisasi" />
                              <ListItem href="/about/services" title="Lokasi Puskesmas" />
                            </div>
                          </motion.div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                          <Link
                            href="/article/telescope"
                            className={`cursor-pointer hover:text-white transition-all duration-300 ease-out hover:bg-white/20 hover:scale-105 hover:shadow-md active:scale-95 ${pathname === "/article/telescope" ? "text-white bg-white/20 scale-105" : ""
                              }`}
                          >
                            <p className="text-base">Layanan</p>
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                          <Link
                            href="/article/telescope"
                            className={`cursor-pointer hover:text-white transition-all duration-300 ease-out hover:bg-white/20 hover:scale-105 hover:shadow-md active:scale-95 ${pathname === "/article/telescope" ? "text-white bg-white/20 scale-105" : ""
                              }`}
                          >
                            <p className="text-base">Fasilitas</p>
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                          <Link
                            href="/article/telescope"
                            className={`cursor-pointer hover:text-white transition-all duration-300 ease-out hover:bg-white/20 hover:scale-105 hover:shadow-md active:scale-95 ${pathname === "/article/telescope" ? "text-white bg-white/20 scale-105" : ""
                              }`}
                          >
                            <p className="text-base">Dokter</p>
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                          <Link
                            href="/article/telescope"
                            className={`cursor-pointer hover:text-white transition-all duration-300 ease-out hover:bg-white/20 hover:scale-105 hover:shadow-md active:scale-95 ${pathname === "/article/telescope" ? "text-white bg-white/20 scale-105" : ""
                              }`}
                          >
                            <p className="text-base">Artikel</p>
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                          <Link
                            href="/article/telescope"
                            className={`cursor-pointer hover:text-white transition-all duration-300 ease-out hover:bg-white/20 hover:scale-105 hover:shadow-md active:scale-95 ${pathname === "/article/telescope" ? "text-white bg-white/20 scale-105" : ""
                              }`}
                          >
                            <p className="text-base">Pengaduan</p>
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </AnimatePresence>
                </div>
              </NavigationMenu>
              <div className="hidden items-center gap-5 lg:flex">
                <Link href="/apply">
                  <Button
                    text="Emergency Call"
                    leftIcon={<AiOutlineAlert size={18} />}
                    className="cursor-pointer border-0 bg-secondary text-white hover:bg-secondary/80 hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-300 ease-out"
                  />
                </Link>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-3 lg:hidden">
              {/* Emergency Call - Icon only on mobile */}
              <Link href="/emergency" className="flex items-center justify-center rounded-full bg-secondary p-2 text-white transition-all duration-300 hover:bg-secondary/80 hover:scale-105 active:scale-95">
                <AiOutlineAlert size={24} />
              </Link>
              <div
                onClick={toggleMobileMenu}
                className={cn(
                  "cursor-pointer p-2 rounded-lg transition-all duration-300",
                  mobileMenuOpen ? "bg-primary" : "bg-transparent"
                )}
              >
                {mobileMenuOpen ? <X size={36} /> : <Menu size={36} />}
              </div>
            </div>
          </>
        </div>
        {/* Mobile Menu */}
        <section
          className={cn(
            "bg-primary font-avenir-regular relative w-full flex-col gap-5 px-4 py-6 text-left text-lg text-base lg:hidden",
            mobileMenuOpen ? "flex rounded-b-[20px] shadow-lg" : "hidden"
          )}
        >
          <AnimatePresence initial={false}>
            <div>
              {/* Profil - Accordion */}
              <div
                key="profil-wrapper"
                className="font-avenir-regular relative flex w-full flex-col items-start"
              >
                <div
                  className={`flex w-full cursor-pointer items-center justify-between p-2 ${pathname.startsWith("/about") ? "font-semibold text-secondary" : ""
                    }`}
                  onClick={() => toggleAccordion("profil")}
                >
                  <span>Profil</span>
                  <motion.span
                    animate={{ rotate: activeAccordion === "profil" ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={24} />
                  </motion.span>
                </div>

                <AnimatePresence>
                  {activeAccordion === "profil" && (
                    <motion.div
                      key="profil-accordion"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="z-101 ml-3 flex w-fit flex-col gap-3 border-l border-white/20 py-1 pl-3"
                    >
                      <Link href="/about/us" onClick={closeMobileMenu}>
                        <div className="font-avenir-regular flex flex-col items-start text-base hover:text-secondary transition-colors">
                          <span className="font-avenir font-medium">Profil Puskesmas</span>
                        </div>
                      </Link>
                      <Link href="/about/struktur" onClick={closeMobileMenu}>
                        <div className="font-avenir-regular flex flex-col items-start text-base hover:text-secondary transition-colors">
                          <span className="font-avenir font-medium">Struktur Organisasi</span>
                        </div>
                      </Link>
                      <Link href="/about/lokasi" onClick={closeMobileMenu}>
                        <div className="font-avenir-regular flex flex-col items-start text-base hover:text-secondary transition-colors">
                          <span className="font-avenir font-medium">Lokasi Puskesmas</span>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Layanan */}
              <div key="layanan-wrapper">
                <Link href="/layanan" onClick={closeMobileMenu}>
                  <div
                    className={`font-avenir-regular w-full p-2 hover:text-secondary transition-colors ${pathname === "/layanan" ? "font-semibold text-secondary" : ""
                      }`}
                  >
                    Layanan
                  </div>
                </Link>
              </div>

              {/* Fasilitas */}
              <div key="fasilitas-wrapper">
                <Link href="/fasilitas" onClick={closeMobileMenu}>
                  <div
                    className={`font-avenir-regular w-full p-2 hover:text-secondary transition-colors ${pathname === "/fasilitas" ? "font-semibold text-secondary" : ""
                      }`}
                  >
                    Fasilitas
                  </div>
                </Link>
              </div>

              {/* Dokter */}
              <div key="dokter-wrapper">
                <Link href="/dokter" onClick={closeMobileMenu}>
                  <div
                    className={`font-avenir-regular w-full p-2 hover:text-secondary transition-colors ${pathname === "/dokter" ? "font-semibold text-secondary" : ""
                      }`}
                  >
                    Dokter
                  </div>
                </Link>
              </div>

              {/* Artikel */}
              <div key="artikel-wrapper">
                <Link href="/artikel" onClick={closeMobileMenu}>
                  <div
                    className={`font-avenir-regular w-full p-2 hover:text-secondary transition-colors ${pathname === "/artikel" ? "font-semibold text-secondary" : ""
                      }`}
                  >
                    Artikel
                  </div>
                </Link>
              </div>

              {/* Pengaduan */}
              <div key="pengaduan-wrapper">
                <Link href="/pengaduan" onClick={closeMobileMenu}>
                  <div
                    className={`font-avenir-regular w-full p-2 hover:text-secondary transition-colors ${pathname === "/pengaduan" ? "font-semibold text-secondary" : ""
                      }`}
                  >
                    Pengaduan
                  </div>
                </Link>
              </div>
            </div>
          </AnimatePresence>
          {/* Emergency Call Button in Mobile Menu */}
          <div className="flex w-full flex-col items-center gap-4 pt-4 border-t border-white/20">
            <Link href="/emergency" className="w-full">
              <Button
                text="Emergency Call"
                leftIcon={<AiOutlineAlert size={20} />}
                className="w-full border-0 bg-secondary text-white hover:bg-secondary/80"
              />
            </Link>
          </div>
        </section>
      </div>
    </nav >
  );
}

interface ListItemProps {
  title: string;
  children?: React.ReactNode;
  href: string;
}

function ListItem({ title, children, href, ...props }: ListItemProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="flex items-center justify-start rounded-[10px] p-2 hover:bg-white/20"
      {...props}
    >
      <NavigationMenuLink asChild>
        <Link href={href} className="flex flex-col items-start justify-center">
          <div className="font-avenir-regular text-base text-white leading-snug whitespace-nowrap">{title}</div>
          {children && (
            <p className="font-avenir font-regular text-white/70 inline-block w-full text-[14px] leading-snug">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </div>
  );
}