"use client";

import React, { useState, useEffect } from "react";
import { TimesheetEntry, Engineer, Project } from "@/types/rdmp";
import { useRole } from "@/context/RoleContext";

export default function ApprovalQueue() {
  const { currentEngineer, refreshData, dataTick } = useRole();
  const [flaggedEntries, setFlaggedEntries] = useState<TimesheetEntry[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [mounted, setMounted] = useState(false);

  const fetchQueueData = () => {
    Promise.all([
      fetch("/api/timesheets").then((res) => res.json()),
      fetch("/api/users").then((res) => res.json()),
      fetch("/api/projects").then((res) => res.json()),
    ])
      .then(([tData, uData, pData]) => {
        if (tData.success) {
          const flagged = tData.timesheets.filter(
            (ts: TimesheetEntry) => ts.validation_status === "Flagged" || ts.validation_status === "Pending Review"
          );
          setFlaggedEntries(flagged);
        }
        if (uData.success) setEngineers(uData.users);
        if (pData.success) setProjects(pData.projects);
      })
      .catch((err) => console.error("Error loading Approval Queue data:", err))
      .finally(() => setMounted(true));
  };

  useEffect(() => {
    fetchQueueData();
  }, [dataTick]);

  const handleApprove = (timesheetId: string) => {
    const managerName = currentEngineer ? currentEngineer.name : "Supervisor";
    fetch("/api/timesheets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timesheetId, managerName }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          fetchQueueData();
          refreshData();
        }
      })
      .catch((err) => console.error("Error approving timesheet entry:", err));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🛡️ Manager Approval Queue</span>
            <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2.5 py-0.5 rounded-md font-semibold">
              {mounted ? flaggedEntries.length : 0} Items Pending Review
            </span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Review soft warnings (allocation mismatches, unassigned site entries) before allowance generation.
          </p>
        </div>
      </div>

      {!mounted ? (
        <div className="p-8 text-center text-xs text-gray-400">Loading approval queue...</div>
      ) : flaggedEntries.length === 0 ? (
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl p-8 text-center">
          <span className="text-3xl block">🎉</span>
          <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-200 mt-2">
            Approval Queue is Empty!
          </h4>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            All submitted timesheets pass automated business rules cleanly.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {flaggedEntries.map((ts) => {
            const eng = engineers.find((e) => e.id === ts.engineer_id);
            const prj = projects.find((p) => p.id === ts.project_id);

            return (
              <div
                key={ts.id}
                className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-2xs space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {eng?.name || ts.engineer_id} ({eng?.employee_code})
                      </h4>
                      <span className="text-xs text-gray-500">
                        Logged Date: <strong className="font-mono text-gray-800 dark:text-gray-200">{ts.work_date}</strong> | Project:{" "}
                        <strong className="font-mono text-gray-800 dark:text-gray-200">{prj?.project_code}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(ts.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-2xs cursor-pointer"
                    >
                      ✓ Approve & Promote
                    </button>
                  </div>
                </div>

                {/* Validation Note */}
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
                  <strong>Validation Flag:</strong> {ts.validation_notes || "Soft warning flagged for manager review."}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl">
                  <div>
                    <span className="text-gray-400 block">Deployment</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{ts.deployment_status}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Activity</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{ts.onsite_activity_type}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Site Location</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{ts.site_location || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Hours</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{ts.hours_logged} hrs</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
