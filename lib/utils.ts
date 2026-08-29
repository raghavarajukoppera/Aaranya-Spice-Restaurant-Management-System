import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const GST_RATE = 0.05; // 5% GST

export function calcOrderTotals(items: { price: number; quantity: number }[]) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;
  return { subtotal, gst, total };
}

export function orderLabel(order: { orderType: string; tableNumber?: number; customerName?: string }): string {
  if (order.orderType === "Parcel") {
    return `Parcel — ${order.customerName ?? "Walk-in Customer"}`;
  }
  return `Table ${order.tableNumber ?? "—"}`;
}
