"use client";

import { Inbox } from "lucide-react";
import OrderTicket from "./OrderTicket";
import { KitchenStatus, Order } from "@/lib/types";

export default function KitchenBoard({
  orders,
  readOnly,
  onUpdateStatus,
}: {
  orders: Order[];
  readOnly?: boolean;
  onUpdateStatus?: (orderId: string, itemId: string, status: KitchenStatus) => void;
}) {
  const activeOrders = orders
    .filter((o) => o.status !== "Closed")
    .filter((o) => o.items.some((it) => it.status !== "Served"))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  if (activeOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-spice-200 bg-white/40 py-20 text-center">
        <Inbox className="h-8 w-8 text-ink/25" />
        <p className="text-sm font-medium text-ink/40">No active orders in the kitchen right now.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {activeOrders.map((order) => (
        <OrderTicket key={order.id} order={order} readOnly={readOnly} onUpdateStatus={onUpdateStatus} />
      ))}
    </div>
  );
}
