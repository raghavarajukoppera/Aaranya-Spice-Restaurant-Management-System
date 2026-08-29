"use client";

import { Timer, Flame, CheckCircle2 } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import KitchenBoard from "@/components/kitchen/KitchenBoard";
import StatCard from "@/components/admin/StatCard";
import { useRestaurant } from "@/context/RestaurantContext";
import { useToast } from "@/context/ToastContext";

export default function KitchenDashboardPage() {
  const { orders, updateKitchenItemStatus } = useRestaurant();
  const { showToast } = useToast();

  const allItems = orders.filter((o) => o.status !== "Closed").flatMap((o) => o.items);
  const pending = allItems.filter((i) => i.status === "Pending").length;
  const preparing = allItems.filter((i) => i.status === "Preparing").length;
  const ready = allItems.filter((i) => i.status === "Ready").length;

  return (
    <DashboardShell role="kitchen" title="Kitchen Dashboard">
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Pending" value={String(pending)} icon={Timer} tone="saffron" />
          <StatCard label="Preparing" value={String(preparing)} icon={Flame} tone="spice" />
          <StatCard label="Ready to Serve" value={String(ready)} icon={CheckCircle2} tone="leaf" />
        </div>

        <KitchenBoard
          orders={orders}
          onUpdateStatus={(orderId, itemId, status) => {
            updateKitchenItemStatus(orderId, itemId, status);
            showToast(`Item marked as ${status}.`, "success");
          }}
        />
      </div>
    </DashboardShell>
  );
}
