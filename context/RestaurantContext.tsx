"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  FoodItem,
  KitchenStatus,
  Order,
  OrderItem,
  Payment,
  PaymentMode,
  RestaurantTable,
  StaffMember,
  TableStatus,
} from "@/lib/types";
import { initialMenu } from "@/data/menuData";
import { initialStaff, initialTables } from "@/data/tablesData";
import { calcOrderTotals, generateId } from "@/lib/utils";

interface RestaurantContextValue {
  // Menu
  menu: FoodItem[];
  addFood: (food: Omit<FoodItem, "id">) => void;
  updateFood: (id: string, food: Partial<FoodItem>) => void;
  deleteFood: (id: string) => void;

  // Tables
  tables: RestaurantTable[];
  setTableStatus: (tableId: string, status: TableStatus) => void;

  // Orders
  orders: Order[];
  getOrderForTable: (tableId: string) => Order | undefined;
  startSession: (tableId: string, waiterId: string, waiterName: string) => Order;
  startParcelOrder: (
    counterId: string,
    counterName: string,
    customerName: string,
    customerPhone?: string
  ) => Order;
  sendItemsToKitchen: (
    orderId: string,
    items: { foodId: string; quantity: number; notes?: string }[]
  ) => void;
  updateItemQuantity: (orderId: string, itemId: string, quantity: number) => void;
  removeItem: (orderId: string, itemId: string) => void;
  setCustomerNotes: (orderId: string, notes: string) => void;
  requestBill: (orderId: string) => void;
  updateKitchenItemStatus: (
    orderId: string,
    itemId: string,
    status: KitchenStatus
  ) => void;

  // Billing
  payments: Payment[];
  generateBill: (
    orderId: string,
    opts: { discount: number; couponCode?: string; method: PaymentMode }
  ) => Payment;

  // Staff
  staff: StaffMember[];
  updateAttendance: (staffId: string, attendance: StaffMember["attendance"]) => void;

  // Persistence
  isHydrated: boolean;
  resetAllData: () => void;
}

const RestaurantContext = createContext<RestaurantContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "aaranya_spice_restaurant_data_v1";

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<FoodItem[]>(initialMenu);
  const [tables, setTables] = useState<RestaurantTable[]>(initialTables);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load anything saved from a previous visit once, on mount, so a page
  // reload keeps today's tables/orders/earnings instead of starting fresh.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          menu?: FoodItem[];
          tables?: RestaurantTable[];
          orders?: Order[];
          payments?: Payment[];
          staff?: StaffMember[];
        };
        if (saved.menu) setMenu(saved.menu);
        if (saved.tables) setTables(saved.tables);
        if (saved.orders) setOrders(saved.orders);
        if (saved.payments) setPayments(saved.payments);
        if (saved.staff) setStaff(saved.staff);
      }
    } catch {
      // Corrupted or unavailable storage — fall back to the seed data.
    }
    setIsHydrated(true);
  }, []);

  // Persist on every change, once the initial load above has finished
  // (so we don't overwrite saved data with the seed data for a split second).
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ menu, tables, orders, payments, staff })
      );
    } catch {
      // Storage full or unavailable (e.g. private browsing) — fail silently.
    }
  }, [isHydrated, menu, tables, orders, payments, staff]);

  const resetAllData = useCallback(() => {
    setMenu(initialMenu);
    setTables(initialTables);
    setOrders([]);
    setPayments([]);
    setStaff(initialStaff);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  // ---------- STAFF ----------
  const updateAttendance = useCallback((staffId: string, attendance: StaffMember["attendance"]) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? { ...s, attendance, attendanceUpdatedAt: new Date().toISOString() }
          : s
      )
    );
  }, []);

  // ---------- MENU ----------
  const addFood = useCallback((food: Omit<FoodItem, "id">) => {
    setMenu((prev) => [{ ...food, id: generateId("f") }, ...prev]);
  }, []);

  const updateFood = useCallback((id: string, food: Partial<FoodItem>) => {
    setMenu((prev) => prev.map((f) => (f.id === id ? { ...f, ...food } : f)));
  }, []);

  const deleteFood = useCallback((id: string) => {
    setMenu((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // ---------- TABLES ----------
  const setTableStatus = useCallback((tableId: string, status: TableStatus) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status } : t))
    );
  }, []);

  // ---------- ORDERS ----------
  const getOrderForTable = useCallback(
    (tableId: string) => {
      return orders.find(
        (o) => o.tableId === tableId && o.status !== "Closed"
      );
    },
    [orders]
  );

  const startSession = useCallback(
    (tableId: string, waiterId: string, waiterName: string): Order => {
      const table = tables.find((t) => t.id === tableId);
      const newOrder: Order = {
        id: generateId("o"),
        orderType: "DineIn",
        tableId,
        tableNumber: table?.number,
        waiterId,
        waiterName,
        items: [],
        status: "Open",
        createdAt: new Date().toISOString(),
      };
      setOrders((prev) => [...prev, newOrder]);
      setTables((prev) =>
        prev.map((t) =>
          t.id === tableId
            ? { ...t, status: "Occupied", currentOrderId: newOrder.id }
            : t
        )
      );
      return newOrder;
    },
    [tables]
  );

  const startParcelOrder = useCallback(
    (
      counterId: string,
      counterName: string,
      customerName: string,
      customerPhone?: string
    ): Order => {
      const newOrder: Order = {
        id: generateId("o"),
        orderType: "Parcel",
        waiterId: counterId,
        waiterName: counterName,
        customerName,
        customerPhone,
        items: [],
        status: "Open",
        createdAt: new Date().toISOString(),
      };
      setOrders((prev) => [...prev, newOrder]);
      return newOrder;
    },
    []
  );

  const sendItemsToKitchen = useCallback(
    (
      orderId: string,
      items: { foodId: string; quantity: number; notes?: string }[]
    ) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o;
          const newItems: OrderItem[] = items.map((it) => {
            const food = menu.find((f) => f.id === it.foodId);
            return {
              id: generateId("oi"),
              foodId: it.foodId,
              name: food?.name ?? "Unknown Item",
              price: food?.price ?? 0,
              quantity: it.quantity,
              notes: it.notes,
              status: "Pending",
            };
          });
          return { ...o, items: [...o.items, ...newItems] };
        })
      );
    },
    [menu]
  );

  const updateItemQuantity = useCallback(
    (orderId: string, itemId: string, quantity: number) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id !== orderId
            ? o
            : {
                ...o,
                items: o.items.map((it) =>
                  it.id === itemId ? { ...it, quantity: Math.max(1, quantity) } : it
                ),
              }
        )
      );
    },
    []
  );

  const removeItem = useCallback((orderId: string, itemId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id !== orderId
          ? o
          : { ...o, items: o.items.filter((it) => it.id !== itemId) }
      )
    );
  }, []);

  const setCustomerNotes = useCallback((orderId: string, notes: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, customerNotes: notes } : o))
    );
  }, []);

  const requestBill = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "BillRequested" } : o
      )
    );
  }, []);

  const updateKitchenItemStatus = useCallback(
    (orderId: string, itemId: string, status: KitchenStatus) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id !== orderId
            ? o
            : {
                ...o,
                items: o.items.map((it) =>
                  it.id === itemId ? { ...it, status } : it
                ),
              }
        )
      );
    },
    []
  );

  // ---------- BILLING ----------
  const generateBill = useCallback(
    (
      orderId: string,
      opts: { discount: number; couponCode?: string; method: PaymentMode }
    ): Payment => {
      const order = orders.find((o) => o.id === orderId);
      const { subtotal, gst } = calcOrderTotals(order?.items ?? []);
      const discountAmount = Math.min(opts.discount, subtotal);
      const amount = Math.max(0, subtotal + gst - discountAmount);

      const payment: Payment = {
        id: generateId("p"),
        orderId,
        amount,
        method: opts.method,
        status: "Paid",
        discount: discountAmount,
        couponCode: opts.couponCode,
        gst,
        createdAt: new Date().toISOString(),
      };
      setPayments((prev) => [payment, ...prev]);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "Closed" } : o))
      );

      if (order?.tableId) {
        setTables((prev) =>
          prev.map((t) =>
            t.id === order.tableId
              ? { ...t, status: "Available", currentOrderId: undefined }
              : t
          )
        );
      }

      return payment;
    },
    [orders]
  );

  const value = useMemo<RestaurantContextValue>(
    () => ({
      menu,
      addFood,
      updateFood,
      deleteFood,
      tables,
      setTableStatus,
      orders,
      getOrderForTable,
      startSession,
      startParcelOrder,
      sendItemsToKitchen,
      updateItemQuantity,
      removeItem,
      setCustomerNotes,
      requestBill,
      updateKitchenItemStatus,
      payments,
      generateBill,
      staff,
      updateAttendance,
      isHydrated,
      resetAllData,
    }),
    [
      menu,
      addFood,
      updateFood,
      deleteFood,
      tables,
      setTableStatus,
      orders,
      getOrderForTable,
      startSession,
      startParcelOrder,
      sendItemsToKitchen,
      updateItemQuantity,
      removeItem,
      setCustomerNotes,
      requestBill,
      updateKitchenItemStatus,
      payments,
      generateBill,
      staff,
      updateAttendance,
      isHydrated,
      resetAllData,
    ]
  );

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error("useRestaurant must be used within RestaurantProvider");
  return ctx;
}
