"use client";

import { Clock, MessageSquareText } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { KitchenStatus, Order, OrderItem } from "@/lib/types";
import { formatTime } from "@/lib/utils";

const STATUS_TONE: Record<KitchenStatus, "yellow" | "blue" | "green" | "neutral"> = {
  Pending: "yellow",
  Preparing: "blue",
  Ready: "green",
  Served: "neutral",
};

// Lower number = shown first. Pending needs attention first, Ready is "done, just needs pickup".
const STATUS_PRIORITY: Record<KitchenStatus, number> = {
  Pending: 0,
  Preparing: 1,
  Ready: 2,
  Served: 3,
};

const NEXT_STATUS: Record<KitchenStatus, KitchenStatus | null> = {
  Pending: "Preparing",
  Preparing: "Ready",
  Ready: "Served",
  Served: null,
};

const NEXT_LABEL: Record<KitchenStatus, string> = {
  Pending: "Start Preparing",
  Preparing: "Mark Ready",
  Ready: "Mark Served",
  Served: "Completed",
};

export default function OrderTicket({
  order,
  readOnly,
  onUpdateStatus,
}: {
  order: Order;
  readOnly?: boolean;
  onUpdateStatus?: (orderId: string, itemId: string, status: KitchenStatus) => void;
}) {
  const activeItems = order.items
    .filter((it) => it.status !== "Served")
    .sort((a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]);
  if (activeItems.length === 0) return null;

  return (
    <Card className="animate-fade-in flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-maroon-700">
            {order.orderType === "Parcel" ? `Parcel — ${order.customerName ?? "Walk-in"}` : `Table ${order.tableNumber}`}
          </p>
          <p className="flex items-center gap-1 text-xs text-ink/45">
            <Clock className="h-3 w-3" /> {formatTime(order.createdAt)} · {order.waiterName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {order.orderType === "Parcel" && <Badge tone="spice">Parcel</Badge>}
          <span className="rounded-lg bg-spice-500/10 px-2 py-1 text-[11px] font-bold text-spice-600">
            #{order.id.slice(-5).toUpperCase()}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {activeItems.map((item: OrderItem) => (
          <div key={item.id} className="rounded-xl border border-spice-100 bg-white/60 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-ink">
                  {item.quantity}× {item.name}
                </p>
                {item.notes && (
                  <p className="mt-0.5 flex items-start gap-1 text-xs text-ink/50">
                    <MessageSquareText className="mt-0.5 h-3 w-3 shrink-0" />
                    {item.notes}
                  </p>
                )}
              </div>
              <Badge tone={STATUS_TONE[item.status]} dot>
                {item.status}
              </Badge>
            </div>

            {!readOnly && NEXT_STATUS[item.status] && onUpdateStatus && (
              <Button
                size="sm"
                variant="outline"
                className="mt-2.5 w-full"
                onClick={() => onUpdateStatus(order.id, item.id, NEXT_STATUS[item.status]!)}
              >
                {NEXT_LABEL[item.status]}
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
