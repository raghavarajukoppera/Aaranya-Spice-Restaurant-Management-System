"use client";

import { Users, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import { RestaurantTable, TableStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<TableStatus, { bg: string; ring: string; text: string; dot: string }> = {
  Available: { bg: "bg-leaf-500/10", ring: "ring-leaf-500/30", text: "text-leaf-600", dot: "bg-leaf-500" },
  Occupied: { bg: "bg-maroon-600/10", ring: "ring-maroon-600/30", text: "text-maroon-600", dot: "bg-maroon-600" },
  Reserved: { bg: "bg-saffron-500/15", ring: "ring-saffron-500/40", text: "text-saffron-600", dot: "bg-saffron-500" },
  Cleaning: { bg: "bg-sky-500/10", ring: "ring-sky-500/30", text: "text-sky-700", dot: "bg-sky-500" },
};

export default function TableGrid({
  tables,
  onStatusChange,
}: {
  tables: RestaurantTable[];
  onStatusChange: (tableId: string, status: TableStatus) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {tables.map((table) => {
        const style = STATUS_STYLES[table.status];
        return (
          <Card key={table.id} hover className={cn("ring-1", style.bg, style.ring)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg font-semibold text-ink">Table {table.number}</p>
                <p className="flex items-center gap-1 text-xs text-ink/50">
                  <Users className="h-3 w-3" /> Seats {table.capacity}
                </p>
              </div>
              <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", style.text)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
                {table.status}
              </span>
            </div>

            <Select
              className="mt-4 text-xs"
              value={table.status}
              onChange={(e) => onStatusChange(table.id, e.target.value as TableStatus)}
              disabled={table.status === "Occupied"}
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Occupied" disabled>
                Occupied (managed by waiter)
              </option>
            </Select>
            {table.status === "Occupied" && (
              <p className="mt-2 flex items-center gap-1 text-[11px] text-ink/40">
                <Sparkles className="h-3 w-3" /> Session active — closes automatically after billing
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}
