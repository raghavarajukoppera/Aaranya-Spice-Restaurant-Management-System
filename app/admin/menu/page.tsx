"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import MenuTable from "@/components/admin/MenuTable";
import MenuFormModal from "@/components/admin/MenuFormModal";
import { useRestaurant } from "@/context/RestaurantContext";
import { useToast } from "@/context/ToastContext";
import { FoodItem } from "@/lib/types";

export default function AdminMenuPage() {
  const { menu, addFood, updateFood, deleteFood } = useRestaurant();
  const { showToast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FoodItem | undefined>(undefined);

  return (
    <DashboardShell role="admin" title="Menu Management">
      <div className="pt-2">
        <Card className="animate-fade-in">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Food Items</h2>
              <p className="text-xs text-ink/45">Add, edit, or remove dishes from the live menu.</p>
            </div>
            <Button
              icon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setEditing(undefined);
                setFormOpen(true);
              }}
            >
              Add Food
            </Button>
          </div>

          <MenuTable
            menu={menu}
            onEdit={(item) => {
              setEditing(item);
              setFormOpen(true);
            }}
            onDelete={(id) => {
              deleteFood(id);
              showToast("Food item deleted.", "success");
            }}
            onToggleAvailability={(item) => {
              updateFood(item.id, { available: !item.available });
              showToast(
                `${item.name} marked as ${!item.available ? "available" : "unavailable"}.`,
                "info"
              );
            }}
          />
        </Card>
      </div>

      <MenuFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
        onSubmit={(data) => {
          if (editing) {
            updateFood(editing.id, data);
            showToast("Food item updated.", "success");
          } else {
            addFood(data);
            showToast("Food item added to the menu.", "success");
          }
        }}
      />
    </DashboardShell>
  );
}
