"use client";

import { useEffect, useState } from "react";

/** Returns the id of the section currently in view (for nav highlighting). */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const sectionIds = key.split("|");
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        // Prefer the earliest section in page order that is currently visible.
        const current = sectionIds.find((id) => visible.has(id)) ?? null;
        setActive(current);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.1, 0.5] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
