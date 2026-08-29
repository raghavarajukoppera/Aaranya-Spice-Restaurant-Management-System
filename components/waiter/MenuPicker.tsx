"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Minus, Leaf, Beef, ShoppingCart } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { FoodItem, MealTime } from "@/lib/types";
import { FOOD_CATEGORIES, MEAL_TIMES } from "@/data/menuData";
import { formatCurrency, cn } from "@/lib/utils";

function suggestedMealTime(): MealTime | "All" {
  const hour = new Date().getHours();
  if (hour < 11) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Dinner";
}

export default function MenuPicker({
  menu,
  onAdd,
}: {
  menu: FoodItem[];
  onAdd: (item: { foodId: string; quantity: number; notes?: string }) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [mealTime, setMealTime] = useState<MealTime | "All">(() => suggestedMealTime());
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return menu
      .filter((f) => f.available)
      .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
      .filter((f) => category === "All" || f.category === category)
      .filter((f) => mealTime === "All" || f.mealTime === mealTime || f.mealTime === "All Day");
  }, [menu, search, category, mealTime]);

  function getQty(id: string) {
    return qtyMap[id] ?? 1;
  }

  function setQty(id: string, qty: number) {
    setQtyMap((prev) => ({ ...prev, [id]: Math.max(1, qty) }));
  }

  function handleAdd(item: FoodItem) {
    onAdd({ foodId: item.id, quantity: getQty(item.id), notes: notesMap[item.id]?.trim() || undefined });
    setQtyMap((prev) => ({ ...prev, [item.id]: 1 }));
    setNotesMap((prev) => ({ ...prev, [item.id]: "" }));
    setExpanded(null);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(["All", ...MEAL_TIMES] as const).map((mt) => (
          <button
            key={mt}
            type="button"
            onClick={() => setMealTime(mt)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition-all focus-ring",
              mealTime === mt
                ? "border-spice-500 bg-spice-500 text-white"
                : "border-spice-200 bg-white/50 text-ink/60 hover:bg-white"
            )}
          >
            {mt}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Search dishes..."
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-[220px]"
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:max-w-[190px]">
          <option value="All">All Categories</option>
          {FOOD_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      <div className="max-h-[26rem] space-y-2 overflow-y-auto pr-1">
        {filtered.map((item) => {
          const isExpanded = expanded === item.id;
          return (
            <div
              key={item.id}
              className={cn(
                "rounded-xl border border-spice-100 bg-white/55 p-3 transition-all",
                isExpanded && "border-spice-300 bg-white/80"
              )}
            >
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="h-11 w-11 shrink-0 rounded-lg object-cover shadow-card" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                    {item.isVeg ? (
                      <Leaf className="h-3 w-3 shrink-0 text-leaf-500" />
                    ) : (
                      <Beef className="h-3 w-3 shrink-0 text-maroon-600" />
                    )}
                  </div>
                  <p className="text-xs text-ink/45">
                    {item.category} · {formatCurrency(item.price)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={isExpanded ? "primary" : "outline"}
                  icon={<Plus className="h-3.5 w-3.5" />}
                  onClick={() => setExpanded(isExpanded ? null : item.id)}
                >
                  Add
                </Button>
              </div>

              {isExpanded && (
                <div className="mt-3 flex flex-col gap-2 border-t border-spice-100 pt-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-ink/60">Quantity</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQty(item.id, getQty(item.id) - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-spice-200 text-ink/60 hover:bg-spice-100 focus-ring"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-ink">{getQty(item.id)}</span>
                      <button
                        onClick={() => setQty(item.id, getQty(item.id) + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-spice-200 text-ink/60 hover:bg-spice-100 focus-ring"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <Input
                    placeholder="Special instructions (optional)"
                    value={notesMap[item.id] ?? ""}
                    onChange={(e) => setNotesMap((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  />
                  <Button size="sm" icon={<ShoppingCart className="h-3.5 w-3.5" />} onClick={() => handleAdd(item)}>
                    Add {getQty(item.id)} to Order — {formatCurrency(item.price * getQty(item.id))}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-ink/40">No dishes match your search.</p>
        )}
      </div>
    </div>
  );
}
