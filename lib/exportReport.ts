import * as XLSX from "xlsx";
import { Order, Payment, RestaurantTable, StaffMember } from "./types";
import { calcOrderTotals, orderLabel } from "./utils";

type ReportScope = "all" | "parcel";

interface DailyReportInput {
  orders: Order[];
  payments: Payment[];
  staff: StaffMember[];
  tables: RestaurantTable[];
  date?: Date;
  /** "all" = full restaurant report (Admin). "parcel" = counter-only takeaway report. */
  scope?: ReportScope;
}

function namesOrNone(list: StaffMember[]): string {
  return list.length > 0 ? list.map((s) => s.name).join(", ") : "None";
}

/**
 * Builds a multi-sheet .xlsx workbook covering "today" — revenue, orders,
 * payments, best sellers, and (for the full report) staff attendance — and
 * triggers a browser download. Runs entirely client-side, no server needed.
 */
export function exportDailyReportToExcel({
  orders,
  payments,
  staff,
  tables,
  date = new Date(),
  scope = "all",
}: DailyReportInput) {
  const dayLabel = date.toDateString();
  const isParcelScope = scope === "parcel";

  const dayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === dayLabel);
  const dayPayments = payments.filter((p) => new Date(p.createdAt).toDateString() === dayLabel);

  const todaysOrders = isParcelScope ? dayOrders.filter((o) => o.orderType === "Parcel") : dayOrders;
  const todaysOrderIds = new Set(todaysOrders.map((o) => o.id));
  const todaysPayments = isParcelScope
    ? dayPayments.filter((p) => todaysOrderIds.has(p.orderId))
    : dayPayments;

  const totalRevenue = todaysPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalGST = todaysPayments.reduce((sum, p) => sum + p.gst, 0);
  const totalDiscount = todaysPayments.reduce((sum, p) => sum + p.discount, 0);
  const dineInCount = dayOrders.filter((o) => o.orderType === "DineIn").length;
  const parcelCount = dayOrders.filter((o) => o.orderType === "Parcel").length;

  // ---------- Popular items today (built first so the top seller can headline the Summary) ----------
  const tally = new Map<string, { qty: number; revenue: number }>();
  todaysOrders.forEach((o) =>
    o.items.forEach((it) => {
      const existing = tally.get(it.name) ?? { qty: 0, revenue: 0 };
      tally.set(it.name, { qty: existing.qty + it.quantity, revenue: existing.revenue + it.price * it.quantity });
    })
  );
  const popularRows = Array.from(tally.entries())
    .map(([name, v]) => ({ Item: name, "Qty Sold": v.qty, Revenue: v.revenue }))
    .sort((a, b) => b["Qty Sold"] - a["Qty Sold"]);
  const topItem = popularRows[0];

  // ---------- Staff attendance breakdown ----------
  const presentStaff = staff.filter((s) => s.attendance === "Present");
  const halfDayStaff = staff.filter((s) => s.attendance === "Half Day");
  const absentStaff = staff.filter((s) => s.attendance === "Absent");
  const notMarkedStaff = staff.filter((s) => s.attendance === "Not Marked");

  // ---------- Summary — headline numbers first, detail breakdown below ----------
  const summaryRows: { Metric: string; Value: string | number }[] = [
    { Metric: "Report Date", Value: dayLabel },
    { Metric: "Total Revenue Generated Today", Value: totalRevenue },
    { Metric: isParcelScope ? "Total Parcel Orders Today" : "Total Orders Today", Value: todaysOrders.length },
    { Metric: "Total Bills Generated", Value: todaysPayments.length },
    { Metric: "Top Selling Item Today", Value: topItem ? topItem.Item : "No items sold today" },
    { Metric: "Top Item — Quantity Sold", Value: topItem ? topItem["Qty Sold"] : 0 },
  ];

  if (!isParcelScope) {
    summaryRows.push(
      { Metric: "Dine-In Orders", Value: dineInCount },
      { Metric: "Parcel Orders", Value: parcelCount },
      { Metric: "", Value: "" },
      { Metric: "Staff Present Today", Value: presentStaff.length },
      { Metric: "Staff Present — Names", Value: namesOrNone(presentStaff) },
      { Metric: "Staff Half Day Today", Value: halfDayStaff.length },
      { Metric: "Staff Half Day — Names", Value: namesOrNone(halfDayStaff) },
      { Metric: "Staff Absent Today", Value: absentStaff.length },
      { Metric: "Staff Absent — Names", Value: namesOrNone(absentStaff) },
      { Metric: "Staff Not Marked Today", Value: notMarkedStaff.length },
      { Metric: "Staff Not Marked — Names", Value: namesOrNone(notMarkedStaff) },
      { Metric: "", Value: "" },
      { Metric: "Total GST Collected", Value: totalGST },
      { Metric: "Total Discounts Given", Value: totalDiscount },
      { Metric: "Occupied Tables (at export time)", Value: tables.filter((t) => t.status === "Occupied").length },
      { Metric: "Available Tables (at export time)", Value: tables.filter((t) => t.status === "Available").length }
    );
  } else {
    summaryRows.push(
      { Metric: "Total GST Collected", Value: totalGST },
      { Metric: "Total Discounts Given", Value: totalDiscount }
    );
  }

  // ---------- Orders ----------
  const orderRows = todaysOrders.map((o) => {
    const { subtotal, gst, total } = calcOrderTotals(o.items);
    return {
      "Order ID": o.id.slice(-8).toUpperCase(),
      ...(isParcelScope ? {} : { Type: o.orderType }),
      "Table / Customer": orderLabel(o),
      ...(o.customerPhone ? { Phone: o.customerPhone } : {}),
      "Waiter / Counter": o.waiterName,
      Items: o.items.length,
      Status: o.status,
      Subtotal: subtotal,
      GST: gst,
      Total: total,
      "Created At": new Date(o.createdAt).toLocaleTimeString("en-IN"),
    };
  });

  // ---------- Payments ----------
  const paymentRows = todaysPayments.map((p) => {
    const order = orders.find((o) => o.id === p.orderId);
    return {
      "Payment ID": p.id.slice(-8).toUpperCase(),
      "Table / Customer": order ? orderLabel(order) : "—",
      Method: p.method,
      Discount: p.discount,
      Coupon: p.couponCode ?? "—",
      GST: p.gst,
      "Amount Paid": p.amount,
      Time: new Date(p.createdAt).toLocaleTimeString("en-IN"),
    };
  });

  const wb = XLSX.utils.book_new();
  const addSheet = (rows: Record<string, unknown>[], name: string, fallbackNote: string) => {
    const sheet = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ Note: fallbackNote }]);
    XLSX.utils.book_append_sheet(wb, sheet, name);
  };

  addSheet(summaryRows, "Summary", "—");
  addSheet(orderRows, isParcelScope ? "Parcel Orders" : "Orders", isParcelScope ? "No parcel orders placed today" : "No orders placed today");
  addSheet(paymentRows, "Payments", "No bills generated today");
  addSheet(popularRows, "Popular Items", "No items sold today");

  // Staff attendance is restaurant-wide data — only include it in the full Admin report.
  if (!isParcelScope) {
    const staffRows = staff.map((s) => ({
      Name: s.name,
      Role: s.role,
      Username: s.username,
      Employment: s.status,
      "Today's Attendance": s.attendance,
      "Marked At": s.attendanceUpdatedAt ? new Date(s.attendanceUpdatedAt).toLocaleTimeString("en-IN") : "—",
    }));
    addSheet(staffRows, "Staff Attendance", "No staff on record");
  }

  const fileDate = date.toISOString().slice(0, 10);
  const fileLabel = isParcelScope ? "Parcel-Report" : "Daily-Report";
  XLSX.writeFile(wb, `Aaranya-Spice-${fileLabel}-${fileDate}.xlsx`);
}
