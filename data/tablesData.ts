import { RestaurantTable, StaffMember } from "@/lib/types";

export const initialTables: RestaurantTable[] = Array.from({ length: 12 }, (_, i) => {
  const number = i + 1;
  const capacities = [2, 2, 4, 4, 4, 6, 2, 4, 6, 4, 2, 8];
  return {
    id: `t${number}`,
    number,
    capacity: capacities[i],
    status: "Available",
  } as RestaurantTable;
});

export const initialStaff: StaffMember[] = [
  { id: "s1", name: "Ravi Kumar", role: "admin", username: "admin", status: "Active", attendance: "Not Marked" },
  { id: "s2", name: "Ananya Rao", role: "waiter", username: "waiter", status: "Active", attendance: "Not Marked" },
  { id: "s3", name: "Chef Suresh", role: "kitchen", username: "kitchen", status: "Active", attendance: "Not Marked" },
  { id: "s4", name: "Aditya Verma", role: "counter", username: "counter", status: "Active", attendance: "Not Marked" },
  { id: "s5", name: "Meera Nair", role: "waiter", username: "meera", status: "Off Duty", attendance: "Not Marked" },
  { id: "s6", name: "Chef Divya", role: "kitchen", username: "divya", status: "Off Duty", attendance: "Not Marked" },
];
