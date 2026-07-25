"use client";

import React, { useState, useEffect } from "react";
import { Engineer, AllowanceRecord } from "@/types/rdmp";

export default function AllowanceRecapReport() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [allowances, setAllowances] = useState<AllowanceRecord[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("July 2026");

  const loadRecapData = () => {
    Promise.all([
      fetch("/api/users").then((res) => res.json()),
      fetch("/api/allowances").then((res) => res.json()),
    ])
      .then(([uData, aData]) => {
        if (uData.success) setEngineers(uData.users);
        if (aData.success) setAllowances(aData.allowances);
      })
      .catch((err) => console.error("Error loading Allowance Recap data:", err))
      .finally(() => setMounted(true));
  };

  useEffect(() => {
    loadRecapData();
  }, []);

  // Recapitulation aggregation per engineer
  const recapData = engineers.map((eng) => {
    const engAllowances = allowances.filter(
      (a) => a.engineer_id === eng.id && a.payroll_period === selectedPeriod
    );

    const preFatDays = engAllowances.filter((a) => a.activity_type === "Pre-FAT").length;
    const fatDays = engAllowances.filter((a) => a.activity_type === "FAT").length;
    const satDays = engAllowances.filter((a) => a.activity_type === "SAT").length;
    const totalSiteDays = engAllowances.length;
    const totalAmount = engAllowances.reduce((sum, a) => sum + a.amount_idr, 0);

    const pendingCount = engAllowances.filter((a) => a.payroll_status === "Pending Payroll Approval").length;
    const approvedCount = engAllowances.filter((a) => a.payroll_status === "Approved for Payroll" || a.payroll_status === "Paid").length;

    return {
      engineer: eng,
      preFatDays,
      fatDays,
      satDays,
      totalSiteDays,
      totalAmount,
      pendingCount,
      approvedCount,
      engAllowances,
    };
  });

  const totalPayrollIDR = recapData.reduce((sum, r) => sum + r.totalAmount, 0);

  const handleExportCSV = () => {
    const headers = [
      "Employee Code",
      "Engineer Name",
      "Department",
      "Pre-FAT Days",
      "FAT Days",
      "SAT Days",
      "Total Site Days",
      "Allowance Rate (IDR)",
      "Total Payable Allowance (IDR)",
      "Payroll Period",
    ];

    const rows = recapData.map((r) => [
      r.engineer.employee_code,
      `"${r.engineer.name}"`,
      `"${r.engineer.department}"`,
      r.preFatDays,
      r.fatDays,
      r.satDays,
      r.totalSiteDays,
      150000,
      r.totalAmount,
      selectedPeriod,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SE_Onsite_Allowance_Recap_${selectedPeriod.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApproveAllForPayroll = async (engineerId: string) => {
    const engRecap = recapData.find((r) => r.engineer.id === engineerId);
    if (!engRecap) return;

    for (const alw of engRecap.engAllowances) {
      if (alw.payroll_status === "Pending Payroll Approval") {
        await fetch("/api/allowances", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ allowanceId: alw.id }),
        });
      }
    }

    loadRecapData();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📄 Payroll Allowance Recapitulation Report</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Automated finance handoff report for IDR 150,000/day Onsite Allowance payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
          >
            <option value="July 2026">July 2026 Period</option>
            <option value="August 2026">August 2026 Period</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            📥 Export to CSV / Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/30">
              <th className="py-3 px-4">Engineer Code</th>
              <th className="py-3 px-4">Engineer Name</th>
              <th className="py-3 px-4 text-center">Pre-FAT Days</th>
              <th className="py-3 px-4 text-center">FAT Days</th>
              <th className="py-3 px-4 text-center">SAT Days</th>
              <th className="py-3 px-4 text-center">Total Site Days</th>
              <th className="py-3 px-4 text-right">Calculated Allowance (IDR)</th>
              <th className="py-3 px-4 text-center">Approval Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {!mounted ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-gray-400">
                  Loading allowance recap report...
                </td>
              </tr>
            ) : (
              recapData.map((r) => (
                <tr key={r.engineer.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {r.engineer.employee_code}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{r.engineer.name}</div>
                    <div className="text-xs text-gray-400">{r.engineer.department}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-medium text-gray-800 dark:text-gray-200">
                    {r.preFatDays}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-medium text-gray-800 dark:text-gray-200">
                    {r.fatDays}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-medium text-gray-800 dark:text-gray-200">
                    {r.satDays}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold px-2.5 py-1 rounded-lg text-xs">
                      {r.totalSiteDays} Days
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    IDR {r.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {r.pendingCount > 0 ? (
                      <button
                        onClick={() => handleApproveAllForPayroll(r.engineer.id)}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow-2xs cursor-pointer"
                      >
                        Approve {r.pendingCount} Pending
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/50">
                        ✅ Payroll Approved
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {mounted && (
            <tfoot>
              <tr className="border-t-2 border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 font-bold">
                <td colSpan={6} className="py-4 px-4 text-right text-gray-700 dark:text-gray-300 uppercase text-xs">
                  Total Period Payroll Payout:
                </td>
                <td className="py-4 px-4 text-right text-emerald-600 dark:text-emerald-400 text-base">
                  IDR {totalPayrollIDR.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
