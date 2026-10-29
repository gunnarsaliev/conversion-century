import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Loading placeholders for the public site, used by loading.tsx files and
// <Suspense> fallbacks. They follow the real layouts' spacing and image
// sizes so nothing shifts when the content streams in.

export function PageHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto flex max-w-3xl flex-col items-center gap-4", className)}>
      <Skeleton className="h-10 w-3/4 sm:h-12" />
      <Skeleton className="h-5 w-full max-w-xl" />
      <Skeleton className="h-5 w-2/3 max-w-md" />
    </div>
  );
}

// A card: image block on top, then a title and two lines of text.
export function CardSkeleton({ imageClassName }: { imageClassName?: string }) {
  return (
    <div className="rounded-lg bg-card p-3 shadow-md">
      <Skeleton className={cn("h-48 w-full rounded-lg", imageClassName)} />
      <div className="mt-5 space-y-2.5">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({
  count = 6,
  className,
  imageClassName,
}: {
  count?: number;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} imageClassName={imageClassName} />
      ))}
    </div>
  );
}

// Mirrors Blog28: one large featured card spanning two columns and rows,
// then regular cards.
export function BlogGridSkeleton() {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="md:row-span-2 lg:col-span-2">
        <CardSkeleton imageClassName="md:h-80 lg:h-96" />
      </div>
      {Array.from({ length: 4 }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// A listing page: heading, intro and a card grid.
export function ListingPageSkeleton({ imageClassName }: { imageClassName?: string }) {
  return (
    <div className="py-16 md:py-24" aria-busy="true">
      <PageHeaderSkeleton />
      <CardGridSkeleton className="mt-16" imageClassName={imageClassName} />
    </div>
  );
}

// A detail page: title, meta line, hero image and paragraphs.
export function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-3xl py-16 md:py-24" aria-busy="true">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-6 h-10 w-full" />
      <Skeleton className="mt-3 h-10 w-2/3" />
      <div className="mt-6 flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="mt-10 aspect-video w-full rounded-lg" />
      <div className="mt-10 space-y-3">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className={cn("h-4", i % 4 === 3 ? "w-2/3" : "w-full")} />
        ))}
      </div>
    </div>
  );
}

// The dashboard shell: sidebar plus a page header and a content block.
export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen w-full" aria-busy="true">
      <div className="hidden w-64 shrink-0 flex-col gap-3 border-r p-4 md:flex">
        <Skeleton className="h-8 w-32" />
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
      <DashboardPageSkeleton />
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-6" aria-busy="true">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  );
}
