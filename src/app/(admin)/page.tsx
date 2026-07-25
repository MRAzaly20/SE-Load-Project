"use client";

import React from "react";
import { useRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import EngineerDashboard from "@/components/engineer/EngineerDashboard";
import ManagerDashboard from "@/components/manager/ManagerDashboard";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function RDMPMainDashboard() {
  const { currentRole } = useRole();
  const { user } = useAuth();

  const activeRole = user ? user.role : currentRole;

  if (activeRole === "engineer") {
    return <EngineerDashboard />;
  }

  if (activeRole === "admin") {
    return <AdminDashboard />;
  }

  // Manager (Level 2)
  return <ManagerDashboard />;
}
