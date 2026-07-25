"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "@/context/RoleContext";
import { Engineer, TimesheetEntry, AllowanceRecord } from "@/types/rdmp";
import UtilizationHeatmap from "./UtilizationHeatmap";
import DeploymentTracker from "./DeploymentTracker";
import AllowanceRecapReport from "./AllowanceRecapReport";
import ApprovalQueue from "./ApprovalQueue";

export default function ManagerDashboard() {
  const { dataTick } = useRole();
  const [mounted, setMounted] = useState(false);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [allowances, setAllowances] = useState<AllowanceRecord[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/users").then((res) => res.json()),
      fetch("/api/timesheets").then((res) => res.json()),
      fetch("/api/allowances").then((res) => res.json()),
    ])
      .then(([uData, tData, aData]) => {
        if (uData.success) setEngineers(uData.users);
        if (tData.success) setTimesheets(tData.timesheets);
        if (aData.success) setAllowances(aData.allowances);
      })
      .catch((err) => console.error("Error loading Manager Dashboard data:", err))
      .finally(() => setMounted(true));
  }, [dataTick]);

  const totalEngineers = engineers.length;
  const onsiteTodayCount = timesheets.filter((t) => t.deployment_status === "Onsite").length;
  const pendingApprovals = timesheets.filter((t) => t.validation_status === "Flagged").length;
  const totalAllowanceAmount = allowances.reduce((sum, a) => sum + a.amount_idr, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-800 dark:from-emerald-950 dark:to-teal-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-emerald-500/30 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
              Access Level 2 — Manager & Supervisor Dashboard
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mt-2">
              Engineer Workload & Deployment Command Center
            </h1>
            <p className="text-emerald-100 text-sm mt-1">
              Resource Allocation Heatmaps | Onsite Deployment Tracking | Auto-Calculated Allowance Payroll Handoff
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
            <span className="text-xs text-emerald-200 block">Total Payroll Accrued</span>
            <span className="text-2xl font-bold text-white" suppressHydrationWarning>
              {mounted ? `IDR ${totalAllowanceAmount.toLocaleString("id-ID")}` : "IDR"}
            </span>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Managed Engineers</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white" suppressHydrationWarning>
              {mounted ? totalEngineers : "—"}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
              100% Active
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Onsite Deployed</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400" suppressHydrationWarning>
              {mounted ? onsiteTodayCount : "—"}
            </span>
            <span className="text-xs text-gray-400">Pre-FAT / FAT / SAT</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Pending Manager Approvals</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className={`text-2xl font-bold ${mounted && pendingApprovals > 0 ? "text-amber-500" : "text-gray-900 dark:text-white"}`} suppressHydrationWarning>
              {mounted ? pendingApprovals : "—"}
            </span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
              Soft Warnings
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Average Capacity Load</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">82%</span>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
              Balanced
            </span>
          </div>
        </div>
      </div>

      {/* Utilization Heatmap */}
      <div id="heatmap" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
        <UtilizationHeatmap />
      </div>

      {/* Deployment Tracker */}
      <div id="deployment" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
        <DeploymentTracker />
      </div>

      {/* Approval Queue */}
      <div id="approval" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
        <ApprovalQueue />
      </div>

      {/* Allowance Recapitulation Report */}
      <div id="recap" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
        <AllowanceRecapReport />
      </div>
    </div>
  );
}
