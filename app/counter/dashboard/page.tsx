"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Package, IndianRupee, Clock, ChevronRight, Printer, Receipt as ReceiptIcon, FileSpreadsheet } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";
import StatCard from "@/components/admin/StatCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import ReceiptView from "@/components/shared/ReceiptView";
import NewParcelOrderModal from "@/components/counter/NewParcelOrderModal";
import { useRestaurant } from "@/context/RestaurantContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Order, Payment } from "@/lib/types";
import { calcOrderTotals, formatCurrency, formatTime } from "@/lib/utils";
import { exportDailyReportToExcel } from "@/lib/exportReport";

export default function CounterDashboardPage() {
  const { orders, payments, staff, tables, startParcelOrder } = useRestaurant();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [receipt, setReceipt] = useState<{ order: Order; payment: Payment } | null>(null);
  const [exporting, setExporting] = useState(false);

  const parcelOrders = orders.filter((o) => o.orderType === "Parcel");
  const activeOrders = parcelOrders
    .filter((o) => o.status !== "Closed")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const today = new Date().toDateString();
  const todaysParcelOrderIds = new Set(
    parcelOrders.filter((o) => new Date(o.createdAt).toDateString() === today).map((o) => o.id)
  );
  const todaysParcelRevenue = payments
    .filter((p) => todaysParcelOrderIds.has(p.orderId))
    .reduce((sum, p) => sum + p.amount, 0);

  // Completed parcel bills, most recent first — lets the counter reprint a bill
  // even after the order is closed, same as Admin's billing history.
  const completedParcelBills = parcelOrders
    .filter((o) => o.status === "Closed")
    .map((o) => ({ order: o, payment: payments.find((p) => p.orderId === o.id) }))
    .filter((row): row is { order: Order; payment: Payment } => !!row.payment)
    .sort((a, b) => new Date(b.payment.createdAt).getTime() - new Date(a.payment.createdAt).getTime())
    .slice(0, 12);

  function handleCreate(name: string, phone?: string) {
    if (!user) return;
    const order = startParcelOrder(user.id, user.name, name, phone);
    setModalOpen(false);
    showToast(`Parcel order started for ${name}.`, "success");
    router.push(`/counter/order/${order.id}`);
  }

  function handleExport() {
    setExporting(true);
    try {
      exportDailyReportToExcel({ orders, payments, staff, tables, scope: "parcel" });
      showToast("Today's parcel report has been downloaded as an Excel file.", "success");
    } catch {
      showToast("Couldn't generate the report. Please try again.", "error");
    } finally {
      setExporting(false);
    }
  }

  return (
    <DashboardShell role="counter" title="Counter — Parcel Orders">
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="Active Parcel Orders" value={String(activeOrders.length)} icon={Package} tone="spice" />
          <StatCard label="Today's Parcel Revenue" value={formatCurrency(todaysParcelRevenue)} icon={IndianRupee} tone="leaf" />
          <StatCard label="Orders Today" value={String(todaysParcelOrderIds.size)} icon={Clock} tone="saffron" />
        </div>

        <Card className="animate-fade-in flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Take a new order</h2>
            <p className="text-xs text-ink/45">For customers ordering directly at the counter for takeaway.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              icon={<FileSpreadsheet className="h-4 w-4" />}
              onClick={handleExport}
              loading={exporting}
            >
              Export Today's Report
            </Button>
            <Button icon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
              New Parcel Order
            </Button>
          </div>
        </Card>

        <div>
          <h3 className="mb-3 font-display text-base font-semibold text-ink">Active Orders</h3>
          {activeOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-spice-200 bg-white/40 py-14 text-center">
              <Package className="h-8 w-8 text-ink/25" />
              <p className="text-sm font-medium text-ink/40">No active parcel orders right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {activeOrders.map((order) => {
                const { total } = calcOrderTotals(order.items);
                return (
                  <Card
                    key={order.id}
                    hover
                    className="animate-fade-in cursor-pointer"
                    onClick={() => router.push(`/counter/order/${order.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-display text-lg font-semibold text-ink">{order.customerName}</p>
                        <p className="text-xs text-ink/45">{formatTime(order.createdAt)}</p>
                      </div>
                      <Badge tone={order.items.length === 0 ? "neutral" : "spice"} dot>
                        {order.items.length === 0 ? "No items yet" : `${order.items.length} item${order.items.length > 1 ? "s" : ""}`}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-spice-100 pt-3">
                      <span className="text-xs text-ink/45">Running total</span>
                      <span className="font-display text-lg font-semibold text-spice-600">{formatCurrency(total)}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-1 text-xs font-semibold text-spice-600">
                      Open order <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-3 font-display text-base font-semibold text-ink">Recent Bills</h3>
          {completedParcelBills.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-spice-200 bg-white/40 py-12 text-center">
              <ReceiptIcon className="h-7 w-7 text-ink/25" />
              <p className="text-sm font-medium text-ink/40">Billed parcel orders will show up here for reprinting.</p>
            </div>
          ) : (
            <Card className="animate-fade-in overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-spice-100 text-left text-xs uppercase tracking-wide text-ink/45">
                    <th className="py-2 pr-4 font-semibold">Time</th>
                    <th className="py-2 pr-4 font-semibold">Customer</th>
                    <th className="py-2 pr-4 font-semibold">Method</th>
                    <th className="py-2 pr-4 font-semibold text-right">Amount</th>
                    <th className="py-2 pl-4 font-semibold text-right">Bill</th>
                  </tr>
                </thead>
                <tbody>
                  {completedParcelBills.map(({ order, payment }) => (
                    <tr key={payment.id} className="border-b border-spice-50 last:border-0">
                      <td className="py-2.5 pr-4 text-ink/60">{formatTime(payment.createdAt)}</td>
                      <td className="py-2.5 pr-4 font-medium text-ink">{order.customerName}</td>
                      <td className="py-2.5 pr-4 text-ink/60">{payment.method}</td>
                      <td className="py-2.5 pr-4 text-right font-semibold text-spice-600">{formatCurrency(payment.amount)}</td>
                      <td className="py-2.5 pl-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          icon={<Printer className="h-3.5 w-3.5" />}
                          onClick={() => setReceipt({ order, payment })}
                        >
                          Print Bill
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </div>

      <NewParcelOrderModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />

      <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Receipt">
        {receipt && <ReceiptView order={receipt.order} payment={receipt.payment} onClose={() => setReceipt(null)} />}
      </Modal>
    </DashboardShell>
  );
}
