import { Skeleton } from "@/components/ui/skeleton";

export default function UnitsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <Skeleton className="h-12 rounded-xl w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
      </div>
    </div>
  );
}
