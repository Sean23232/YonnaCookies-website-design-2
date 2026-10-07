import { create } from "zustand";

export type ToastItem = {
  id: number;
  title: string;
  description?: string;
  variant: "success" | "error" | "info";
};

type ToastState = {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: number) => void;
};

let counter = 0;

export const useToasts = create<ToastState>()((set) => ({
  toasts: [],
  push: (toast) => {
    counter += 1;
    const id = counter;
    set((state) => ({ toasts: [...state.toasts.slice(-2), { ...toast, id }] }));
    setTimeout(() => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })), 3200);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function toast(input: {
  title: string;
  description?: string;
  variant?: ToastItem["variant"];
}): void {
  useToasts.getState().push({ variant: "success", ...input });
}
