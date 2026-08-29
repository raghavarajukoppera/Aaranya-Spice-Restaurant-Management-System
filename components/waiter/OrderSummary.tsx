import { calcOrderTotals, formatCurrency } from "@/lib/utils";

export default function OrderSummary({ items }: { items: { price: number; quantity: number }[] }) {
  const { subtotal, gst, total } = calcOrderTotals(items);

  return (
    <div className="space-y-1.5 rounded-xl bg-spice-50/70 p-4 text-sm">
      <div className="flex justify-between text-ink/60">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-ink/60">
        <span>GST (5%)</span>
        <span>{formatCurrency(gst)}</span>
      </div>
      <div className="flex justify-between border-t border-spice-200 pt-1.5 font-display text-base font-semibold text-ink">
        <span>Grand Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
