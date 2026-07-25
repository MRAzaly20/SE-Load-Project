"use client";

import React from "react";
import UserRoleManagement from "./UserRoleManagement";
import ProjectMasterManager from "./ProjectMasterManager";
import AllowancePolicyManager from "./AllowancePolicyManager";
import IngestionSimulator from "./IngestionSimulator";
import AuditLogViewer from "./AuditLogViewer";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-emerald-950 rounded-2xl p-6 text-white shadow-lg border border-emerald-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-emerald-500/30 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
              Access Level 3 — Admin & System Governance
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mt-2">
              System Control & Data Policy Panel
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              User Access Rights | Project Master CRUD | Versioned Allowance Rates | Webhook Ingestion Testing
            </p>
          </div>
        </div>
      </div>

      {/* User & Role Management */}
      <div id="users" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
        <UserRoleManagement />
      </div>

      {/* Project Master Manager */}
      <div id="projects" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
        <ProjectMasterManager />
      </div>

      {/* Allowance Policy Manager */}
      <div id="policies" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
        <AllowancePolicyManager />
      </div>

      {/* Ingestion Bridge Simulator */}
      <div id="simulator" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
        <IngestionSimulator />
      </div>

      {/* Audit Log Viewer */}
      <div id="audit" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
        <AuditLogViewer />
      </div>
    </div>
  );
}
