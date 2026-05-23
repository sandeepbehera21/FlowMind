import { Card } from "./Card";
import { Skeleton } from "./Skeleton";

export function RouteSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-8 w-3/5" />
        <Skeleton className="mt-4 h-4 w-4/5" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-[540px]" />
        <Skeleton className="h-[540px]" />
        <Skeleton className="h-[540px]" />
      </div>
    </div>
  );
}