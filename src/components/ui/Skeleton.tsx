import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-zinc-800/60', className)}
      {...props}
    />
  );
}

export function RoomCardSkeleton() {
  return (
    <div className="rounded-2xl bg-[#0f0f18] border border-zinc-800/80 overflow-hidden">
      <Skeleton className="w-full aspect-video rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="w-2/3 h-4" />
            <Skeleton className="w-1/3 h-3" />
          </div>
        </div>
        <Skeleton className="w-full h-4" />
        <div className="flex gap-2">
          <Skeleton className="w-16 h-5 rounded-full" />
          <Skeleton className="w-20 h-5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
