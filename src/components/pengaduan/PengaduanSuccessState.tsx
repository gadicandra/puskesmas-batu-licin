"use client";

import { CheckCircle2 } from "lucide-react";

interface PengaduanSuccessStateProps {
  title: string;
  description: string;
  onReset: () => void;
}

export default function PengaduanSuccessState({
  title,
  description,
  onReset,
}: PengaduanSuccessStateProps) {
  return (
    <div
      className="flex min-h-[360px] flex-col items-center justify-center rounded-[20px] bg-base/95 px-6 py-10 text-center text-pengaduan-dark"
      aria-live="polite"
    >
      <CheckCircle2 className="h-14 w-14 text-pengaduan-accent" aria-hidden="true" />
      <h2 className="mt-5 text-2xl font-black">{title}</h2>
      <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-pengaduan-dark/75">
        {description}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-pengaduan-dark px-6 text-sm font-black text-white transition hover:bg-pengaduan-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pengaduan-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
      >
        Kirim lagi
      </button>
    </div>
  );
}
