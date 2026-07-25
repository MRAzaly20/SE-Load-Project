"use client";

import React, { useState, useEffect } from "react";
import { AuditLog } from "@/types/rdmp";
import { useRole } from "@/context/RoleContext";

export default function AuditLogViewer() {
  const { dataTick } = useRole();
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    fetch("/api/audit")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.logs);
      })
      .catch((err) => console.error("Error fetching audit logs:", err));
  }, [dataTick]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📜 Governance Audit Trail Log</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Immutable system audit log for payroll security compliance and policy change tracking.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/30">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Action Event</th>
              <th className="py-3 px-4">Audit Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {logs.map((log, index) => (
              <tr key={`${log.id || "log"}-${index}`} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  {log.actor}
                </td>
                <td className="py-3 px-4">
                  <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 font-mono text-xs px-2 py-0.5 rounded-md font-semibold">
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-gray-700 dark:text-gray-300">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
