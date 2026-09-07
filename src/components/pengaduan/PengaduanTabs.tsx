"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import AlurPengaduanPanel from "./AlurPengaduanPanel";
import FormPengaduanPanel from "./FormPengaduanPanel";
import KritikSaranPanel from "./KritikSaranPanel";
import type { PengaduanTab } from "./types";

const tabs: Array<{ value: PengaduanTab; label: string }> = [
  { value: "alur", label: "Alur Pengaduan Masyarakat" },
  { value: "pengaduan", label: "Form Pengaduan" },
  { value: "kritik", label: "Kritik & Saran" },
];

interface PengaduanTabsProps {
  initialTab?: PengaduanTab;
}

export default function PengaduanTabs({ initialTab = "alur" }: PengaduanTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlTab = normalizeTab(searchParams.get("tab"));
  const [activeTab, setActiveTab] = useState<PengaduanTab>(initialTab);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    setActiveTab(urlTab);
  }, [urlTab]);

  const selectedIndex = useMemo(
    () => tabs.findIndex((tab) => tab.value === activeTab),
    [activeTab],
  );

  const selectTab = (tab: PengaduanTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());

    if (tab === "alur") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <section className="bg-white px-4 pb-20 pt-4 md:px-[60px] md:pb-28 md:pt-12">
      <div className="mx-auto flex w-full max-w-[2160px] flex-col items-center gap-8 md:gap-16">
        <div
          role="tablist"
          aria-label="Pilihan pengaduan dan feedback"
          className="w-full max-w-[300px] rounded-[14px] bg-pengaduan-dark p-1 sm:max-w-5xl sm:rounded-[28px] sm:p-3"
        >
          <div className="grid w-full grid-cols-3 gap-1 sm:gap-3">
            {tabs.map((tab, index) => {
              const isActive = tab.value === activeTab;

              return (
                <button
                  key={tab.value}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={`pengaduan-tab-${tab.value}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`pengaduan-panel-${tab.value}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectTab(tab.value)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                      event.preventDefault();
                      const direction = event.key === "ArrowRight" ? 1 : -1;
                      const nextIndex = (index + direction + tabs.length) % tabs.length;
                      selectTab(tabs[nextIndex].value);
                      tabRefs.current[nextIndex]?.focus();
                    }
                  }}
                  className={`flex min-h-11 items-center justify-center rounded-[11px] px-1 text-center text-xs font-black leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-pengaduan-dark sm:min-h-16 sm:rounded-[20px] sm:px-4 sm:text-xl ${
                    isActive
                      ? "bg-pengaduan-lime text-pengaduan-dark"
                      : "bg-pengaduan-pill text-white hover:bg-pengaduan-pill/80"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id={`pengaduan-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`pengaduan-tab-${activeTab}`}
          className="w-full"
          key={activeTab}
        >
          {activeTab === "alur" && <AlurPengaduanPanel />}
          {activeTab === "pengaduan" && (
            <FormPengaduanPanel
              endpoint="/api/pengaduan"
              idPrefix="form-pengaduan"
              successTitle="Pengaduan terkirim"
              successDescription="Terima kasih. Pengaduan Anda sudah diterima dan akan ditindaklanjuti oleh petugas Puskesmas Batulicin."
            />
          )}
          {activeTab === "kritik" && <KritikSaranPanel />}
        </div>

        <p className="sr-only" aria-live="polite">
          Tab aktif: {tabs[Math.max(selectedIndex, 0)].label}
        </p>
      </div>
    </section>
  );
}

function normalizeTab(value: string | null): PengaduanTab {
  if (value === "pengaduan" || value === "kritik" || value === "alur") {
    return value;
  }

  return "alur";
}
