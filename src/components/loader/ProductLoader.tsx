import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoader() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-full h-[10px]" />
        <Skeleton className="w-[140px] h-[10px]" />
        <Skeleton className="w-[200px] h-[10px]" />
      </div>
    </>
  );
}
