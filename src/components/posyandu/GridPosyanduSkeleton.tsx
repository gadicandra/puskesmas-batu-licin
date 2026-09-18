import Container from "@/components/layout/Container/Container";

/** Kerangka grid selama data posyandu diambil. Bentuknya sengaja menyerupai
 *  kartu aslinya — teks di kiri, kotak foto di kanan — supaya tata letak tidak
 *  melompat begitu datanya datang. */
export default function GridPosyanduSkeleton({ jumlah = 6 }: { jumlah?: number }) {
    return (
        <Container sectionClassName="bg-white py-10 md:py-16">
            <div
                role="status"
                aria-live="polite"
                aria-busy="true"
                className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8 min-[1800px]:gap-x-[75px]"
            >
                <span className="sr-only">Memuat daftar posyandu</span>
                {Array.from({ length: jumlah }).map((_, i) => (
                    <div key={i} aria-hidden="true" className="@container">
                      <div className="flex gap-3 rounded-[20px] border border-tertiary/50 bg-[#d9d9d9]/20 p-4 @sm:gap-4 @sm:p-5 @lg:gap-5 @lg:rounded-[30px] @lg:px-[27px] @lg:py-[25px]">
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <div className="h-5 w-3/5 animate-pulse rounded bg-tertiary/10" />
                            <div className="h-3 w-2/5 animate-pulse rounded bg-tertiary/10" />
                            <div className="mt-3 h-3 w-4/5 animate-pulse rounded bg-tertiary/10 @lg:mt-5" />
                            <div className="h-3 w-3/5 animate-pulse rounded bg-tertiary/10" />
                            <div className="h-3 w-2/5 animate-pulse rounded bg-tertiary/10" />
                        </div>
                        <div className="w-[80px] min-h-[80px] shrink-0 self-stretch animate-pulse rounded-xl bg-tertiary/10 @xs:w-[100px] @xs:min-h-[98px] @sm:w-[130px] @sm:min-h-[130px] @lg:w-[193px] @lg:min-h-[189px]" />
                      </div>
                    </div>
                ))}
            </div>
        </Container>
    );
}
