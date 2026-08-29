"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import BillingForm from "@/components/shared/BillingForm";
import ReceiptView from "@/components/shared/ReceiptView";
import { Order, Payment, PaymentMode } from "@/lib/types";
import { calcOrderTotals, formatCurrency, formatTime, orderLabel } from "@/lib/utils";
import { useRestaurant } from "@/context/RestaurantContext";
import { useToast } from "@/context/ToastContext";

export default function BillGenerator({ orders }: { orders: Order[] }) {
  const { generateBill } = useRestaurant();
  const { showToast } = useToast();

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [discount, setDiscount] = useState("0");
  const [coupon, setCoupon] = useState("");
  const [method, setMethod] = useState<PaymentMode>("Cash");
  const [receipt, setReceipt] = useState<{ order: Order; payment: Payment } | null>(null);

  const billable = orders.filter((o) => o.status !== "Closed" && o.items.length > 0);

  function openBilling(order: Order) {
    setActiveOrder(order);
    setDiscount("0");
    setCoupon("");
    setMethod("Cash");
  }

  function handleGenerate() {
    if (!activeOrder) return;
    const payment = generateBill(activeOrder.id, {
      discount: Number(discount) || 0,
      couponCode: coupon.trim() || undefined,
      method,
    });
    showToast(`Bill generated for ${orderLabel(activeOrder)}.`, "success");
    setReceipt({ order: activeOrder, payment });
    setActiveOrder(null);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {billable.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-spice-200 bg-white/40 py-16 text-center">
            <Receipt className="h-8 w-8 text-ink/25" />
            <p className="text-sm font-medium text-ink/40">No active tables or parcel orders awaiting billing.</p>
          </div>
        )}
        {billable.map((order) => {
          const { total } = calcOrderTotals(order.items);
          return (
            <Card key={order.id} hover className="animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg font-semibold text-ink">{orderLabel(order)}</p>
                  <p className="text-xs text-ink/45">{order.waiterName} · {formatTime(order.createdAt)}</p>
                </div>
                <Badge tone={order.status === "BillRequested" ? "yellow" : "spice"} dot>
                  {order.status === "BillRequested" ? "Bill Requested" : "Order Open"}
                </Badge>
              </div>

              <div className="mt-3 space-y-1 text-xs text-ink/60">
                {order.items.slice(0, 3).map((it) => (
                  <p key={it.id}>
                    {it.quantity}× {it.name}
                  </p>
                ))}
                {order.items.length > 3 && <p>+{order.items.length - 3} more items</p>}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-spice-100 pt-3">
                <span className="text-xs text-ink/45">Total (incl. GST)</span>
                <span className="font-display text-lg font-semibold text-spice-600">{formatCurrency(total)}</span>
              </div>

              <Button className="mt-3 w-full" onClick={() => openBilling(order)}>
                Generate Bill
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Billing modal */}
      <Modal open={!!activeOrder} onClose={() => setActiveOrder(null)} title={`Invoice — ${activeOrder ? orderLabel(activeOrder) : ""}`}>
        {activeOrder && (
          <BillingForm
            order={activeOrder}
            discount={discount}
            setDiscount={setDiscount}
            coupon={coupon}
            setCoupon={setCoupon}
            method={method}
            setMethod={setMethod}
            onGenerate={handleGenerate}
          />
        )}
      </Modal>

      {/* Receipt modal */}
      <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Receipt">
        {receipt && <ReceiptView order={receipt.order} payment={receipt.payment} onClose={() => setReceipt(null)} />}
      </Modal>
    </>
  );
}
