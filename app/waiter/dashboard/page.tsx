"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";
import FloorPlan from "@/components/waiter/FloorPlan";
import { useRestaurant } from "@/context/RestaurantContext";

const LEGEND = [
  { label: "Available", color: "bg-leaf-500" },
  { label: "Occupied", color: "bg-maroon-600" },
  { label: "Reserved", color: "bg-saffron-500" },
  { label: "Cleaning", color: "bg-sky-500" },
];

export default function WaiterDashboardPage() {
  const { tables, orders } = useRestaurant();

  return (
    <DashboardShell role="waiter" title="Restaurant Floor">
      <div className="space-y-4 pt-2">
        <Card className="animate-fade-in flex flex-wrap items-center gap-5">
          <span className="text-xs font-semibold text-ink/50">Tap a table to start or continue an order:</span>
          <div className="ml-auto flex flex-wrap gap-4">
            {LEGEND.map((l) => (
              <span key={l.label} className="flex items-center gap-2 text-xs font-medium text-ink/70">
                <span className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
                {l.label}
              </span>
            ))}
          </div>
        </Card>

        <FloorPlan tables={tables} orders={orders} />
      </div>
    </DashboardShell>
  );
}
