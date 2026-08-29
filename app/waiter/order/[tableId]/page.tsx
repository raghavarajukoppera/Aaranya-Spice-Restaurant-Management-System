"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import OrderPanel from "@/components/waiter/OrderPanel";
import { useRestaurant } from "@/context/RestaurantContext";

export default function WaiterOrderPage() {
  const params = useParams<{ tableId: string }>();
  const router = useRouter();
  const { tables, getOrderForTable } = useRestaurant();

  const table = tables.find((t) => t.id === params.tableId);
  const order = table ? getOrderForTable(table.id) : undefined;

  useEffect(() => {
    if (!table) {
      router.replace("/waiter/dashboard");
    }
  }, [table, router]);

  if (!table) return null;

  return (
    <DashboardShell role="waiter" title={`Order — Table ${table.number}`}>
      <OrderPanel table={table} order={order} />
    </DashboardShell>
  );
}
