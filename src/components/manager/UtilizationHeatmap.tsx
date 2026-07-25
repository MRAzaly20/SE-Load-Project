"use client";

import React, { useState, useEffect } from "react";
import { Engineer, TimesheetEntry, ResourceAllocation } from "@/types/rdmp";

export default function UtilizationHeatmap() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [allocations, setAllocations] = useState<ResourceAllocation[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/users").then((res) => res.json()),
      fetch("/api/timesheets").then((res) => res.json()),
      fetch("/api/allocations").then((res) => res.json()),
    ])
      .then(([uData, tData, aData]) => {
        if (uData.success) setEngineers(uData.users);
        if (tData.success) setTimesheets(tData.timesheets);
        if (aData.success) setAllocations(aData.allocations);
      })
      .catch((err) => console.error("Error loading Heatmap data:", err))
      .finally(() => setMounted(true));
  }, []);

  // Simulated 4 weeks in July 2026
  const weeks = [
    { label: "Week 1 (Jul 1-5)", dates: ["2026-07-01", "2026-07-02", "2026-07-03"] },
    { label: "Week 2 (Jul 6-12)", dates: ["2026-07-07", "2026-07-08", "2026-07-09", "2026-07-10"] },
    { label: "Week 3 (Jul 13-19)", dates: ["2026-07-14", "2026-07-15", "2026-07-16", "2026-07-17"] },
    { label: "Week 4 (Jul 20-26)", dates: ["2026-07-21", "2026-07-22", "2026-07-23", "2026-07-24"] },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📊 Engineer Resource Utilization Heatmap</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Engineer × Week capacity utilization matrix (Logged Hours vs 40h Weekly Capacity).
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-100 border border-emerald-300"></span> Under (&lt;70%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-500 text-white font-bold"></span> Optimal (70-100%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-rose-500 text-white font-bold"></span> Over (&gt;100%)
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/30">
              <th className="py-3 px-4">Engineer</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4 text-center">FTE Allocation</th>
              {weeks.map((w) => (
                <th key={w.label} className="py-3 px-4 text-center">
                  {w.label}
                </th>
              ))}
              <th className="py-3 px-4 text-center">Avg Utilization</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {!mounted ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-gray-400">
                  Loading heatmap data...
                </td>
              </tr>
            ) : (
              engineers.map((eng) => {
                const engAllocations = allocations.filter((a) => a.engineer_id === eng.id);
                const totalFTE = engAllocations.reduce((sum, a) => sum + a.allocation_pct, 0);
                const engTs = timesheets.filter((t) => t.engineer_id === eng.id);

                const weekStats = weeks.map((w) => {
                  const loggedInWeek = engTs
                    .filter((t) => w.dates.includes(t.work_date))
                    .reduce((sum, t) => sum + t.hours_logged, 0);
                  const capacityWeek = 40; // 40h capacity
                  const pct = Math.round((loggedInWeek / capacityWeek) * 100);
                  return { logged: loggedInWeek, pct };
                });

                const avgPct = Math.round(
                  weekStats.reduce((sum, w) => sum + w.pct, 0) / weeks.length
                );

                return (
                  <tr key={eng.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{eng.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{eng.employee_code}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600 dark:text-gray-400">
                      {eng.department}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-gray-800 dark:text-gray-200">
                        {totalFTE}% FTE
                      </span>
                    </td>

                    {weekStats.map((st, idx) => {
                      let cellBg = "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300";
                      if (st.pct >= 70 && st.pct <= 100) {
                        cellBg = "bg-emerald-600 text-white font-bold";
                      } else if (st.pct > 100) {
                        cellBg = "bg-rose-600 text-white font-bold";
                      } else if (st.pct === 0) {
                        cellBg = "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500";
                      }

                      return (
                        <td key={idx} className="py-3 px-4 text-center">
                          <div className={`mx-auto px-3 py-1.5 rounded-xl text-xs font-mono transition-transform hover:scale-105 shadow-2xs ${cellBg}`}>
                            <div>{st.logged}h</div>
                            <div className="text-[10px] opacity-80">{st.pct}%</div>
                          </div>
                        </td>
                      );
                    })}

                    <td className="py-3 px-4 text-center font-bold text-gray-900 dark:text-white">
                      {avgPct}%
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
