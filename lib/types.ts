export type Role = "admin" | "waiter" | "kitchen" | "counter";

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
}

export type FoodCategory =
  | "Main Course"
  | "Starters"
  | "Beverages"
  | "Desserts"
  | "Chinese"
  | "South Indian"
  | "North Indian";

export type MealTime = "Morning" | "Afternoon" | "Dinner" | "All Day";

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  available: boolean;
  isVeg: boolean;
  image: string;
  mealTime: MealTime;
}

export type TableStatus = "Available" | "Occupied" | "Reserved" | "Cleaning";

export interface RestaurantTable {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
}

export type KitchenStatus = "Pending" | "Preparing" | "Ready" | "Served";

export interface OrderItem {
  id: string;
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  status: KitchenStatus;
}

export type OrderStatus = "Open" | "BillRequested" | "Closed";

export type OrderType = "DineIn" | "Parcel";

export interface Order {
  id: string;
  orderType: OrderType;
  tableId?: string;
  tableNumber?: number;
  waiterId: string;
  waiterName: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  customerNotes?: string;
  status: OrderStatus;
  createdAt: string;
}

export type PaymentMode = "Cash" | "Card" | "UPI" | "Split";

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMode;
  status: "Pending" | "Paid";
  discount: number;
  couponCode?: string;
  gst: number;
  createdAt: string;
}

export type AttendanceStatus = "Present" | "Half Day" | "Absent" | "Not Marked";

export interface StaffMember {
  id: string;
  name: string;
  role: Role;
  username: string;
  status: "Active" | "Off Duty";
  attendance: AttendanceStatus;
  attendanceUpdatedAt?: string;
}
