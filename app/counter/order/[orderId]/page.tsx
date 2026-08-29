"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import CounterOrderPanel from "@/components/counter/CounterOrderPanel";
import { useRestaurant } from "@/context/RestaurantContext";

export default function CounterOrderPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const { orders } = useRestaurant();

  const order = orders.find((o) => o.id === params.orderId && o.status !== "Closed");

  useEffect(() => {
    if (!order) {
      router.replace("/counter/dashboard");
    }
  }, [order, router]);

  if (!order) return null;

  return (
    <DashboardShell role="counter" title={`Parcel Order — ${order.customerName}`}>
      <CounterOrderPanel order={order} />
    </DashboardShell>
  );
}
