"use client";

import { Printer } from "lucide-react";
import Button from "@/components/ui/Button";
import { Order, Payment } from "@/lib/types";
import { calcOrderTotals, formatCurrency, orderLabel } from "@/lib/utils";

export default function ReceiptView({
  order,
  payment,
  onClose,
}: {
  order: Order;
  payment: Payment;
  onClose: () => void;
}) {
  const { subtotal } = calcOrderTotals(order.items);
  return (
    <div>
      <div id="printable-receipt" className="rounded-xl border border-dashed border-spice-300 bg-white p-5">
        <div className="text-center">
          <p className="font-display text-lg font-semibold text-maroon-700">Aaranya Spice</p>
          <p className="text-[11px] text-ink/45">Where Every Meal Feels Like Home</p>
        </div>
        <div className="my-3 border-t border-dashed border-spice-200" />
        <div className="flex justify-between text-xs text-ink/60">
          <span>{orderLabel(order)}</span>
          <span>{new Date(payment.createdAt).toLocaleString("en-IN")}</span>
        </div>
        {order.orderType === "Parcel" && order.customerPhone && (
          <p className="mt-1 text-xs text-ink/45">Phone: {order.customerPhone}</p>
        )}
        <div className="my-3 space-y-1">
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between text-sm">
              <span>
                {it.quantity}× {it.name}
              </span>
              <span>{formatCurrency(it.price * it.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="my-3 border-t border-dashed border-spice-200" />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-ink/60">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink/60">
            <span>GST</span>
            <span>{formatCurrency(payment.gst)}</span>
          </div>
          {payment.discount > 0 && (
            <div className="flex justify-between text-leaf-600">
              <span>Discount {payment.couponCode && `(${payment.couponCode})`}</span>
              <span>-{formatCurrency(payment.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-display text-base font-semibold text-ink">
            <span>Total Paid</span>
            <span>{formatCurrency(payment.amount)}</span>
          </div>
          <div className="flex justify-between text-xs text-ink/45">
            <span>Payment Mode</span>
            <span>{payment.method}</span>
          </div>
        </div>
        <div className="my-3 border-t border-dashed border-spice-200" />
        <p className="text-center text-[11px] text-ink/40">
          {order.orderType === "Parcel" ? "Thank you for your order — enjoy your meal!" : "Thank you for dining with us!"}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="flex-1" icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
          Print / Download PDF
        </Button>
        <Button className="flex-1" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}
