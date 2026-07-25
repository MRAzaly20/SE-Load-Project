export type Role = "engineer" | "manager" | "admin";

export interface UserSession {
  id: string;
  employee_code: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatar?: string;
  authProvider: "google" | "github" | "oauth" | "admin_credentials";
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface Engineer {
  id: string;
  employee_code: string;
  name: string;
  department: string;
  role: Role;
  email: string;
  avatar?: string;
  capacity_hours_per_week: number;
}

export interface Project {
  id: string;
  project_code: string;
  name: string;
  status: "Planned" | "Active" | "Closed";
  start_date: string;
  end_date: string;
  client_name: string;
  location: string;
}

export interface ResourceAllocation {
  id: string;
  engineer_id: string;
  project_id: string;
  start_date: string;
  end_date: string;
  allocation_pct: number; // e.g. 50 = 50% FTE
}

export type DeploymentStatus = "Onsite" | "Office";
export type OnsiteActivityType = "Pre-FAT" | "FAT" | "SAT" | "None";
export type ValidationStatus = "Validated" | "Pending Review" | "Flagged" | "Approved";

export interface TimesheetEntry {
  id: string;
  engineer_id: string;
  project_id: string;
  work_date: string;
  deployment_status: DeploymentStatus;
  onsite_activity_type: OnsiteActivityType;
  site_location: string | null;
  hours_logged: number;
  validation_status: ValidationStatus;
  validation_notes?: string;
  source: "Google Forms Webhook" | "PWA Manual Entry";
  responseId?: string;
  createdAt: string;
}

export interface AllowancePolicy {
  id: string;
  activity_type: OnsiteActivityType;
  amount_idr: number;
  effective_from: string;
  effective_to: string | null;
  description: string;
}

export type PayrollStatus = "Pending Payroll Approval" | "Approved for Payroll" | "Paid";

export interface AllowanceRecord {
  id: string;
  timesheet_entry_id: string;
  engineer_id: string;
  policy_id: string;
  work_date: string;
  activity_type: OnsiteActivityType;
  amount_idr: number;
  payroll_status: PayrollStatus;
  payroll_period: string; // e.g., "July 2026"
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export interface RawStagingSubmission {
  responseId: string;
  submittedAt: string;
  engineer_code: string;
  project_code: string;
  work_date: string;
  deployment_status: DeploymentStatus;
  onsite_activity_type: OnsiteActivityType;
  site_location?: string;
  hours_logged: number;
  signature: string;
  status: "Staged" | "Promoted" | "Failed Validation";
  validationErrors?: string[];
}
