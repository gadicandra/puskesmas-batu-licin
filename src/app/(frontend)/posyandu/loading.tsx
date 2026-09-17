import GridPosyanduSkeleton from "@/components/posyandu/GridPosyanduSkeleton";

export default function Loading() {
    return (
        <div className="bg-latar min-h-screen">
            <div className="h-[200px] w-full bg-primary md:h-[300px] lg:h-[400px]" />
            <GridPosyanduSkeleton />
        </div>
    );
}
