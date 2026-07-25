"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "@/context/RoleContext";
import { TimesheetEntry, Project, OnsiteActivityType, DeploymentStatus } from "@/types/rdmp";

export default function TimesheetSyncView() {
  const { currentEngineer, refreshData, dataTick } = useRole();
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form State
  const [projectCode, setProjectCode] = useState("PRJ-SE-2026-001");
  const [workDate, setWorkDate] = useState("2026-07-22");
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>("Onsite");
  const [activityType, setActivityType] = useState<OnsiteActivityType>("SAT");
  const [siteLocation, setSiteLocation] = useState("PLN Cilegon 500kV Substation");
  const [hoursLogged, setHoursLogged] = useState(8);
  const [submissionFeedback, setSubmissionFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const loadData = () => {
    if (!currentEngineer) return;
    Promise.all([
      fetch(`/api/timesheets?engineerId=${currentEngineer.id}`).then((res) => res.json()),
      fetch("/api/projects").then((res) => res.json()),
    ])
      .then(([tData, pData]) => {
        if (tData.success) setEntries(tData.timesheets);
        if (pData.success) setProjects(pData.projects);
      })
      .catch((err) => console.error("Error loading TimesheetSyncView data:", err));
  };

  useEffect(() => {
    loadData();
  }, [currentEngineer, dataTick]);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEngineer) return;

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engineer_code: currentEngineer.employee_code,
          project_code: projectCode,
          work_date: workDate,
          deployment_status: deploymentStatus,
          onsite_activity_type: deploymentStatus === "Onsite" ? activityType : "None",
          site_location: deploymentStatus === "Onsite" ? siteLocation : undefined,
          hours_logged: Number(hoursLogged),
        }),
      });

      const resData = await res.json();
      setSubmissionFeedback({ success: resData.success, message: resData.message || (resData.success ? "Submitted successfully!" : "Failed") });
      loadData();
      refreshData();
      if (resData.success) {
        setTimeout(() => {
          setShowSubmitModal(false);
          setSubmissionFeedback(null);
        }, 1500);
      }
    } catch (err: any) {
      setSubmissionFeedback({ success: false, message: err.message || "Failed to submit" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📋 Timesheet Sync View</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md font-mono">
              Google Forms Bridge
            </span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Read-only mirror of Google Form submissions with real-time validation badges.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          + Submit New Entry (Simulate Form)
        </button>
      </div>

      {/* Entries Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/30">
              <th className="py-3 px-4">Work Date</th>
              <th className="py-3 px-4">Project</th>
              <th className="py-3 px-4">Deployment</th>
              <th className="py-3 px-4">Activity</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Hours</th>
              <th className="py-3 px-4">Validation Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                  No timesheet submissions found for your profile.
                </td>
              </tr>
            ) : (
              entries.map((ts) => {
                const prj = projects.find((p) => p.id === ts.project_id);
                return (
                  <tr key={ts.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-700 dark:text-gray-300">
                      {ts.work_date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900 dark:text-white block">
                        {prj?.project_code || ts.project_id}
                      </span>
                      <span className="text-xs text-gray-400 line-clamp-1">{prj?.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ts.deployment_status === "Onsite"
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {ts.deployment_status === "Onsite" ? "📍 Onsite" : "🏢 Office"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                      {ts.onsite_activity_type !== "None" ? (
                        <span className="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md font-semibold text-xs border border-emerald-200/50">
                          {ts.onsite_activity_type}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600 dark:text-gray-400">
                      {ts.site_location || "—"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      {ts.hours_logged}h
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={ts.validation_status} notes={ts.validation_notes} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Simulate Google Form Timesheet Entry
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickSubmit} className="mt-4 space-y-4">
              {submissionFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    submissionFeedback.success
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200 border border-rose-200"
                  }`}
                >
                  {submissionFeedback.message}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Project Code
                </label>
                <select
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.project_code}>
                      {p.project_code} — {p.name} ({p.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Work Date
                  </label>
                  <input
                    type="date"
                    value={workDate}
                    onChange={(e) => setWorkDate(e.target.value)}
                    className="w-full text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Hours Logged
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={16}
                    value={hoursLogged}
                    onChange={(e) => setHoursLogged(Number(e.target.value))}
                    className="w-full text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Deployment Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center text-xs text-gray-800 dark:text-gray-200 cursor-pointer">
                    <input
                      type="radio"
                      name="deployment"
                      value="Onsite"
                      checked={deploymentStatus === "Onsite"}
                      onChange={() => setDeploymentStatus("Onsite")}
                      className="mr-1.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    📍 Onsite (Eligible for Allowance)
                  </label>
                  <label className="flex items-center text-xs text-gray-800 dark:text-gray-200 cursor-pointer">
                    <input
                      type="radio"
                      name="deployment"
                      value="Office"
                      checked={deploymentStatus === "Office"}
                      onChange={() => setDeploymentStatus("Office")}
                      className="mr-1.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    🏢 Office
                  </label>
                </div>
              </div>

              {deploymentStatus === "Onsite" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Onsite Activity Category (Controlled Vocabulary)
                    </label>
                    <select
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value as OnsiteActivityType)}
                      className="w-full text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-gray-900 dark:text-white"
                    >
                      <option value="Pre-FAT">Pre-FAT (Pre-Factory Acceptance Testing)</option>
                      <option value="FAT">FAT (Factory Acceptance Testing)</option>
                      <option value="SAT">SAT (Site Acceptance Testing)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Site Location
                    </label>
                    <input
                      type="text"
                      value={siteLocation}
                      onChange={(e) => setSiteLocation(e.target.value)}
                      placeholder="e.g. PLN Cilegon Substation Yard"
                      className="w-full text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
                >
                  Post Webhook Payload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, notes }: { status: string; notes?: string }) {
  let badgeStyle = "bg-gray-100 text-gray-600";
  let icon = "⚪";

  if (status === "Validated") {
    badgeStyle = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/50";
    icon = "✅";
  } else if (status === "Approved") {
    badgeStyle = "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200/50";
    icon = "👍";
  } else if (status === "Flagged" || status === "Pending Review") {
    badgeStyle = "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/50";
    icon = "⚠️";
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeStyle}`} title={notes}>
      <span>{icon}</span>
      <span>{status}</span>
    </span>
  );
}
