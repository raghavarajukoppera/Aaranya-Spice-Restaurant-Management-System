"use client";

import { useState } from "react";
import { IndianRupee, ClipboardList, Grid3x3, CheckCircle2, Timer, RotateCcw, FileSpreadsheet } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatCard from "@/components/admin/StatCard";
import SalesChart from "@/components/admin/SalesChart";
import PopularItemsChart from "@/components/admin/PopularItemsChart";
import CategorySalesChart from "@/components/admin/CategorySalesChart";
import QuickActions from "@/components/admin/QuickActions";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useRestaurant } from "@/context/RestaurantContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/lib/utils";
import { exportDailyReportToExcel } from "@/lib/exportReport";

export default function AdminDashboardPage() {
  const { orders, tables, payments, menu, staff, resetAllData } = useRestaurant();
  const { showToast } = useToast();
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const today = new Date().toDateString();
  const todaysOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const todaysRevenue = payments
    .filter((p) => new Date(p.createdAt).toDateString() === today)
    .reduce((sum, p) => sum + p.amount, 0);

  const occupied = tables.filter((t) => t.status === "Occupied").length;
  const available = tables.filter((t) => t.status === "Available").length;
  const pendingKitchen = orders
    .filter((o) => o.status !== "Closed")
    .reduce(
      (sum, o) => sum + o.items.filter((it) => it.status === "Pending" || it.status === "Preparing").length,
      0
    );

  function handleReset() {
    resetAllData();
    showToast("All orders, tables, and earnings have been reset.", "info");
  }

  function handleExport() {
    setExporting(true);
    try {
      exportDailyReportToExcel({ orders, payments, staff, tables });
      showToast("Today's report has been downloaded as an Excel file.", "success");
    } catch {
      showToast("Couldn't generate the report. Please try again.", "error");
    } finally {
      setExporting(false);
    }
  }

  return (
    <DashboardShell role="admin" title="Dashboard">
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard label="Today's Revenue" value={formatCurrency(todaysRevenue)} icon={IndianRupee} tone="spice" />
          <StatCard label="Today's Orders" value={String(todaysOrders.length)} icon={ClipboardList} tone="saffron" />
          <StatCard label="Occupied Tables" value={String(occupied)} icon={Grid3x3} tone="maroon" />
          <StatCard label="Available Tables" value={String(available)} icon={CheckCircle2} tone="leaf" />
          <StatCard label="Pending Kitchen Orders" value={String(pendingKitchen)} icon={Timer} tone="spice" />
        </div>

        <Card className="animate-fade-in flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Today's Report</h2>
            <p className="text-xs text-ink/45">
              Download revenue, orders, payments, best sellers, and staff attendance for {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} as an Excel file.
            </p>
          </div>
          <Button icon={<FileSpreadsheet className="h-4 w-4" />} onClick={handleExport} loading={exporting}>
            Export Today's Report (Excel)
          </Button>
        </Card>

        <QuickActions />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="xl:col-span-2">
            <SalesChart todayRevenue={todaysRevenue} />
          </div>
          <PopularItemsChart orders={orders} />
          <CategorySalesChart orders={orders} menu={menu} />
        </div>

        <div className="flex items-center justify-between rounded-xl2 border border-dashed border-spice-200 bg-white/40 px-4 py-3">
          <p className="text-xs text-ink/45">
            Orders, tables, and earnings are now saved on this device and survive a page reload.
          </p>
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Demo Data
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        title="Reset all data"
        description="This clears every order, table status, payment, and staff attendance entry stored on this device, and restores the original demo menu. This cannot be undone. Continue?"
        confirmLabel="Reset Everything"
        danger
        onConfirm={handleReset}
      />
    </DashboardShell>
  );
}
