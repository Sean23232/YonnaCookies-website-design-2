"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** dialog = centered (bottom sheet on phones), drawer = right side, fullscreen = mobile menu */
  variant?: "dialog" | "drawer" | "fullscreen";
  size?: "md" | "lg";
  hideHeader?: boolean;
  children: ReactNode;
  footer?: ReactNode;
};

const spring = { type: "spring", stiffness: 380, damping: 36 } as const;

/**
 * Accessible modal built on Radix Dialog (focus trap, Esc to close, scroll lock,
 * aria attributes) with Framer Motion animations.
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  variant = "dialog",
  size = "md",
  hideHeader,
  children,
  footer,
}: ModalProps) {
  // Radix warns when a dialog has no description; opt out explicitly in that case.
  const noDescription = description ? {} : { "aria-describedby": undefined };

  const header = (
    <div className={cn("flex items-start justify-between gap-4 px-5 pb-3 pt-5 sm:px-7", hideHeader && "sr-only")}>
      <div>
        <Dialog.Title className="font-heading text-2xl font-bold text-cocoa">{title}</Dialog.Title>
        {description ? (
          <Dialog.Description className="mt-1 text-sm text-mocha">{description}</Dialog.Description>
        ) : null}
      </div>
      <Dialog.Close
        aria-label="Close"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blush text-cocoa transition hover:bg-petal/60"
      >
        <X className="h-5 w-5" aria-hidden />
      </Dialog.Close>
    </div>
  );

  const body = (
    <>
      {header}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 sm:px-7">{children}</div>
      {footer ? (
        <div className="border-t border-petal/40 bg-card px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7">
          {footer}
        </div>
      ) : null}
    </>
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-cocoa/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>

            {variant === "dialog" ? (
              <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
                <Dialog.Content asChild forceMount {...noDescription}>
                  <motion.div
                    className={cn(
                      "pointer-events-auto flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-card shadow-lift sm:rounded-3xl",
                      size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg",
                    )}
                    initial={{ opacity: 0, y: 48, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 32, scale: 0.98 }}
                    transition={spring}
                  >
                    {body}
                  </motion.div>
                </Dialog.Content>
              </div>
            ) : (
              <Dialog.Content asChild forceMount {...noDescription}>
                <motion.div
                  className={cn(
                    "fixed inset-y-0 right-0 z-50 flex flex-col bg-card shadow-lift",
                    variant === "drawer" ? "w-full max-w-md rounded-l-3xl" : "w-full",
                  )}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={spring}
                >
                  {body}
                </motion.div>
              </Dialog.Content>
            )}
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
