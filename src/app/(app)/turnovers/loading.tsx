import { Skeleton } from "@/components/ui/skeleton";

export default function TurnoversLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="flex gap-1 border-b border-border pb-0">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-none" />)}
      </div>
      <Skeleton className="h-80 rounded-xl w-full" />
    </div>
  );
}
