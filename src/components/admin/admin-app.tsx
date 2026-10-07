"use client";

import { Check, Copy, Loader2, LogOut, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, inputClasses } from "@/components/ui/field";
import { Logo } from "@/components/ui/logo";
import { site } from "@/data/site";
import { formatPickupDate } from "@/lib/dates";
import { describeItemLine } from "@/lib/order-text";
import { formatPrice } from "@/lib/pricing";
import { ORDER_STATUSES, STATUS_LABELS, type AdminOrder, type OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "@/store/toast";

type View = "loading" | "login" | "ready";

const STATUS_STYLES: Record<OrderStatus, string> = {
  new: "bg-berry text-white",
  confirmed: "bg-[#D6F1EE] text-[#1E6E67]",
  baking: "bg-butter text-cocoa",
  ready: "bg-petal text-cocoa",
  picked_up: "border border-petal bg-cream text-mocha",
  cancelled: "bg-mocha/15 text-mocha",
};

const JSON_HEADERS = { "Content-Type": "application/json" };

export function AdminApp() {
  const [view, setView] = useState<View>("loading");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setRefreshing(true);
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      if (response.status === 401) {
        setView("login");
        return;
      }
      if (!response.ok) throw new Error("Request failed");
      const data = (await response.json()) as { orders: AdminOrder[] };
      setOrders(data.orders);
      setView("ready");
    } catch {
      setLoadError("Couldn't load orders. Check your connection and try again.");
      setView((current) => (current === "loading" ? "ready" : current));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    const previous = orders;
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)));
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: JSON_HEADERS,
        body: JSON.stringify({ status }),
      });
      if (response.status === 401) {
        setView("login");
        return;
      }
      if (!response.ok) throw new Error("Update failed");
      toast({ title: `Marked as ${STATUS_LABELS[status].toLowerCase()}` });
    } catch {
      setOrders(previous);
      toast({ title: "Couldn't update that order", description: "Please try again.", variant: "error" });
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST", headers: JSON_HEADERS }).catch(() => null);
    setOrders([]);
    setView("login");
  };

  if (view === "loading") {
    return (
      <main id="main" className="grid min-h-dvh place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-berry" aria-label="Loading" />
      </main>
    );
  }

  if (view === "login") return <LoginForm onSuccess={load} />;

  return (
    <main id="main" className="mx-auto min-h-dvh max-w-5xl px-4 pb-16 pt-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Logo href="/" />
          <h1 className="mt-3 text-3xl font-bold">Orders</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => void load()} disabled={refreshing}>
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} aria-hidden /> Refresh
          </Button>
          <Button variant="soft" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </Button>
        </div>
      </header>

      {loadError ? (
        <p role="alert" className="mt-6 rounded-2xl bg-blush p-4 font-bold text-cocoa">
          {loadError}
        </p>
      ) : null}

      <OrdersList orders={orders} onStatus={updateStatus} />
    </main>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Couldn't sign in. Please try again.");
        return;
      }
      await onSuccess();
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main id="main" className="grid min-h-dvh place-items-center px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-3xl bg-card p-7 shadow-lift">
        <div className="text-center">
          <Logo href="/" className="justify-center" />
          <h1 className="mt-5 text-2xl font-bold">Owner sign in</h1>
          <p className="mt-1 text-sm">Only {site.ownerName} can view orders.</p>
        </div>
        <Field label="Email" htmlFor="admin-email">
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Password" htmlFor="admin-password">
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClasses}
          />
        </Field>
        {error ? (
          <p role="alert" className="rounded-2xl bg-blush p-3 text-sm font-bold text-cocoa">
            {error}
          </p>
        ) : null}
        <Button type="submit" fullWidth size="lg" disabled={busy}>
          {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null} Sign in
        </Button>
      </form>
    </main>
  );
}

function OrdersList({
  orders,
  onStatus,
}: {
  orders: AdminOrder[];
  onStatus: (id: string, status: OrderStatus) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState("");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: orders.length };
    for (const order of orders) result[order.status] = (result[order.status] ?? 0) + 1;
    return result;
  }, [orders]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return orders.filter(
      (order) =>
        (statusFilter === "all" || order.status === statusFilter) &&
        (!dateFilter || order.pickupDate === dateFilter) &&
        (!needle || order.customerName.toLowerCase().includes(needle)),
    );
  }, [orders, statusFilter, dateFilter, query]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Order counts by status">
        {(["all", ...ORDER_STATUSES] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            aria-pressed={statusFilter === status}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-bold transition",
              statusFilter === status ? "bg-cocoa text-cream" : "bg-card text-cocoa shadow-soft hover:bg-blush",
            )}
          >
            {status === "all" ? "All" : STATUS_LABELS[status]} · {counts[status] ?? 0}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <label htmlFor="order-search" className="sr-only">
            Search by customer name
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mocha" aria-hidden />
          <input
            id="order-search"
            type="search"
            placeholder="Search by name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={cn(inputClasses, "pl-11")}
          />
        </div>
        <div>
          <label htmlFor="order-date" className="sr-only">
            Filter by pickup date
          </label>
          <input
            id="order-date"
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className={inputClasses}
          />
        </div>
        <Button
          variant="soft"
          onClick={() => {
            setStatusFilter("all");
            setDateFilter("");
            setQuery("");
          }}
        >
          Clear filters
        </Button>
      </div>

      <p className="mt-4 text-sm" aria-live="polite">
        Showing {filtered.length} of {orders.length} order{orders.length === 1 ? "" : "s"} · newest first
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-card p-10 text-center shadow-soft">
          <p className="text-lg font-bold text-cocoa">{orders.length === 0 ? "No orders yet 🍪" : "No orders match those filters"}</p>
          <p className="mt-1">
            {orders.length === 0 ? "New orders will show up here as soon as they come in." : "Try clearing a filter."}
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} onStatus={onStatus} />
          ))}
        </ul>
      )}
    </>
  );
}

function OrderCard({ order, onStatus }: { order: AdminOrder; onStatus: (id: string, status: OrderStatus) => void }) {
  const [copied, setCopied] = useState(false);

  const copyContact = async () => {
    const lines = [order.customerName];
    if (order.phone) lines.push(`Phone: ${order.phone}`);
    if (order.instagram) lines.push(`Instagram: ${order.instagram}`);
    if (order.email) lines.push(`Email: ${order.email}`);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      toast({ title: "Contact info copied" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Couldn't copy", variant: "error" });
    }
  };

  const created = new Date(order.createdAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <li className="rounded-3xl bg-card p-5 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-cocoa">{order.customerName}</h2>
          <p className="text-sm">Received {created}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-cocoa">
            {order.items.length === 0 ? "Custom" : formatPrice(order.totalCents)}
          </span>
          <span className={cn("rounded-full px-3 py-1 text-sm font-bold", STATUS_STYLES[order.status])}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-bold text-cocoa">Pickup:</span> {formatPickupDate(order.pickupDate)}
            {order.pickupTime ? ` · ${order.pickupTime}` : ""}
          </p>
          {order.occasion ? (
            <p>
              <span className="font-bold text-cocoa">Occasion:</span> {order.occasion}
            </p>
          ) : null}
          {order.phone ? (
            <p>
              <span className="font-bold text-cocoa">Phone:</span>{" "}
              <a className="underline" href={`tel:${order.phone.replace(/[^\d+]/g, "")}`}>
                {order.phone}
              </a>
            </p>
          ) : null}
          {order.instagram ? (
            <p>
              <span className="font-bold text-cocoa">Instagram:</span>{" "}
              <a
                className="underline"
                href={`https://ig.me/m/${order.instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {order.instagram}
              </a>
            </p>
          ) : null}
          {order.email ? (
            <p className="break-words">
              <span className="font-bold text-cocoa">Email:</span>{" "}
              <a className="underline" href={`mailto:${order.email}`}>
                {order.email}
              </a>
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl bg-cream p-4 text-sm">
          {order.items.length === 0 ? (
            <p className="font-bold text-cocoa">Custom order request (see notes)</p>
          ) : (
            <ul className="space-y-1.5">
              {order.items.map((item, index) => (
                <li key={`${item.label}-${index}`}>{describeItemLine(item)}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {order.notes ? (
        <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-blush p-4 text-sm text-cocoa">
          <span className="font-bold">Notes: </span>
          {order.notes}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {order.status === "new" ? (
          <Button size="sm" onClick={() => onStatus(order.id, "confirmed")}>
            <Check className="h-4 w-4" aria-hidden /> Mark as confirmed
          </Button>
        ) : null}
        <Button size="sm" variant="secondary" onClick={copyContact}>
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? "Copied" : "Copy contact"}
        </Button>
        <div className="ml-auto">
          <label htmlFor={`status-${order.id}`} className="sr-only">
            Status for {order.customerName}
          </label>
          <select
            id={`status-${order.id}`}
            value={order.status}
            onChange={(event) => onStatus(order.id, event.target.value as OrderStatus)}
            className={cn(inputClasses, "h-10 w-auto py-0 pr-8 text-sm font-bold")}
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </li>
  );
}
