"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CmsImageProps = Omit<ImageProps, "src" | "fill" | "width" | "height"> & {
  src?: string | null;
  // Sizes the box the image fills (height or aspect ratio, rounding).
  wrapperClassName?: string;
};

// A CMS (Payload/R2) image through next/image: resized, modern formats,
// lazy unless `preload` is set. Fills its wrapper, which shows a Skeleton
// until the image has loaded and then fades it in. With no src the
// wrapper just keeps its size as a neutral block.
//
// Give above-the-fold (LCP) images `preload`; they skip the fade so they
// paint as soon as they arrive.
export function CmsImage({
  src,
  alt,
  wrapperClassName,
  className,
  sizes = "100vw",
  preload,
  onLoad,
  ...props
}: CmsImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {(!src || (!loaded && !preload)) && (
        <Skeleton className="absolute inset-0 rounded-[inherit]" />
      )}
      {src && (
        <Image
          {...props}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          // Already in the browser cache: onLoad may have fired before
          // hydration, so check `complete` on mount.
          ref={(img) => {
            if (img?.complete && img.naturalWidth > 0) setLoaded(true);
          }}
          onLoad={(event) => {
            setLoaded(true);
            onLoad?.(event);
          }}
          className={cn(
            "object-cover",
            !preload && "transition-opacity duration-300",
            !preload && !loaded && "opacity-0",
            className,
          )}
        />
      )}
    </div>
  );
}
