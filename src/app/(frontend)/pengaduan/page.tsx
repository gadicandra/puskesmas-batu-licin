import Breadcrumb from "@/components/common/Breadcrumb";
import PageHeader from "@/components/common/PageHeader";
import PengaduanTabs from "@/components/pengaduan/PengaduanTabs";
import type { PengaduanTab } from "@/components/pengaduan/types";
import { Suspense } from "react";

interface PengaduanPageProps {
  searchParams?: Promise<{
    tab?: string | string[];
  }>;
}

export default async function PengaduanPage({ searchParams }: PengaduanPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialTab = normalizeTabParam(resolvedSearchParams?.tab);

  return (
    <div className="min-h-screen bg-base">
      <PageHeader
        image="/PengaduandanFeedback.webp"
        title="Pengaduan dan Feedback"
        variant="pengaduan"
      />
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Pengaduan dan Feedback", href: "/pengaduan" },
        ]}
      />
      <Suspense fallback={<PengaduanTabsFallback />}>
        <PengaduanTabs initialTab={initialTab} />
      </Suspense>
    </div>
  );
}

function PengaduanTabsFallback() {
  return (
    <section className="bg-white px-5 pb-20 pt-8 md:px-[60px] md:pb-28 md:pt-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="h-20 animate-pulse rounded-[24px] bg-pengaduan-dark/30" />
        <div className="h-[420px] animate-pulse rounded-[24px] bg-pengaduan-neutral" />
      </div>
    </section>
  );
}

function normalizeTabParam(value: string | string[] | undefined): PengaduanTab {
  const tab = Array.isArray(value) ? value[0] : value;

  if (tab === "pengaduan" || tab === "kritik" || tab === "alur") {
    return tab;
  }

  return "alur";
}
