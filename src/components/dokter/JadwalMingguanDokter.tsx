import type { BarisJadwalMingguan } from "@/lib/konten/dokter";
import { cn } from "@/lib/utils";

type JadwalMingguanDokterProps = {
    jadwal: BarisJadwalMingguan[];
    className?: string;
};

export default function JadwalMingguanDokter({ jadwal, className }: JadwalMingguanDokterProps) {
    return (
        <div className={cn("grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:grid-cols-3 xl:grid-cols-4", className)}>
            {jadwal.map((item) => (
                <div
                    key={item.kodeHari}
                    className="min-h-[86px] overflow-hidden rounded-2xl border border-primary/45 bg-white text-center"
                >
                    <div className="bg-primary px-3 py-2 text-[16px] font-black tracking-[0.28em] text-white">
                        {item.hari}
                    </div>
                    <div
                        className={cn(
                            "flex min-h-[42px] items-center justify-center px-2 text-[15px] font-bold tracking-[0.18em] text-secondary",
                            !item.libur && "tracking-[0.08em]",
                        )}
                    >
                        {item.libur ? "-" : item.jam}
                    </div>
                </div>
            ))}
        </div>
    );
}
