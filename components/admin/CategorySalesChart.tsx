"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Card from "@/components/ui/Card";
import { FoodItem, Order } from "@/lib/types";

const COLORS = ["#C1440E", "#E8A33D", "#7A1F1F", "#3F7D4C", "#D19A52", "#8A2F0A", "#F0B94D"];

const fallback = [
  { name: "North Indian", value: 32 },
  { name: "South Indian", value: 24 },
  { name: "Chinese", value: 18 },
  { name: "Starters", value: 14 },
  { name: "Desserts", value: 8 },
  { name: "Beverages", value: 4 },
];

export default function CategorySalesChart({ orders, menu }: { orders: Order[]; menu: FoodItem[] }) {
  const tally = new Map<string, number>();
  orders.forEach((o) =>
    o.items.forEach((it) => {
      const food = menu.find((f) => f.id === it.foodId);
      const cat = food?.category ?? "Other";
      tally.set(cat, (tally.get(cat) ?? 0) + it.quantity);
    })
  );

  const data = tally.size > 0 ? Array.from(tally.entries()).map(([name, value]) => ({ name, value })) : fallback;

  return (
    <Card className="animate-fade-in">
      <div className="mb-2">
        <h3 className="font-display text-base font-semibold text-ink">Category Sales</h3>
        <p className="text-xs text-ink/45">Share of orders by category</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E9D3AE", fontSize: 12 }} />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 11, color: "#2B211C99" }}
              layout="horizontal"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
