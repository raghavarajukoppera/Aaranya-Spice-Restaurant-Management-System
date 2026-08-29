"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import Card from "@/components/ui/Card";
import { Order } from "@/lib/types";

const COLORS = ["#C1440E", "#E8A33D", "#7A1F1F", "#D19A52", "#3F7D4C"];

const fallback = [
  { name: "Butter Chicken", qty: 42 },
  { name: "Paneer Tikka", qty: 35 },
  { name: "Biryani", qty: 31 },
  { name: "Masala Dosa", qty: 26 },
  { name: "Gulab Jamun", qty: 19 },
];

export default function PopularItemsChart({ orders }: { orders: Order[] }) {
  const tally = new Map<string, number>();
  orders.forEach((o) => o.items.forEach((it) => tally.set(it.name, (tally.get(it.name) ?? 0) + it.quantity)));

  const data =
    tally.size > 0
      ? Array.from(tally.entries())
          .map(([name, qty]) => ({ name, qty }))
          .sort((a, b) => b.qty - a.qty)
          .slice(0, 5)
      : fallback;

  return (
    <Card className="animate-fade-in">
      <div className="mb-4">
        <h3 className="font-display text-base font-semibold text-ink">Popular Items</h3>
        <p className="text-xs text-ink/45">Top sellers by quantity</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E9D3AE" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: "#2B211C99" }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: "#2B211C" }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #E9D3AE", fontSize: 12 }}
              cursor={{ fill: "#F5EBDB" }}
            />
            <Bar dataKey="qty" radius={[0, 8, 8, 0]} barSize={16}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
