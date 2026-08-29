"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import KitchenBoard from "@/components/kitchen/KitchenBoard";
import { useRestaurant } from "@/context/RestaurantContext";

export default function AdminKitchenViewPage() {
  const { orders } = useRestaurant();

  return (
    <DashboardShell role="admin" title="Kitchen View">
      <div className="pt-2">
        <p className="mb-4 text-xs font-medium text-ink/45">
          Read-only view of live kitchen tickets. Status updates are made by kitchen staff.
        </p>
        <KitchenBoard orders={orders} readOnly />
      </div>
    </DashboardShell>
  );
}
