import React from "react";

export default function SidebarWidget() {
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 px-4 py-5 text-center`}
    >
      <h3 className="mb-1 font-bold text-emerald-900 dark:text-emerald-200 text-sm">
        SE Project Load
      </h3>
      <p className="mb-3 text-emerald-700 dark:text-emerald-400 text-xs">
        Schneider Electric Resource & Deployment Management Platform (RDMP)
      </p>
      <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 font-bold text-emerald-800 dark:text-emerald-200 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-xs border border-emerald-300/50">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Enterprise Active
      </div>
    </div>
  );
}
