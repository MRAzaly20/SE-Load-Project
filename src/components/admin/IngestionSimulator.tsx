"use client";

import React, { useState, useEffect } from "react";
import { RawStagingSubmission, OnsiteActivityType } from "@/types/rdmp";
import { useRole } from "@/context/RoleContext";

export default function IngestionSimulator() {
  const { refreshData, dataTick } = useRole();
  const [stagingList, setStagingList] = useState<RawStagingSubmission[]>([]);

  // Simulation Form State
  const [engCode, setEngCode] = useState("SE-ENG-101");
  const [prjCode, setPrjCode] = useState("PRJ-SE-2026-001");
  const [date, setDate] = useState("2026-07-22");
  const [deployStatus, setDeployStatus] = useState<"Onsite" | "Office">("Onsite");
  const [activity, setActivity] = useState<OnsiteActivityType>("SAT");
  const [location, setLocation] = useState("PLN Cilegon 500kV Substation");
  const [hours, setHours] = useState(8);
  const [simResult, setSimResult] = useState<{ success: boolean; message: string; staging: RawStagingSubmission } | null>(null);

  const loadStaging = () => {
    fetch("/api/ingest")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStagingList(data.staging);
      })
      .catch((err) => console.error("Error loading staging submissions:", err));
  };

  useEffect(() => {
    loadStaging();
  }, [dataTick]);

  const handleTestIngestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engineer_code: engCode,
          project_code: prjCode,
          work_date: date,
          deployment_status: deployStatus,
          onsite_activity_type: deployStatus === "Onsite" ? activity : "None",
          site_location: deployStatus === "Onsite" ? location : undefined,
          hours_logged: Number(hours),
        }),
      });

      const resData = await res.json();
      setSimResult(resData);
      loadStaging();
      refreshData();
    } catch (err: any) {
      console.error("Error dispatching simulation webhook:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>⚡ Google Forms / Apps Script Webhook Ingestion Bridge Simulator</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Test HMAC signature verification, staging table boundary, and business rule promotion engine.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulator Input Controls */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🧪 Webhook Payload Dispatcher</span>
          </h3>

          {simResult && (
            <div
              className={`p-3 rounded-xl text-xs font-medium ${
                simResult.success
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200"
              }`}
            >
              <div className="font-bold">{simResult.success ? "✅ Webhook Ingested & Processed" : "❌ Webhook Failed Validation"}</div>
              <div className="mt-1">{simResult.message}</div>
              <div className="mt-1 font-mono text-[11px] opacity-80">
                Signature: {simResult.staging.signature} | ResponseId: {simResult.staging.responseId}
              </div>
            </div>
          )}

          <form onSubmit={handleTestIngestion} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Employee Code
                </label>
                <select
                  value={engCode}
                  onChange={(e) => setEngCode(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-900 dark:text-white cursor-pointer"
                >
                  <option value="SE-ENG-101">SE-ENG-101 (Saya)</option>
                  <option value="SE-ENG-102">SE-ENG-102 (Budi Santoso)</option>
                  <option value="SE-ENG-103">SE-ENG-103 (Dewi Lestari)</option>
                  <option value="SE-ENG-104">SE-ENG-104 (Agus Setiawan - Mismatch Test)</option>
                  <option value="INVALID-ENG-999">INVALID-ENG-999 (Referential Error Test)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Project Code
                </label>
                <select
                  value={prjCode}
                  onChange={(e) => setPrjCode(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-900 dark:text-white font-mono cursor-pointer"
                >
                  <option value="PRJ-SE-2026-001">PRJ-SE-2026-001 (Active)</option>
                  <option value="PRJ-SE-2026-002">PRJ-SE-2026-002 (Active)</option>
                  <option value="PRJ-SE-2026-003">PRJ-SE-2026-003 (Active)</option>
                  <option value="PRJ-SE-2026-004">PRJ-SE-2026-004 (Planned Status Test)</option>
                  <option value="INVALID-PRJ-000">INVALID-PRJ-000 (Invalid Code Test)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Deployment</label>
                <select
                  value={deployStatus}
                  onChange={(e) => setDeployStatus(e.target.value as "Onsite" | "Office")}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-900 dark:text-white cursor-pointer"
                >
                  <option value="Onsite">Onsite</option>
                  <option value="Office">Office</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Activity</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value as OnsiteActivityType)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-900 dark:text-white cursor-pointer"
                  disabled={deployStatus === "Office"}
                >
                  <option value="Pre-FAT">Pre-FAT</option>
                  <option value="FAT">FAT</option>
                  <option value="SAT">SAT</option>
                  <option value="None">None (Error Test)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Site Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-900 dark:text-white"
                placeholder="e.g. PLN Cilegon Substation Yard"
                disabled={deployStatus === "Office"}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-xs text-xs cursor-pointer"
            >
              🚀 Dispatch Signed Webhook Payload to /api/ingest
            </button>
          </form>
        </div>

        {/* Live Staging Queue Log */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between">
            <span>📥 Staging Table Queue (`raw_timesheet_entries`)</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md font-mono">
              {stagingList.length} Entries
            </span>
          </h3>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
            {stagingList.length === 0 ? (
              <div className="text-center py-10 text-xs text-gray-400">
                Staging table queue is currently empty. Dispatch a test payload above to view live bridge processing.
              </div>
            ) : (
              stagingList.map((stg) => (
                <div
                  key={stg.responseId}
                  className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-200/60 dark:border-gray-700/60 text-xs space-y-1 font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{stg.responseId}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        stg.status === "Promoted"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : stg.status === "Failed Validation"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {stg.status}
                    </span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    Eng: <strong>{stg.engineer_code}</strong> | Prj: <strong>{stg.project_code}</strong> | Date: <strong>{stg.work_date}</strong>
                  </div>
                  <div className="text-gray-400 text-[11px]">
                    Type: {stg.deployment_status} ({stg.onsite_activity_type}) | Loc: {stg.site_location || "N/A"}
                  </div>
                  {stg.validationErrors && (
                    <div className="text-rose-500 text-[11px] font-sans pt-1">
                      ❌ {stg.validationErrors.join(" ")}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
