"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { useToasts } from "@/store/toast";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function Toaster() {
  const toasts = useToasts((state) => state.toasts);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4 sm:bottom-6"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((item) => {
          const Icon = icons[item.variant];
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-full border border-petal/60 bg-card px-5 py-3 shadow-lift"
            >
              <Icon
                className={item.variant === "error" ? "h-5 w-5 text-berry" : "h-5 w-5 text-berry"}
                aria-hidden
              />
              <div className="text-sm">
                <p className="font-bold text-cocoa">{item.title}</p>
                {item.description ? <p className="text-mocha">{item.description}</p> : null}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
