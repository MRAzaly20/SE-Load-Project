"use client";

import React, { useState, useEffect } from "react";
import { Engineer, TimesheetEntry, Project } from "@/types/rdmp";

export default function DeploymentTracker() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [mounted, setMounted] = useState(false);

  const [filter, setFilter] = useState<"All" | "Onsite" | "Office">("All");

  useEffect(() => {
    Promise.all([
      fetch("/api/users").then((res) => res.json()),
      fetch("/api/timesheets").then((res) => res.json()),
      fetch("/api/projects").then((res) => res.json()),
    ])
      .then(([uData, tData, pData]) => {
        if (uData.success) setEngineers(uData.users);
        if (tData.success) setTimesheets(tData.timesheets);
        if (pData.success) setProjects(pData.projects);
      })
      .catch((err) => console.error("Error loading Deployment Tracker data:", err))
      .finally(() => setMounted(true));
  }, []);

  const latestEntries = engineers.map((eng) => {
    const engTs = timesheets.filter((t) => t.engineer_id === eng.id);
    const sorted = [...engTs].sort((a, b) => new Date(b.work_date).getTime() - new Date(a.work_date).getTime());
    const latest = sorted[0];
    const project = latest ? projects.find((p) => p.id === latest.project_id) : null;

    return {
      engineer: eng,
      latest,
      project,
    };
  });

  const filtered = latestEntries.filter((item) => {
    if (filter === "Onsite") return item.latest?.deployment_status === "Onsite";
    if (filter === "Office") return item.latest?.deployment_status === "Office";
    return true;
  });

  const totalOnsite = latestEntries.filter((i) => i.latest?.deployment_status === "Onsite").length;
  const totalOffice = latestEntries.filter((i) => i.latest?.deployment_status === "Office").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📡 Onsite Deployment Tracker</span>
            <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 px-2 py-0.5 rounded-md font-semibold">
              Live State Machine
            </span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time deployment status monitoring across Schneider Electric projects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("All")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === "All"
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            All ({mounted ? latestEntries.length : 0})
          </button>
          <button
            onClick={() => setFilter("Onsite")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === "Onsite"
                ? "bg-purple-600 text-white"
                : "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
            }`}
          >
            📍 Onsite ({mounted ? totalOnsite : 0})
          </button>
          <button
            onClick={() => setFilter("Office")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === "Office"
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            🏢 Office ({mounted ? totalOffice : 0})
          </button>
        </div>
      </div>

      {!mounted ? (
        <div className="p-8 text-center text-xs text-gray-400">Loading deployment tracking...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(({ engineer, latest, project }) => (
            <div
              key={engineer.id}
              className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                    {engineer.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{engineer.name}</h4>
                    <span className="text-xs text-gray-400 font-mono">{engineer.employee_code}</span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    latest?.deployment_status === "Onsite"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-300/40"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {latest?.deployment_status === "Onsite" ? "📍 Onsite" : "🏢 Office"}
                </span>
              </div>

              {latest ? (
                <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Project:</span>
                    <span className="font-semibold text-gray-900 dark:text-white font-mono">
                      {project?.project_code || "N/A"}
                    </span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 line-clamp-1">{project?.name}</div>

                  {latest.deployment_status === "Onsite" && (
                    <>
                      <div className="flex justify-between pt-1 border-t border-gray-200/60 dark:border-gray-700/60">
                        <span className="text-gray-500">Activity Type:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {latest.onsite_activity_type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Site Location:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {latest.site_location}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-[11px] text-gray-400 pt-1">
                    <span>Last Active Date:</span>
                    <span className="font-mono">{latest.work_date}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl text-xs text-gray-400 text-center">
                  No recent timesheet deployment logged.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
