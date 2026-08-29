"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Card from "@/components/ui/Card";

const sampleWeeklySales = [
  { day: "Mon", revenue: 18400 },
  { day: "Tue", revenue: 15200 },
  { day: "Wed", revenue: 21800 },
  { day: "Thu", revenue: 19600 },
  { day: "Fri", revenue: 27300 },
  { day: "Sat", revenue: 34500 },
  { day: "Sun", revenue: 29800 },
];

export default function SalesChart({ todayRevenue }: { todayRevenue: number }) {
  const data = [...sampleWeeklySales];
  data[data.length - 1] = { ...data[data.length - 1], revenue: data[data.length - 1].revenue + todayRevenue };

  return (
    <Card className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-ink">Sales Overview</h3>
          <p className="text-xs text-ink/45">Revenue trend, last 7 days</p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C1440E" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#C1440E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E9D3AE" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#2B211C99" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#2B211C99" }} axisLine={false} tickLine={false} width={50} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E9D3AE",
                fontSize: 12,
              }}
              formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#C1440E" strokeWidth={2.5} fill="url(#salesFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
