"use client";

import React, { useState, useEffect } from "react";
import { Engineer, Role } from "@/types/rdmp";
import { useRole } from "@/context/RoleContext";

export default function UserRoleManagement() {
  const { refreshData, dataTick } = useRole();
  const [engineers, setEngineers] = useState<Engineer[]>([]);

  const loadUsers = () => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEngineers(data.users);
      })
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    loadUsers();
  }, [dataTick]);

  const handleRoleChange = (userId: string, newRole: Role) => {
    fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          loadUsers();
          refreshData();
        }
      })
      .catch((err) => console.error("Error updating user role:", err));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>👥 User & Role Access Management</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 rounded-md font-semibold">
              Access Level 3 Rule
            </span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Admin privilege to dynamically change account levels (Level 1 Engineer, Level 2 Manager, Level 3 Admin).
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/30">
              <th className="py-3 px-4">Employee Code</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Assigned Access Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {engineers.map((eng) => (
              <tr key={eng.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                  {eng.employee_code}
                </td>
                <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  {eng.name}
                </td>
                <td className="py-3 px-4 text-xs text-gray-500 font-mono">
                  {eng.email}
                </td>
                <td className="py-3 px-4 text-xs text-gray-700 dark:text-gray-300">
                  {eng.department}
                </td>
                <td className="py-3 px-4">
                  <select
                    value={eng.role}
                    onChange={(e) => handleRoleChange(eng.id, e.target.value as Role)}
                    className="text-xs font-semibold rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="engineer">Level 1 — Engineer</option>
                    <option value="manager">Level 2 — Manager / Supervisor</option>
                    <option value="admin">Level 3 — System Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
