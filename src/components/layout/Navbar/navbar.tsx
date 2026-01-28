"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, DoorOpen, ArrowUpRight, BookOpen } from "lucide-react";
import Link from "next/link";
import ImageAction from "@/components/elements/ImageAction";
import Button180 from "@/components/elements/Button180";
import Image from "next/image";
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
} from "@/components/elements/Navbar/navigation-menu";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setActiveAccordion(null); // Reset accordion when closing menu
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleAccordion = (section) => {
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
          `w-full bg-black transition-all duration-300 ${mobileMenuOpen ? "rounded-b-[20px]" : ""}`,
          isScrolled &&
            `mx-0 w-full bg-black/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl md:mx-8 md:rounded-2xl ${mobileMenuOpen ? "bg-black" : ""}`
        )}
      >
        <div
          className={`${mobileMenuOpen ? "overflow-y-clip" : ""} mx-auto flex h-16 w-full items-center justify-between gap-2 rounded-b-[20px] px-6 text-white transition-all md:px-10 ${mobileMenuOpen ? "duration-0" : "duration-300"} ease-in-out`}
        >
          {/* Logo */}
          <Link className="flex w-[48px] items-center" href="/">
            <ImageAction
              src="/img/global/logo180dctrns.png"
              alt="logo 180dc"
              className="transition-transform duration-500 hover:scale-[1.05]"
            />
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
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <motion.div
                            key="about-accordion"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex h-auto w-[390px] flex-row justify-between gap-6"
                          >
                            <div className="relative !aspect-square w-[140px]">
                              <Image
                                src="/180dc.webp"
                                alt="logo 180dc"
                                fill
                                className="absolute aspect-square object-contain"
                              />
                            </div>
                            <div className="flex w-full flex-col gap-2">
                              <ListItem href="/about/us" title="Who We Are">
                                Get to know about 180DC UGM.
                              </ListItem>
                              <ListItem href="/about/services" title="Our Services">
                                Explore how we can help you.
                              </ListItem>
                            </div>
                          </motion.div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                          <Link
                            href="/article/telescope"
                            className={`hover:text-black-300 transition-all duration-300 hover:bg-white ${
                              pathname === "/article/telescope" ? "text-black-300 bg-white" : ""
                            }`}
                          >
                            <p className="text-base">Article</p>
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Store</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <motion.div
                            key="store-accordion"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-[300px]"
                          >
                            <ListItem href="/store/casebook" title="Casebook">
                              Casebook of 180DC UGM.
                            </ListItem>
                            <ListItem href="/store/merch" title="Merch">
                              Explore our merchandise.
                            </ListItem>
                            <ListItem href="/store/frameworkbank" title="Framework Bank">
                              Explore our collection of consulting frameworks.
                            </ListItem>
                          </motion.div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </AnimatePresence>
                </div>
              </NavigationMenu>
              <div className="hidden items-center gap-5 lg:flex">
                <Link href="/oprec">
                  <Button180
                    color="transparent"
                    text="Join Us!"
                    icon={<DoorOpen />}
                    className="border border-green-300 hover:bg-green-300 hover:text-white"
                  />
                </Link>
                <Link href="/apply">
                  <Button180
                    text="Consult Now"
                    icon={<ArrowUpRight />}
                    className="border-0 bg-green-300 text-white hover:bg-green-400"
                  />
                </Link>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X size={36} /> : <Menu size={36} />}
            </div>
          </>
        </div>
        {/* Mobile Menu */}
        <section
          className={cn(
            "bg-black-300 font-avenir-regular relative w-full flex-col gap-5 px-4 py-6 text-left text-lg text-white lg:hidden",
            mobileMenuOpen ? "flex rounded-b-[20px]" : "hidden"
          )}
        >
          <AnimatePresence initial={false}>
            <div>
              {/* About */}
              <div
                key="about-wrapper"
                className="font-avenir-regular relative flex w-full flex-col items-start"
              >
                <div
                  className={`flex w-full cursor-pointer items-center justify-between p-2 ${
                    pathname.startsWith("/about") ? "font-semibold text-green-300" : ""
                  }`}
                  onClick={() => toggleAccordion("about")}
                >
                  <span>About Us</span>
                  <motion.span
                    animate={{ rotate: activeAccordion === "about" ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={24} />
                  </motion.span>
                </div>

                <AnimatePresence>
                  {activeAccordion === "about" && (
                    <motion.div
                      key="about-accordion"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="z-101 ml-3 flex w-fit flex-col gap-3 border-l-1 py-1 pl-3"
                    >
                      <Link href="/about/us" onClick={closeMobileMenu}>
                        <div className="font-avenir-regular flex flex-col items-start text-base hover:text-white">
                          <span className="font-lato-bold">Who We Are</span>
                          <span>Get to know about 180DC UGM.</span>
                        </div>
                      </Link>

                      <Link href="/about/services" onClick={closeMobileMenu}>
                        <div className="font-avenir-regular flex flex-col items-start text-base hover:text-white">
                          <span className="font-lato-bold">Our Services</span>
                          <span>Explore how we can help you.</span>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Article */}
              <div key="article-wrapper">
                <Link href="/article/telescope" onClick={closeMobileMenu}>
                  <div
                    className={`font-avenir-regular w-full p-2 ${
                      pathname === "/article/telescope" ? "font-semibold text-green-300" : ""
                    }`}
                  >
                    Article
                  </div>
                </Link>
              </div>

              {/* Store */}
              <div
                key="store-wrapper"
                className="font-avenir-regular relative flex w-full flex-col items-start"
              >
                <div
                  className={`flex w-full cursor-pointer items-center justify-between p-2 ${
                    pathname.startsWith("/store") ? "font-semibold text-green-300" : ""
                  }`}
                  onClick={() => toggleAccordion("store")}
                >
                  <span>Store</span>
                  <motion.span
                    animate={{ rotate: activeAccordion === "store" ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={24} />
                  </motion.span>
                </div>

                <AnimatePresence>
                  {activeAccordion === "store" && (
                    <motion.div
                      key="store-accordion"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="z-101 ml-3 flex w-fit flex-col gap-3 border-l-1 py-1 pl-3"
                    >
                      <Link href="/store/casebook" onClick={closeMobileMenu}>
                        <div className="font-avenir-regular flex flex-col items-start text-base hover:text-white">
                          <span className="font-lato-bold">Casebook</span>
                          <span>Casebook of 180DC UGM.</span>
                        </div>
                      </Link>
                      <Link href="/store/merch" onClick={closeMobileMenu}>
                        <div className="font-avenir-regular flex flex-col items-start text-base hover:text-white">
                          <span className="font-lato-bold">Merch</span>
                          <span>Explore our merchandise.</span>
                        </div>
                      </Link>
                      <Link href="/store/frameworkbank" onClick={closeMobileMenu}>
                        <div className="font-avenir-regular flex flex-col items-start text-base hover:text-white">
                          <span className="font-lato-bold">Framework Bank</span>
                          <span>Explore our collection of consulting frameworks.</span>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </AnimatePresence>
          <div className="flex w-full flex-col items-center gap-4">
            <Link href="/oprec" className="w-full">
              <Button180
                color="transparent"
                text="Join Us!"
                icon={<DoorOpen />}
                className="w-full border border-green-300"
              />
            </Link>
            <Link href="/apply" className="w-full">
              <Button180
                text="Consult Now"
                icon={<ArrowUpRight />}
                className="w-full border-0 bg-green-300 text-white hover:bg-green-400"
              />
            </Link>
          </div>
        </section>
      </div>
    </nav>
  );
}

function ListItem({ title, children, href, ...props }) {
  return (
    <div
      className="flex items-center justify-start rounded-[10px] p-2 hover:bg-neutral-200"
      {...props}
    >
      <NavigationMenuLink asChild>
        <Link href={href} className="flex flex-col items-start justify-center">
          <div className="font-avenir-regular text-base leading-snug">{title}</div>
          <p className="font-lato-light text-black-300 inline-block w-full text-[14px] leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </div>
  );
}