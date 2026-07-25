"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "@/context/RoleContext";
import { AllowanceRecord } from "@/types/rdmp";

export default function AllowanceTrackerView() {
  const { currentEngineer, dataTick } = useRole();
  const [allowances, setAllowances] = useState<AllowanceRecord[]>([]);

  useEffect(() => {
    if (!currentEngineer) return;
    fetch(`/api/allowances?engineerId=${currentEngineer.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAllowances(data.allowances);
      })
      .catch((err) => console.error("Error fetching allowances:", err));
  }, [currentEngineer, dataTick]);

  const totalAmount = allowances.reduce((sum, item) => sum + item.amount_idr, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>💰 Onsite Allowance Tracker</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 rounded-md font-semibold">
              IDR 150,000 / Day
            </span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Auto-calculated allowances for validated Pre-FAT, FAT, and SAT site activities.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-500 dark:text-gray-400 block">Total Accrued (July 2026)</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            IDR {totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/30">
              <th className="py-3 px-4">Work Date</th>
              <th className="py-3 px-4">Activity Category</th>
              <th className="py-3 px-4">Standard Rate</th>
              <th className="py-3 px-4">Calculated Allowance</th>
              <th className="py-3 px-4">Payroll Status</th>
              <th className="py-3 px-4">Payroll Period</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {allowances.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                  No onsite allowance records accrued yet for this period.
                </td>
              </tr>
            ) : (
              allowances.map((alw) => (
                <tr key={alw.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-gray-700 dark:text-gray-300">
                    {alw.work_date}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-200/50">
                      {alw.activity_type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500">
                    IDR 150,000/day
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                    IDR {alw.amount_idr.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        alw.payroll_status === "Approved for Payroll" || alw.payroll_status === "Paid"
                          ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200/50"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/50"
                      }`}
                    >
                      {alw.payroll_status === "Approved for Payroll" ? "✅ Approved" : "⏳ Pending Approval"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-gray-600 dark:text-gray-400">
                    {alw.payroll_period}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-3 border border-gray-200/60 dark:border-gray-700/60 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
        <span>💡 <strong>Audit Control:</strong> Allowance records are generated automatically from validated timesheet entries. Manual entries are disabled to prevent payroll discrepancies.</span>
      </div>
    </div>
  );
}
