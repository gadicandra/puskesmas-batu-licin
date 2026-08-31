/** Grafik batang sederhana berbasis div — tanpa library chart.
 *  Sengaja ringan: dashboard ini dibuka dari ponsel di lapangan. */
export type Bar = { label: string; count: number }

export default function BarChart({ data, tinggi = 120 }: { data: Bar[]; tinggi?: number }) {
    const maks = Math.max(1, ...data.map((d) => d.count))

    return (
        <div className="flex items-end gap-2 overflow-x-auto" style={{ minHeight: tinggi + 44 }}>
            {data.map((b, i) => (
                <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                    <span className="text-[11px] font-bold text-primary">{b.count}</span>
                    <div
                        className="flex w-full items-end overflow-hidden rounded-md bg-base"
                        style={{ height: tinggi }}
                    >
                        <div
                            className="w-full rounded-t-md bg-secondary transition-all"
                            style={{
                                height: `${Math.round((b.count / maks) * tinggi)}px`,
                                minHeight: b.count > 0 ? 3 : 0,
                            }}
                        />
                    </div>
                    <span className="truncate text-[10.5px] text-tertiary" title={b.label}>
                        {b.label}
                    </span>
                </div>
            ))}
        </div>
    )
}
