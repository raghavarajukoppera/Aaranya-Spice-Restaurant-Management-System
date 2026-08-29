"use client";

import { FormEvent, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { User, Phone } from "lucide-react";

export default function NewParcelOrderModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (customerName: string, customerPhone?: string) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), phone.trim() || undefined);
    setName("");
    setPhone("");
  }

  return (
    <Modal open={open} onClose={onClose} title="New Parcel Order" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Customer Name"
          placeholder="e.g. Rohit Sharma"
          icon={<User className="h-4 w-4" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />
        <Input
          label="Phone Number (optional)"
          placeholder="e.g. 98765 43210"
          icon={<Phone className="h-4 w-4" />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Start Order</Button>
        </div>
      </form>
    </Modal>
  );
}
