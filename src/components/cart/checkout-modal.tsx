"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { OrderConfirmation } from "@/components/cart/order-confirmation";
import { OrderLines } from "@/components/cart/order-lines";
import { Button } from "@/components/ui/button";
import { Field, inputClasses, textareaClasses } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { site } from "@/data/site";
import { useCartSummary } from "@/hooks/use-cart-summary";
import { addDays, earliestPickupDate, todayInTimezone } from "@/lib/dates";
import { buildOrderFormSchema, type OrderFormValues } from "@/lib/order-schema";
import { snapshotItem } from "@/lib/order-items";
import type { OrderItemSnapshot, OrderSummary } from "@/lib/types";
import { scrollToSection } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

export function CheckoutModal() {
  const open = useUI((state) => state.checkoutOpen);
  const custom = useUI((state) => state.checkoutCustom);
  const closeCheckout = useUI((state) => state.closeCheckout);
  const { items, hydrated } = useCartSummary();

  const [confirmed, setConfirmed] = useState<OrderSummary | null>(null);
  const [wasOpen, setWasOpen] = useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setConfirmed(null);
  }

  const showEmpty = !confirmed && hydrated && items.length === 0 && !custom;
  const title = confirmed
    ? "Order request sent"
    : custom && items.length === 0
      ? "Request a Custom Order"
      : "Send Your Order Request";

  const browse = () => {
    closeCheckout();
    setTimeout(() => scrollToSection("menu"), 250);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(next) => !next && closeCheckout()}
      title={title}
      description={
        confirmed
          ? undefined
          : custom && items.length === 0
            ? "Birthdays, grad parties, gifts and events. Tell me what you need."
            : "No payment now. I'll confirm your order and we'll sort out the details."
      }
      size="lg"
    >
      {confirmed ? (
        <OrderConfirmation order={confirmed} onDone={browse} />
      ) : showEmpty ? (
        <div className="py-10 text-center">
          <p className="text-lg">Your cart is empty. Pick some cookies first 🍪</p>
          <Button className="mt-5" onClick={browse}>
            See the menu
          </Button>
        </div>
      ) : (
        <CheckoutForm custom={custom} onSuccess={setConfirmed} />
      )}
    </Modal>
  );
}

function CheckoutForm({ custom, onSuccess }: { custom: boolean; onSuccess: (order: OrderSummary) => void }) {
  const { items } = useCartSummary();
  const clear = useCart((state) => state.clear);
  const setCartOpen = useUI((state) => state.setCartOpen);
  const closeCheckout = useUI((state) => state.closeCheckout);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  const { minDate, maxDate } = useMemo(
    () => ({
      minDate: earliestPickupDate(site.ordering.timezone, site.ordering.leadDays),
      maxDate: addDays(todayInTimezone(site.ordering.timezone), 365),
    }),
    [],
  );

  const requireNotes = items.length === 0;
  const schema = useMemo(
    () => buildOrderFormSchema({ minDate, maxDate, requireNotes }),
    [minDate, maxDate, requireNotes],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      instagram: "",
      email: "",
      pickupDate: "",
      pickupTime: "",
      occasion: custom ? site.ordering.customOccasion : "Just a treat",
      notes: "",
    },
  });

  const snapshots = useMemo(
    () => items.map(snapshotItem).filter((item): item is OrderItemSnapshot => item !== null),
    [items],
  );
  const totalCents = snapshots.reduce((sum, item) => sum + item.lineCents, 0);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: values, items, website: honeypot.current?.value ?? "" }),
      });
      const data = (await response.json().catch(() => null)) as { order?: OrderSummary; error?: string } | null;
      if (!response.ok || !data?.order) {
        setSubmitError(
          data?.error ?? "Something went wrong sending your order. Your cart is safe, so please try again.",
        );
        return;
      }
      onSuccess(data.order);
      clear();
    } catch {
      setSubmitError(
        "We couldn't reach the server. Please check your connection and try again. Your cart is still saved.",
      );
    }
  });

  const describe = (name: keyof OrderFormValues, hint?: boolean) =>
    errors[name] ? `${name}-error` : hint ? `${name}-hint` : undefined;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 pt-1">
      <fieldset className="space-y-4">
        <legend className="mb-2 font-heading text-lg font-bold text-cocoa">About you</legend>
        <Field label="Full name" htmlFor="name" required error={errors.name?.message}>
          <input
            id="name"
            autoComplete="name"
            className={inputClasses}
            aria-invalid={!!errors.name}
            aria-describedby={describe("name")}
            {...register("name")}
          />
        </Field>
        <p className="-mb-1 text-sm font-semibold text-cocoa">
          How can I reach you? <span className="font-normal text-mocha">Phone or Instagram (at least one)</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone number" htmlFor="phone" error={errors.phone?.message}>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className={inputClasses}
              aria-invalid={!!errors.phone}
              aria-describedby={describe("phone")}
              {...register("phone")}
            />
          </Field>
          <Field label="Instagram handle" htmlFor="instagram" error={errors.instagram?.message}>
            <input
              id="instagram"
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="@yourhandle"
              className={inputClasses}
              aria-invalid={!!errors.instagram}
              aria-describedby={describe("instagram")}
              {...register("instagram")}
            />
          </Field>
        </div>
        <Field label="Email (optional)" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={inputClasses}
            aria-invalid={!!errors.email}
            aria-describedby={describe("email")}
            {...register("email")}
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 font-heading text-lg font-bold text-cocoa">Pickup</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Pickup date"
            htmlFor="pickupDate"
            required
            error={errors.pickupDate?.message}
            hint={`Please order at least ${site.ordering.leadDays} days ahead.`}
          >
            <input
              id="pickupDate"
              type="date"
              min={minDate}
              max={maxDate}
              className={inputClasses}
              aria-invalid={!!errors.pickupDate}
              aria-describedby={describe("pickupDate", true)}
              {...register("pickupDate")}
            />
          </Field>
          <Field label="Preferred time" htmlFor="pickupTime" required error={errors.pickupTime?.message}>
            <select
              id="pickupTime"
              className={inputClasses}
              aria-invalid={!!errors.pickupTime}
              aria-describedby={describe("pickupTime")}
              {...register("pickupTime")}
            >
              <option value="">Choose a time window</option>
              {site.ordering.pickupWindows.map((window) => (
                <option key={window} value={window}>
                  {window}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <p className="text-sm">{site.contact.pickupLocation}</p>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 font-heading text-lg font-bold text-cocoa">Details</legend>
        <Field label="Occasion" htmlFor="occasion" required error={errors.occasion?.message}>
          <select
            id="occasion"
            className={inputClasses}
            aria-invalid={!!errors.occasion}
            aria-describedby={describe("occasion")}
            {...register("occasion")}
          >
            {site.ordering.occasions.map((occasion) => (
              <option key={occasion} value={occasion}>
                {occasion}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label={requireNotes ? "Tell me about your order" : "Notes, allergies or special requests"}
          htmlFor="notes"
          required={requireNotes}
          error={errors.notes?.message}
          hint="Let me know about any allergies 💛"
        >
          <textarea
            id="notes"
            rows={4}
            className={textareaClasses}
            aria-invalid={!!errors.notes}
            aria-describedby={describe("notes", true)}
            {...register("notes")}
          />
        </Field>
      </fieldset>

      {/* Honeypot: hidden from people, bots love to fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" ref={honeypot} tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <section aria-labelledby="summary-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 id="summary-heading" className="font-heading text-lg font-bold text-cocoa">
            Order summary
          </h3>
          {items.length > 0 ? (
            <button
              type="button"
              className="text-sm font-bold text-berry underline-offset-2 hover:underline"
              onClick={() => {
                closeCheckout();
                setCartOpen(true);
              }}
            >
              Edit order
            </button>
          ) : null}
        </div>
        <OrderLines items={snapshots} totalCents={totalCents} />
        <p className="text-sm">{site.ordering.paymentNote}</p>
      </section>

      {submitError ? (
        <div role="alert" className="rounded-2xl border-2 border-berry/40 bg-blush p-4 text-sm font-semibold text-cocoa">
          {submitError}
        </div>
      ) : null}

      <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Sending…
          </>
        ) : submitError ? (
          "Try again"
        ) : (
          "Send Order Request"
        )}
      </Button>
    </form>
  );
}
