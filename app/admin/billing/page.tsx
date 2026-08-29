"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import BillGenerator from "@/components/admin/BillGenerator";
import ReceiptView from "@/components/shared/ReceiptView";
import { useRestaurant } from "@/context/RestaurantContext";
import { Order, Payment } from "@/lib/types";
import { formatCurrency, formatTime, orderLabel } from "@/lib/utils";

export default function AdminBillingPage() {
  const { orders, payments } = useRestaurant();
  const [receipt, setReceipt] = useState<{ order: Order; payment: Payment } | null>(null);

  function handleReprint(payment: Payment) {
    const order = orders.find((o) => o.id === payment.orderId);
    if (!order) return;
    setReceipt({ order, payment });
  }

  return (
    <DashboardShell role="admin" title="Billing">
      <div className="space-y-4 pt-2">
        <BillGenerator orders={orders} />

        <Card className="animate-fade-in">
          <h3 className="mb-3 font-display text-base font-semibold text-ink">Recent Payments</h3>
          {payments.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink/40">No payments recorded yet today.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-spice-100 text-left text-xs uppercase tracking-wide text-ink/45">
                    <th className="py-2 pr-4 font-semibold">Time</th>
                    <th className="py-2 pr-4 font-semibold">Order</th>
                    <th className="py-2 pr-4 font-semibold">Method</th>
                    <th className="py-2 pr-4 font-semibold">Discount</th>
                    <th className="py-2 pr-4 font-semibold text-right">Amount</th>
                    <th className="py-2 pl-4 font-semibold text-right">Bill</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const relatedOrder = orders.find((o) => o.id === p.orderId);
                    return (
                      <tr key={p.id} className="border-b border-spice-50 last:border-0">
                        <td className="py-2.5 pr-4 text-ink/60">{formatTime(p.createdAt)}</td>
                        <td className="py-2.5 pr-4 font-medium text-ink">
                          {relatedOrder ? orderLabel(relatedOrder) : `#${p.orderId.slice(-5).toUpperCase()}`}
                        </td>
                        <td className="py-2.5 pr-4 text-ink/60">{p.method}</td>
                        <td className="py-2.5 pr-4 text-ink/60">{p.discount > 0 ? formatCurrency(p.discount) : "—"}</td>
                        <td className="py-2.5 pr-4 text-right font-semibold text-spice-600">{formatCurrency(p.amount)}</td>
                        <td className="py-2.5 pl-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            icon={<Printer className="h-3.5 w-3.5" />}
                            onClick={() => handleReprint(p)}
                            disabled={!relatedOrder}
                          >
                            Print
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Receipt">
        {receipt && <ReceiptView order={receipt.order} payment={receipt.payment} onClose={() => setReceipt(null)} />}
      </Modal>
    </DashboardShell>
  );
}
