import { Card, CardBody, Skeleton } from '@heroui/react';

type ListSkeletonProps = {
  rows?: number;
};

export function ListSkeleton({ rows = 4 }: ListSkeletonProps) {
  return (
    <Card radius="lg" className="border border-border/40 bg-background/60">
      <CardBody className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/3 rounded-full" />
              <Skeleton className="h-3 w-1/2 rounded-full" />
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
