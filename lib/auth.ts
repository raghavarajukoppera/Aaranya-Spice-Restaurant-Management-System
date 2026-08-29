import { Role, User } from "./types";

interface Credential {
  username: string;
  password: string;
  user: User;
}

export const CREDENTIALS: Credential[] = [
  {
    username: "admin",
    password: "admin123",
    user: { id: "u_admin", name: "Ravi Kumar", username: "admin", role: "admin" },
  },
  {
    username: "waiter",
    password: "waiter123",
    user: { id: "u_waiter", name: "Ananya Rao", username: "waiter", role: "waiter" },
  },
  {
    username: "kitchen",
    password: "kitchen123",
    user: { id: "u_kitchen", name: "Chef Suresh", username: "kitchen", role: "kitchen" },
  },
  {
    username: "counter",
    password: "counter123",
    user: { id: "u_counter", name: "Aditya Verma", username: "counter", role: "counter" },
  },
];

export function verifyLogin(username: string, password: string, expectedRole?: Role): User | null {
  const match = CREDENTIALS.find(
    (c) => c.username === username.trim().toLowerCase() && c.password === password
  );
  if (!match) return null;
  if (expectedRole && match.user.role !== expectedRole) return null;
  return match.user;
}

export function dashboardPathForRole(role: Role): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "waiter":
      return "/waiter/dashboard";
    case "kitchen":
      return "/kitchen/dashboard";
    case "counter":
      return "/counter/dashboard";
  }
}
