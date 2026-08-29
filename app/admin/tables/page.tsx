"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";
import TableGrid from "@/components/admin/TableGrid";
import { useRestaurant } from "@/context/RestaurantContext";
import { useToast } from "@/context/ToastContext";

const LEGEND = [
  { label: "Available", color: "bg-leaf-500" },
  { label: "Occupied", color: "bg-maroon-600" },
  { label: "Reserved", color: "bg-saffron-500" },
  { label: "Cleaning", color: "bg-sky-500" },
];

export default function AdminTablesPage() {
  const { tables, setTableStatus } = useRestaurant();
  const { showToast } = useToast();

  return (
    <DashboardShell role="admin" title="Table Management">
      <div className="space-y-4 pt-2">
        <Card className="animate-fade-in flex flex-wrap items-center gap-5">
          <span className="text-xs font-semibold text-ink/50">Status legend:</span>
          {LEGEND.map((l) => (
            <span key={l.label} className="flex items-center gap-2 text-xs font-medium text-ink/70">
              <span className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
              {l.label}
            </span>
          ))}
        </Card>

        <TableGrid
          tables={tables}
          onStatusChange={(id, status) => {
            setTableStatus(id, status);
            showToast(`Table status updated to ${status}.`, "success");
          }}
        />
      </div>
    </DashboardShell>
  );
}
