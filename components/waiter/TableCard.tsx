"use client";

import { Users, Flame } from "lucide-react";
import { RestaurantTable, TableStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<TableStatus, { bg: string; ring: string; text: string; dot: string }> = {
  Available: { bg: "bg-leaf-500/10", ring: "ring-leaf-500/30", text: "text-leaf-600", dot: "bg-leaf-500" },
  Occupied: { bg: "bg-maroon-600/10", ring: "ring-maroon-600/30", text: "text-maroon-600", dot: "bg-maroon-600" },
  Reserved: { bg: "bg-saffron-500/15", ring: "ring-saffron-500/40", text: "text-saffron-600", dot: "bg-saffron-500" },
  Cleaning: { bg: "bg-sky-500/10", ring: "ring-sky-500/30", text: "text-sky-700", dot: "bg-sky-500" },
};

export default function TableCard({
  table,
  pendingCount,
  onClick,
}: {
  table: RestaurantTable;
  pendingCount?: number;
  onClick: () => void;
}) {
  const style = STATUS_STYLES[table.status];
  const clickable = table.status !== "Cleaning";

  return (
    <button
      onClick={onClick}
      disabled={!clickable}
      className={cn(
        "group relative flex flex-col items-center gap-2 rounded-xl2 p-5 text-center ring-1 shadow-card transition-all duration-200 focus-ring",
        style.bg,
        style.ring,
        clickable ? "hover:-translate-y-1 hover:shadow-card-hover cursor-pointer" : "opacity-60 cursor-not-allowed"
      )}
    >
      {pendingCount ? (
        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-spice-500 text-[11px] font-bold text-white shadow-card">
          {pendingCount}
        </span>
      ) : null}
      <div className={cn("flex h-14 w-14 items-center justify-center rounded-full text-lg font-display font-bold", style.text, "bg-white/70")}>
        {table.number}
      </div>
      <p className="flex items-center gap-1 text-xs text-ink/50">
        <Users className="h-3 w-3" /> {table.capacity} seats
      </p>
      <span className={cn("flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold", style.text)}>
        <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
        {table.status}
      </span>
      {pendingCount ? (
        <span className="flex items-center gap-1 text-[10px] font-medium text-spice-600">
          <Flame className="h-3 w-3" /> Items in kitchen
        </span>
      ) : null}
    </button>
  );
}
