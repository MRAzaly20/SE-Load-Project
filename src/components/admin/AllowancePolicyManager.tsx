"use client";

import React, { useState, useEffect } from "react";
import { AllowancePolicy } from "@/types/rdmp";
import { useRole } from "@/context/RoleContext";

export default function AllowancePolicyManager() {
  const { refreshData, dataTick } = useRole();
  const [policies, setPolicies] = useState<AllowancePolicy[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<number>(150000);

  const loadPolicies = () => {
    fetch("/api/policies")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPolicies(data.policies);
      })
      .catch((err) => console.error("Error fetching policies:", err));
  };

  useEffect(() => {
    loadPolicies();
  }, [dataTick]);

  const handleSaveRate = (policyId: string) => {
    fetch("/api/policies", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ policyId, amount_idr: editAmount }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          loadPolicies();
          refreshData();
          setEditingId(null);
        }
      })
      .catch((err) => console.error("Error updating policy rate:", err));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>⚙️ Versioned Allowance Policy Configuration</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Audit-protected policy engine governing onsite allowance calculations across Pre-FAT, FAT, and SAT.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/30">
              <th className="py-3 px-4">Activity Category</th>
              <th className="py-3 px-4">Standard Rate (IDR/day)</th>
              <th className="py-3 px-4">Effective Date Range</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {policies.map((pol) => (
              <tr key={pol.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                <td className="py-3 px-4">
                  <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-lg text-xs border border-emerald-200/50">
                    {pol.activity_type}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                  {editingId === pol.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs">IDR</span>
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(Number(e.target.value))}
                        className="w-32 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-1.5 font-bold"
                      />
                    </div>
                  ) : (
                    `IDR ${pol.amount_idr.toLocaleString()}`
                  )}
                </td>
                <td className="py-3 px-4 font-mono text-xs text-gray-500">
                  {pol.effective_from} ~ {pol.effective_to || "Present (Active)"}
                </td>
                <td className="py-3 px-4 text-xs text-gray-600 dark:text-gray-400">
                  {pol.description}
                </td>
                <td className="py-3 px-4 text-center">
                  {editingId === pol.id ? (
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleSaveRate(pol.id)}
                        className="px-2.5 py-1 bg-emerald-600 text-white font-semibold text-xs rounded-lg cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 bg-gray-200 text-gray-700 font-semibold text-xs rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(pol.id);
                        setEditAmount(pol.amount_idr);
                      }}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-xs rounded-xl cursor-pointer"
                    >
                      ✏️ Edit Rate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
