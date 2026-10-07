"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useCart } from "@/store/cart";

export function Providers({ children }: { children: ReactNode }) {
  // Read the saved cart from localStorage after mount (avoids hydration mismatches).
  useEffect(() => {
    void Promise.resolve(useCart.persist.rehydrate()).finally(() =>
      useCart.setState({ hydrated: true }),
    );
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {children}
      <Toaster />
    </MotionConfig>
  );
}
