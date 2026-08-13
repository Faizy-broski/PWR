import { Skeleton } from "@/components/ui/skeleton";

export default function CompetitionsLoading() {
  return (
    <div className="bg-[#0D0C0C] -mt-18 px-4 pt-32 pb-16 sm:-mt-20 sm:pt-36 lg:-mt-24 lg:pt-40">
      <div className="container">
        <Skeleton className="mx-auto h-10 w-64 bg-white/10" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
