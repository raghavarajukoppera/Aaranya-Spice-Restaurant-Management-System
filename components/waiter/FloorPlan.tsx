"use client";

import { useRouter } from "next/navigation";
import TableCard from "./TableCard";
import { Order, RestaurantTable } from "@/lib/types";

export default function FloorPlan({ tables, orders }: { tables: RestaurantTable[]; orders: Order[] }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {tables.map((table) => {
        const order = orders.find((o) => o.tableId === table.id && o.status !== "Closed");
        const pendingCount = order?.items.filter((i) => i.status === "Pending" || i.status === "Preparing").length;
        return (
          <TableCard
            key={table.id}
            table={table}
            pendingCount={pendingCount}
            onClick={() => router.push(`/waiter/order/${table.id}`)}
          />
        );
      })}
    </div>
  );
}
