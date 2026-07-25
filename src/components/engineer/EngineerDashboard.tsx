"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "@/context/RoleContext";
import { TimesheetEntry, AllowanceRecord } from "@/types/rdmp";
import TimesheetSyncView from "./TimesheetSyncView";
import AllowanceTrackerView from "./AllowanceTrackerView";

export default function EngineerDashboard() {
  const { currentEngineer, dataTick } = useRole();
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [allowances, setAllowances] = useState<AllowanceRecord[]>([]);

  useEffect(() => {
    if (!currentEngineer) return;
    Promise.all([
      fetch(`/api/timesheets?engineerId=${currentEngineer.id}`).then((res) => res.json()),
      fetch(`/api/allowances?engineerId=${currentEngineer.id}`).then((res) => res.json()),
    ])
      .then(([tData, aData]) => {
        if (tData.success) setTimesheets(tData.timesheets);
        if (aData.success) setAllowances(aData.allowances);
      })
      .catch((err) => console.error("Error fetching engineer dashboard data:", err));
  }, [currentEngineer, dataTick]);

  if (!currentEngineer) {
    return <div className="p-4 text-gray-500">No engineer profile selected.</div>;
  }

  // Calculated Metrics
  const totalHoursLogged = timesheets.reduce((acc, curr) => acc + curr.hours_logged, 0);
  const validatedCount = timesheets.filter((t) => t.validation_status === "Validated" || t.validation_status === "Approved").length;
  const pendingCount = timesheets.filter((t) => t.validation_status === "Pending Review" || t.validation_status === "Flagged").length;
  const totalAllowanceIDR = allowances.reduce((acc, curr) => acc + curr.amount_idr, 0);
  const approvedAllowanceIDR = allowances
    .filter((a) => a.payroll_status === "Approved for Payroll" || a.payroll_status === "Paid")
    .reduce((acc, curr) => acc + curr.amount_idr, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 dark:from-emerald-950 dark:to-teal-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-emerald-500/30 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
              Access Level 1 — Engineer Portal (PWA)
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mt-2">
              Welcome back, {currentEngineer.name}
            </h1>
            <p className="text-emerald-100 text-sm mt-1">
              Employee Code: <span className="font-mono font-medium">{currentEngineer.employee_code}</span> | Department: {currentEngineer.department}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
            <span className="text-xs text-emerald-200 block">Current Payroll Accrual</span>
            <span className="text-2xl font-bold text-white">
              IDR {totalAllowanceIDR.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Hours Logged (Current Period)</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalHoursLogged} hrs</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
              Cap: {currentEngineer.capacity_hours_per_week}h/wk
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Validated Entries</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{validatedCount}</span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Out of {timesheets.length} submissions</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Pending / Flagged Entries</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className={`text-2xl font-bold ${pendingCount > 0 ? "text-amber-500" : "text-gray-900 dark:text-white"}`}>
              {pendingCount}
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
              Requires Manager Sign-off
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Approved for Payroll</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
              IDR {approvedAllowanceIDR.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">Ready for HR</span>
          </div>
        </div>
      </div>

      {/* Timesheet Sync View & Form Submission */}
      <div id="timesheet" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
        <TimesheetSyncView />
      </div>

      {/* Allowance Tracker View */}
      <div id="allowance" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
        <AllowanceTrackerView />
      </div>
    </div>
  );
}
