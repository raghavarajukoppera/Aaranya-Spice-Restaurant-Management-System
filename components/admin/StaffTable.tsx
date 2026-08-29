"use client";

import { ShieldCheck, UtensilsCrossed, Soup, Package } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import { AttendanceStatus, StaffMember } from "@/lib/types";
import { formatTime } from "@/lib/utils";

const ROLE_ICON = { admin: ShieldCheck, waiter: UtensilsCrossed, kitchen: Soup, counter: Package } as const;

const ATTENDANCE_OPTIONS: AttendanceStatus[] = ["Not Marked", "Present", "Half Day", "Absent"];

const ATTENDANCE_TONE: Record<AttendanceStatus, "green" | "yellow" | "red" | "neutral"> = {
  Present: "green",
  "Half Day": "yellow",
  Absent: "red",
  "Not Marked": "neutral",
};

export default function StaffTable({
  staff,
  onAttendanceChange,
}: {
  staff: StaffMember[];
  onAttendanceChange: (staffId: string, attendance: AttendanceStatus) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-spice-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-spice-100 bg-spice-50/60 text-left text-xs uppercase tracking-wide text-ink/45">
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Username</th>
            <th className="px-4 py-3 font-semibold">Employment</th>
            <th className="px-4 py-3 font-semibold">Today&apos; Attendance</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => {
            const Icon = ROLE_ICON[s.role];
            return (
              <tr key={s.id} className="border-b border-spice-50 last:border-0 hover:bg-spice-50/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-spice-500 text-xs font-bold text-white">
                      {s.name.charAt(0)}
                    </div>
                    <span className="font-medium text-ink">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 capitalize text-ink/65">
                    <Icon className="h-3.5 w-3.5" /> {s.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink/60">@{s.username}</td>
                <td className="px-4 py-3">
                  <Badge tone={s.status === "Active" ? "green" : "neutral"} dot>
                    {s.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Select
                      value={s.attendance}
                      onChange={(e) => onAttendanceChange(s.id, e.target.value as AttendanceStatus)}
                      className="w-[150px] py-1.5 text-xs"
                    >
                      {ATTENDANCE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                    <Badge tone={ATTENDANCE_TONE[s.attendance]} dot>
                      {s.attendance}
                    </Badge>
                  </div>
                  {s.attendanceUpdatedAt && (
                    <p className="mt-1 text-[11px] text-ink/35">Updated {formatTime(s.attendanceUpdatedAt)}</p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
