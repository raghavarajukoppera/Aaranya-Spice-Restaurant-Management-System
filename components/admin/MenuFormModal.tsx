"use client";

import { FormEvent, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { FoodItem, FoodCategory, MealTime } from "@/lib/types";
import { FOOD_CATEGORIES, MEAL_TIMES } from "@/data/menuData";

interface MenuFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<FoodItem, "id">) => void;
  initial?: FoodItem;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80";

export default function MenuFormModal({ open, onClose, onSubmit, initial }: MenuFormModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FoodCategory>("Main Course");
  const [mealTime, setMealTime] = useState<MealTime>("All Day");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [isVeg, setIsVeg] = useState(true);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setCategory(initial?.category ?? "Main Course");
      setMealTime(initial?.mealTime ?? "All Day");
      setPrice(initial ? String(initial.price) : "");
      setImage(initial?.image ?? "");
      setIsVeg(initial?.isVeg ?? true);
      setAvailable(initial?.available ?? true);
    }
  }, [open, initial]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price) return;
    onSubmit({
      name: name.trim(),
      category,
      mealTime,
      price: Number(price),
      image: image.trim() || DEFAULT_IMAGE,
      isVeg,
      available,
    });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Food Item" : "Add Food Item"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={image.trim() || DEFAULT_IMAGE}
            alt="preview"
            className="h-16 w-16 shrink-0 rounded-xl object-cover shadow-card"
          />
          <Input
            label="Image URL"
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="flex-1"
          />
        </div>

        <Input label="Food Name" placeholder="e.g. Paneer Tikka" value={name} onChange={(e) => setName(e.target.value)} required />

        <div className="grid grid-cols-2 gap-3">
          <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value as FoodCategory)}>
            {FOOD_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select label="Meal Time" value={mealTime} onChange={(e) => setMealTime(e.target.value as MealTime)}>
            {MEAL_TIMES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Price (₹)"
          type="number"
          min={0}
          placeholder="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm font-medium text-ink/75">
            <input
              type="checkbox"
              checked={isVeg}
              onChange={(e) => setIsVeg(e.target.checked)}
              className="h-4 w-4 accent-leaf-500"
            />
            Vegetarian
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-ink/75">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="h-4 w-4 accent-spice-500"
            />
            Available
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initial ? "Save Changes" : "Add Item"}</Button>
        </div>
      </form>
    </Modal>
  );
}
