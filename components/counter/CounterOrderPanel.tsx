"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Receipt as ReceiptIcon, Minus, Plus, Trash2, User, Phone } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import MenuPicker from "@/components/waiter/MenuPicker";
import OrderSummary from "@/components/waiter/OrderSummary";
import BillingForm from "@/components/shared/BillingForm";
import ReceiptView from "@/components/shared/ReceiptView";
import { KitchenStatus, Order, Payment, PaymentMode } from "@/lib/types";
import { useRestaurant } from "@/context/RestaurantContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/lib/utils";

interface CartLine {
  key: string;
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

const STATUS_TONE: Record<KitchenStatus, "yellow" | "blue" | "green" | "neutral"> = {
  Pending: "yellow",
  Preparing: "blue",
  Ready: "green",
  Served: "neutral",
};

// Lower number = shown first — mirrors the kitchen ticket ordering.
const STATUS_PRIORITY: Record<KitchenStatus, number> = {
  Pending: 0,
  Preparing: 1,
  Ready: 2,
  Served: 3,
};

export default function CounterOrderPanel({ order }: { order: Order }) {
  const { menu, sendItemsToKitchen, generateBill } = useRestaurant();
  const { showToast } = useToast();
  const router = useRouter();

  const [cart, setCart] = useState<CartLine[]>([]);
  const [billingOpen, setBillingOpen] = useState(false);
  const [discount, setDiscount] = useState("0");
  const [coupon, setCoupon] = useState("");
  const [method, setMethod] = useState<PaymentMode>("Cash");
  const [receipt, setReceipt] = useState<{ order: Order; payment: Payment } | null>(null);

  function addToCart(item: { foodId: string; quantity: number; notes?: string }) {
    const food = menu.find((f) => f.id === item.foodId);
    if (!food) return;
    setCart((prev) => [
      ...prev,
      {
        key: `${item.foodId}_${Date.now()}`,
        foodId: item.foodId,
        name: food.name,
        price: food.price,
        quantity: item.quantity,
        notes: item.notes,
      },
    ]);
  }

  function updateCartQty(key: string, qty: number) {
    setCart((prev) => prev.map((c) => (c.key === key ? { ...c, quantity: Math.max(1, qty) } : c)));
  }

  function removeCartLine(key: string) {
    setCart((prev) => prev.filter((c) => c.key !== key));
  }

  function handleSendToKitchen() {
    if (cart.length === 0) return;
    sendItemsToKitchen(
      order.id,
      cart.map((c) => ({ foodId: c.foodId, quantity: c.quantity, notes: c.notes }))
    );
    showToast(`${cart.length} item${cart.length > 1 ? "s" : ""} sent to the kitchen.`, "success");
    setCart([]);
  }

  function openBilling() {
    setDiscount("0");
    setCoupon("");
    setMethod("Cash");
    setBillingOpen(true);
  }

  function handleGenerate() {
    const payment = generateBill(order.id, {
      discount: Number(discount) || 0,
      couponCode: coupon.trim() || undefined,
      method,
    });
    showToast(`Bill generated for ${order.customerName}.`, "success");
    setReceipt({ order, payment });
    setBillingOpen(false);
  }

  const cartTotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  return (
    <div className="space-y-4 pt-2">
      <button
        onClick={() => router.push("/counter/dashboard")}
        className="flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-spice-600 focus-ring rounded"
      >
        <ArrowLeft className="h-4 w-4" /> Back to counter
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink flex items-center gap-2">
            <User className="h-5 w-5 text-spice-500" /> {order.customerName}
          </h2>
          {order.customerPhone && (
            <p className="flex items-center gap-1 text-xs text-ink/45">
              <Phone className="h-3 w-3" /> {order.customerPhone}
            </p>
          )}
        </div>
        <Badge tone="spice" dot>
          Parcel Order
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Menu picker */}
        <Card className="lg:col-span-3 animate-fade-in">
          <h3 className="mb-3 font-display text-base font-semibold text-ink">Add Items</h3>
          <MenuPicker menu={menu} onAdd={addToCart} />
        </Card>

        {/* Cart + order + billing */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="animate-fade-in">
            <h3 className="mb-3 font-display text-base font-semibold text-ink">New Items to Send</h3>
            {cart.length === 0 ? (
              <p className="py-6 text-center text-xs text-ink/40">Add dishes from the menu to build this order.</p>
            ) : (
              <div className="space-y-2">
                {cart.map((line) => (
                  <div key={line.key} className="rounded-xl border border-spice-100 bg-white/60 p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{line.name}</p>
                        {line.notes && <p className="truncate text-[11px] text-ink/45">{line.notes}</p>}
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          onClick={() => updateCartQty(line.key, line.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-md border border-spice-200 text-ink/60 hover:bg-spice-100 focus-ring"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-semibold">{line.quantity}</span>
                        <button
                          onClick={() => updateCartQty(line.key, line.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-md border border-spice-200 text-ink/60 hover:bg-spice-100 focus-ring"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeCartLine(line.key)}
                          className="ml-1 flex h-6 w-6 items-center justify-center rounded-md text-maroon-600 hover:bg-maroon-600/10 focus-ring"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-1 text-sm">
                  <span className="text-ink/50">Round subtotal</span>
                  <span className="font-semibold text-ink">{formatCurrency(cartTotal)}</span>
                </div>
                <Button className="w-full" icon={<Send className="h-4 w-4" />} onClick={handleSendToKitchen}>
                  Send Order to Kitchen
                </Button>
              </div>
            )}
          </Card>

          {order.items.length > 0 && (
            <>
              <Card className="animate-fade-in">
                <h3 className="mb-3 font-display text-base font-semibold text-ink">Order Status</h3>
                <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                  {[...order.items].sort((a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]).map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-sm">
                      <span className="text-ink/70">
                        {it.quantity}× {it.name}
                      </span>
                      <Badge tone={STATUS_TONE[it.status]} dot>
                        {it.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="animate-fade-in space-y-3">
                <OrderSummary items={order.items} />
                <Button
                  className="w-full"
                  variant="secondary"
                  icon={<ReceiptIcon className="h-4 w-4" />}
                  onClick={openBilling}
                >
                  Generate Bill &amp; Collect Payment
                </Button>
              </Card>
            </>
          )}
        </div>
      </div>

      <Modal open={billingOpen} onClose={() => setBillingOpen(false)} title={`Invoice — ${order.customerName}`}>
        <BillingForm
          order={order}
          discount={discount}
          setDiscount={setDiscount}
          coupon={coupon}
          setCoupon={setCoupon}
          method={method}
          setMethod={setMethod}
          onGenerate={handleGenerate}
          generateLabel="Confirm & Collect Payment"
        />
      </Modal>

      <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Receipt">
        {receipt && (
          <ReceiptView
            order={receipt.order}
            payment={receipt.payment}
            onClose={() => {
              setReceipt(null);
              router.push("/counter/dashboard");
            }}
          />
        )}
      </Modal>
    </div>
  );
}
