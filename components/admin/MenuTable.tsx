"use client";

import { useMemo, useState } from "react";
import { Search, Pencil, Trash2, Leaf, Beef, ChevronLeft, ChevronRight } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { FoodItem } from "@/lib/types";
import { FOOD_CATEGORIES, MEAL_TIMES } from "@/data/menuData";
import { formatCurrency, cn } from "@/lib/utils";

const PAGE_SIZE = 6;

export default function MenuTable({
  menu,
  onEdit,
  onDelete,
  onToggleAvailability,
}: {
  menu: FoodItem[];
  onEdit: (item: FoodItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (item: FoodItem) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [mealTime, setMealTime] = useState("All");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<FoodItem | null>(null);

  const filtered = useMemo(() => {
    return menu.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || item.category === category;
      const matchesMealTime = mealTime === "All" || item.mealTime === mealTime;
      return matchesSearch && matchesCategory && matchesMealTime;
    });
  }, [menu, search, category, mealTime]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateSearch(v: string) {
    setSearch(v);
    setPage(1);
  }
  function updateCategory(v: string) {
    setCategory(v);
    setPage(1);
  }
  function updateMealTime(v: string) {
    setMealTime(v);
    setPage(1);
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search food items..."
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => updateSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={category} onChange={(e) => updateCategory(e.target.value)} className="sm:max-w-[200px]">
          <option value="All">All Categories</option>
          {FOOD_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select value={mealTime} onChange={(e) => updateMealTime(e.target.value)} className="sm:max-w-[170px]">
          <option value="All">All Meal Times</option>
          {MEAL_TIMES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
        <span className="ml-auto text-xs font-medium text-ink/45">
          {filtered.length} item{filtered.length !== 1 && "s"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-spice-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-spice-100 bg-spice-50/60 text-left text-xs uppercase tracking-wide text-ink/45">
              <th className="px-4 py-3 font-semibold">Item</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Meal Time</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Availability</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item) => (
              <tr key={item.id} className="border-b border-spice-50 last:border-0 hover:bg-spice-50/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover shadow-card" />
                    <span className="font-medium text-ink">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink/65">{item.category}</td>
                <td className="px-4 py-3">
                  <Badge tone="spice">{item.mealTime}</Badge>
                </td>
                <td className="px-4 py-3 font-semibold text-ink">{formatCurrency(item.price)}</td>
                <td className="px-4 py-3">
                  {item.isVeg ? (
                    <Badge tone="green" dot>
                      <Leaf className="h-3 w-3" /> Veg
                    </Badge>
                  ) : (
                    <Badge tone="red" dot>
                      <Beef className="h-3 w-3" /> Non-Veg
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onToggleAvailability(item)}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors focus-ring",
                      item.available ? "bg-leaf-500" : "bg-ink/20"
                    )}
                    aria-label="Toggle availability"
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                        item.available ? "translate-x-5" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => onEdit(item)} icon={<Pencil className="h-3.5 w-3.5" />}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setPendingDelete(item)}
                      icon={<Trash2 className="h-3.5 w-3.5" />}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-ink/40">
                  No items match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-ink/45">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)} icon={<ChevronLeft className="h-3.5 w-3.5" />}>
              Prev
            </Button>
            <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete food item"
        description={`Remove "${pendingDelete?.name}" from the menu? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={() => pendingDelete && onDelete(pendingDelete.id)}
      />
    </div>
  );
}
