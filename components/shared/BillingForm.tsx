"use client";

import { Percent, Tag, CreditCard } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Order, PaymentMode } from "@/lib/types";
import { calcOrderTotals, formatCurrency } from "@/lib/utils";

export const PAYMENT_MODES: PaymentMode[] = ["Cash", "Card", "UPI", "Split"];

export default function BillingForm({
  order,
  discount,
  setDiscount,
  coupon,
  setCoupon,
  method,
  setMethod,
  onGenerate,
  generateLabel = "Confirm & Generate Invoice",
}: {
  order: Order;
  discount: string;
  setDiscount: (v: string) => void;
  coupon: string;
  setCoupon: (v: string) => void;
  method: PaymentMode;
  setMethod: (v: PaymentMode) => void;
  onGenerate: () => void;
  generateLabel?: string;
}) {
  const { subtotal, gst } = calcOrderTotals(order.items);
  const discountAmount = Math.min(Number(discount) || 0, subtotal);
  const total = Math.max(0, subtotal + gst - discountAmount);

  return (
    <div className="space-y-4">
      <div className="max-h-40 space-y-1.5 overflow-y-auto rounded-xl border border-spice-100 bg-white/50 p-3">
        {order.items.map((it) => (
          <div key={it.id} className="flex justify-between text-sm">
            <span className="text-ink/70">
              {it.quantity}× {it.name}
            </span>
            <span className="font-medium text-ink">{formatCurrency(it.price * it.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Discount (₹)"
          type="number"
          min={0}
          icon={<Percent className="h-3.5 w-3.5" />}
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
        <Input
          label="Coupon Code"
          placeholder="Optional"
          icon={<Tag className="h-3.5 w-3.5" />}
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
      </div>

      <Select label="Payment Mode" value={method} onChange={(e) => setMethod(e.target.value as PaymentMode)}>
        {PAYMENT_MODES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </Select>

      <div className="space-y-1.5 rounded-xl bg-spice-50/70 p-4 text-sm">
        <div className="flex justify-between text-ink/60">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-ink/60">
          <span>GST (5%)</span>
          <span>{formatCurrency(gst)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-leaf-600">
            <span>Discount</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-spice-200 pt-1.5 font-display text-base font-semibold text-ink">
          <span>Grand Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <Button className="w-full" size="lg" icon={<CreditCard className="h-4 w-4" />} onClick={onGenerate}>
        {generateLabel}
      </Button>
    </div>
  );
}
