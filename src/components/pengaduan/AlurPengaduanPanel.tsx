"use client";

import { AlertCircle, Inbox } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AlurStepItem from "./AlurStepItem";
import type { AlurPengaduanStep } from "./types";

interface AlurPengaduanResponse {
  docs?: Array<{
    id: string | number;
    order: number;
    title: string;
    description: string;
    details?: Array<{ text?: string | null }> | null;
  }>;
}

type LoadState = "loading" | "success" | "error";

export default function AlurPengaduanPanel() {
  const [steps, setSteps] = useState<AlurPengaduanStep[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  const loadSteps = useCallback(async (signal?: AbortSignal) => {
    setLoadState("loading");

    try {
      const params = new URLSearchParams({
        "where[active][equals]": "true",
        sort: "order",
        limit: "100",
      });
      const response = await fetch(`/api/alur-pengaduan-steps?${params}`, {
        signal,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Alur pengaduan belum dapat dimuat.");
      }

      const result = (await response.json()) as AlurPengaduanResponse;
      const normalizedSteps = (result.docs ?? []).map((step) => ({
        id: step.id,
        order: step.order,
        title: step.title,
        description: step.description,
        details: step.details
          ?.map((detail) => detail.text?.trim())
          .filter((detail): detail is string => Boolean(detail)),
      }));

      setSteps(normalizedSteps);
      setLoadState("success");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadSteps(controller.signal);

    return () => controller.abort();
  }, [loadSteps]);

  return (
    <section
      aria-labelledby="alur-pengaduan-heading"
      aria-busy={loadState === "loading"}
      className="mx-auto w-full max-w-5xl rounded-[24px] bg-pengaduan-neutral px-6 py-8 sm:rounded-[28px] sm:px-10 sm:py-12 lg:px-14"
    >
      <h2 id="alur-pengaduan-heading" className="sr-only">
        Alur Pengaduan Masyarakat
      </h2>

      {loadState === "loading" && <AlurLoadingState />}

      {loadState === "error" && (
        <div className="flex min-h-72 flex-col items-center justify-center text-center text-pengaduan-dark">
          <AlertCircle className="h-10 w-10 text-pengaduan-accent" aria-hidden="true" />
          <h3 className="mt-4 text-xl font-black">Alur belum dapat dimuat</h3>
          <p className="mt-2 max-w-md text-sm font-medium leading-relaxed">
            Periksa koneksi internet, lalu coba muat kembali.
          </p>
          <button
            type="button"
            onClick={() => void loadSteps()}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-pengaduan-dark px-6 text-sm font-black text-white transition-colors hover:bg-pengaduan-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pengaduan-accent focus-visible:ring-offset-2 focus-visible:ring-offset-pengaduan-neutral"
          >
            Coba lagi
          </button>
        </div>
      )}

      {loadState === "success" && steps.length === 0 && (
        <div className="flex min-h-72 flex-col items-center justify-center text-center text-pengaduan-dark">
          <Inbox className="h-10 w-10 text-pengaduan-accent" aria-hidden="true" />
          <h3 className="mt-4 text-xl font-black">Alur belum tersedia</h3>
          <p className="mt-2 max-w-md text-sm font-medium leading-relaxed">
            Petugas sedang menyiapkan informasi alur pengaduan. Silakan pilih tab Form Pengaduan untuk mengirim pesan.
          </p>
        </div>
      )}

      {loadState === "success" && steps.length > 0 && (
        <ol className="space-y-6 sm:space-y-8">
          {steps.map((step, index) => (
            <AlurStepItem
              key={step.id ?? `${step.order}-${step.title}`}
              {...step}
              isLast={index === steps.length - 1}
            />
          ))}
        </ol>
      )}
    </section>
  );
}

function AlurLoadingState() {
  return (
    <div className="space-y-6" aria-label="Memuat alur pengaduan">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="grid grid-cols-[3.5rem_1fr] gap-4 sm:grid-cols-[5rem_1fr]">
          <div className="h-12 w-12 rounded-full bg-pengaduan-dark/20 motion-safe:animate-pulse sm:h-16 sm:w-16" />
          <div className="space-y-3 py-1">
            <div className="h-5 w-2/3 rounded bg-pengaduan-dark/20 motion-safe:animate-pulse" />
            <div className="h-4 w-full rounded bg-pengaduan-dark/15 motion-safe:animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
