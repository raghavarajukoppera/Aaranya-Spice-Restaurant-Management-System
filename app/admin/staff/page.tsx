"use client";

import { useState } from "react";
import { UserCheck, UserMinus, UserX, HelpCircle, FileSpreadsheet } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatCard from "@/components/admin/StatCard";
import StaffTable from "@/components/admin/StaffTable";
import { useRestaurant } from "@/context/RestaurantContext";
import { useToast } from "@/context/ToastContext";
import { AttendanceStatus } from "@/lib/types";
import { exportDailyReportToExcel } from "@/lib/exportReport";

export default function AdminStaffPage() {
  const { staff, updateAttendance, orders, payments, tables } = useRestaurant();
  const { showToast } = useToast();
  const [exporting, setExporting] = useState(false);

  const present = staff.filter((s) => s.attendance === "Present").length;
  const halfDay = staff.filter((s) => s.attendance === "Half Day").length;
  const absent = staff.filter((s) => s.attendance === "Absent").length;
  const notMarked = staff.filter((s) => s.attendance === "Not Marked").length;

  function handleAttendanceChange(staffId: string, attendance: AttendanceStatus) {
    updateAttendance(staffId, attendance);
    const staffMember = staff.find((s) => s.id === staffId);
    showToast(`${staffMember?.name} marked as ${attendance} for today.`, "success");
  }

  function handleExport() {
    setExporting(true);
    try {
      exportDailyReportToExcel({ orders, payments, staff, tables });
      showToast("Today's report (including staff attendance) has been downloaded.", "success");
    } catch {
      showToast("Couldn't generate the report. Please try again.", "error");
    } finally {
      setExporting(false);
    }
  }

  return (
    <DashboardShell role="admin" title="Manage Staff">
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Present Today" value={String(present)} icon={UserCheck} tone="leaf" />
          <StatCard label="Half Day" value={String(halfDay)} icon={UserMinus} tone="saffron" />
          <StatCard label="Absent" value={String(absent)} icon={UserX} tone="maroon" />
          <StatCard label="Not Marked Yet" value={String(notMarked)} icon={HelpCircle} tone="spice" />
        </div>

        <Card className="animate-fade-in">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Team Directory</h2>
              <p className="text-xs text-ink/45">
               Everyone with access to the Aaranya Spice workspace. Update each person&apos;s attendance for today using the dropdown.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              icon={<FileSpreadsheet className="h-3.5 w-3.5" />}
              onClick={handleExport}
              loading={exporting}
            >
              Export Today&apos;s Report
            </Button>
          </div>
          <StaffTable staff={staff} onAttendanceChange={handleAttendanceChange} />
        </Card>
      </div>
    </DashboardShell>
  );
}
