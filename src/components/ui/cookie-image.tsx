"use client";

import { Cookie } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type CookieImageProps = {
  src?: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

/**
 * Cropped, lazy-loaded image with a skeleton while loading.
 * If there is no photo (or it fails to load) a pink-and-cream placeholder is
 * shown instead, never a broken image.
 */
export function CookieImage({ src, alt, sizes, className, imgClassName, priority }: CookieImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !src || failedSrc === src;

  return (
    <div className={cn("relative overflow-hidden bg-blush", !failed && "animate-pulse", className)}>
      {failed ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 grid place-items-center bg-gradient-to-br from-blush via-cream to-butter"
        >
          <Cookie className="h-1/4 w-1/4 min-h-8 min-w-8 text-rose/70" aria-hidden />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailedSrc(src)}
          className={cn("object-cover", imgClassName)}
        />
      )}
    </div>
  );
}
