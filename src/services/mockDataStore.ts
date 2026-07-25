import {
  Engineer,
  Project,
  ResourceAllocation,
  TimesheetEntry,
  AllowancePolicy,
  AllowanceRecord,
  AuditLog,
  RawStagingSubmission,
  OnsiteActivityType,
  Role,
} from "@/types/rdmp";

// Initial Engineers
export const INITIAL_ENGINEERS: Engineer[] = [
  {
    id: "eng-001",
    employee_code: "SE-ENG-101",
    name: "Saya",
    department: "Substation Automation & Protection",
    role: "engineer",
    email: "saya@se.com",
    avatar: "/images/user/user.png",
    capacity_hours_per_week: 40,
  },
  {
    id: "eng-002",
    employee_code: "SE-ENG-102",
    name: "Saya",
    department: "SCADA & Power Management",
    role: "engineer",
    email: "saya@se.com",
    avatar: "/images/user/user-02.jpg",
    capacity_hours_per_week: 40,
  },
  {
    id: "eng-003",
    employee_code: "SE-ENG-103",
    name: "Saya",
    department: "Microgrid & Renewable Energy",
    role: "engineer",
    email: "saya@se.com",
    avatar: "/images/user/user-03.jpg",
    capacity_hours_per_week: 40,
  },
  {
    id: "eng-004",
    employee_code: "SE-ENG-104",
    name: "Saya",
    department: "Industrial Automation Systems",
    role: "engineer",
    email: "saya@se.com",
    avatar: "/images/user/user-04.jpg",
    capacity_hours_per_week: 40,
  },
  {
    id: "eng-005",
    employee_code: "SE-ENG-105",
    name: "Saya",
    department: "Substation Automation & Protection",
    role: "manager",
    email: "saya@se.com",
    avatar: "/images/user/user-05.jpg",
    capacity_hours_per_week: 40,
  },
];

// Initial Projects
export const INITIAL_PROJECTS: Project[] = [
  {
    id: "prj-001",
    project_code: "PRJ-SE-2026-001",
    name: "PLN Java-Bali 500kV Substation Automation",
    status: "Active",
    start_date: "2026-01-15",
    end_date: "2026-08-30",
    client_name: "PT PLN (Persero)",
    location: "Cilegon, Banten",
  },
  {
    id: "prj-002",
    project_code: "PRJ-SE-2026-002",
    name: "Data Center HyperScale Power Monitoring System",
    status: "Active",
    start_date: "2026-03-01",
    end_date: "2026-11-15",
    client_name: "Global Data Center Tech",
    location: "Cikarang, West Java",
  },
  {
    id: "prj-003",
    project_code: "PRJ-SE-2026-003",
    name: "Balongan Refinery Protection & Control Modernization",
    status: "Active",
    start_date: "2026-02-10",
    end_date: "2026-09-20",
    client_name: "PT Pertamina (Persero)",
    location: "Indramayu, West Java",
  },
  {
    id: "prj-004",
    project_code: "PRJ-SE-2026-004",
    name: "Solar PV Microgrid Monitoring & Energy Storage",
    status: "Planned",
    start_date: "2026-08-01",
    end_date: "2026-12-31",
    client_name: "SE Renewable Energy Solutions",
    location: "Sumbawa, NTB",
  },
];

// Initial Resource Allocations
export const INITIAL_ALLOCATIONS: ResourceAllocation[] = [
  {
    id: "alloc-001",
    engineer_id: "eng-001",
    project_id: "prj-001",
    start_date: "2026-01-15",
    end_date: "2026-08-30",
    allocation_pct: 100,
  },
  {
    id: "alloc-002",
    engineer_id: "eng-002",
    project_id: "prj-002",
    start_date: "2026-03-01",
    end_date: "2026-11-15",
    allocation_pct: 75,
  },
  {
    id: "alloc-003",
    engineer_id: "eng-003",
    project_id: "prj-003",
    start_date: "2026-02-10",
    end_date: "2026-09-20",
    allocation_pct: 100,
  },
  {
    id: "alloc-004",
    engineer_id: "eng-004",
    project_id: "prj-002",
    start_date: "2026-03-01",
    end_date: "2026-11-15",
    allocation_pct: 50,
  },
  {
    id: "alloc-005",
    engineer_id: "eng-004",
    project_id: "prj-003",
    start_date: "2026-02-10",
    end_date: "2026-09-20",
    allocation_pct: 50,
  },
];

// Initial Allowance Policies
export const INITIAL_POLICIES: AllowancePolicy[] = [
  {
    id: "pol-001",
    activity_type: "Pre-FAT",
    amount_idr: 150000,
    effective_from: "2026-01-01",
    effective_to: null,
    description: "Standard Onsite Allowance for Pre-Factory Acceptance Testing (IDR 150,000/day)",
  },
  {
    id: "pol-002",
    activity_type: "FAT",
    amount_idr: 150000,
    effective_from: "2026-01-01",
    effective_to: null,
    description: "Standard Onsite Allowance for Factory Acceptance Testing (IDR 150,000/day)",
  },
  {
    id: "pol-003",
    activity_type: "SAT",
    amount_idr: 150000,
    effective_from: "2026-01-01",
    effective_to: null,
    description: "Standard Onsite Allowance for Site Acceptance Testing (IDR 150,000/day)",
  },
];

// Seed sample timesheets & allowance records for July 2026
export const INITIAL_TIMESHEETS: TimesheetEntry[] = [
  {
    id: "ts-001",
    engineer_id: "eng-001",
    project_id: "prj-001",
    work_date: "2026-07-14",
    deployment_status: "Onsite",
    onsite_activity_type: "SAT",
    site_location: "PLN Cilegon 500kV Yard",
    hours_logged: 8,
    validation_status: "Validated",
    source: "Google Forms Webhook",
    responseId: "gform-resp-1001",
    createdAt: "2026-07-14T17:30:00Z",
  },
  {
    id: "ts-002",
    engineer_id: "eng-001",
    project_id: "prj-001",
    work_date: "2026-07-15",
    deployment_status: "Onsite",
    onsite_activity_type: "SAT",
    site_location: "PLN Cilegon 500kV Yard",
    hours_logged: 8,
    validation_status: "Validated",
    source: "Google Forms Webhook",
    responseId: "gform-resp-1002",
    createdAt: "2026-07-15T18:00:00Z",
  },
  {
    id: "ts-003",
    engineer_id: "eng-001",
    project_id: "prj-001",
    work_date: "2026-07-16",
    deployment_status: "Office",
    onsite_activity_type: "None",
    site_location: null,
    hours_logged: 8,
    validation_status: "Validated",
    source: "Google Forms Webhook",
    responseId: "gform-resp-1003",
    createdAt: "2026-07-16T17:00:00Z",
  },
  {
    id: "ts-004",
    engineer_id: "eng-002",
    project_id: "prj-002",
    work_date: "2026-07-14",
    deployment_status: "Onsite",
    onsite_activity_type: "FAT",
    site_location: "SE Cikarang Assembly Plant",
    hours_logged: 8,
    validation_status: "Validated",
    source: "Google Forms Webhook",
    responseId: "gform-resp-1004",
    createdAt: "2026-07-14T17:45:00Z",
  },
  {
    id: "ts-005",
    engineer_id: "eng-002",
    project_id: "prj-002",
    work_date: "2026-07-15",
    deployment_status: "Onsite",
    onsite_activity_type: "FAT",
    site_location: "SE Cikarang Assembly Plant",
    hours_logged: 8,
    validation_status: "Validated",
    source: "Google Forms Webhook",
    responseId: "gform-resp-1005",
    createdAt: "2026-07-15T17:50:00Z",
  },
  {
    id: "ts-006",
    engineer_id: "eng-003",
    project_id: "prj-003",
    work_date: "2026-07-16",
    deployment_status: "Onsite",
    onsite_activity_type: "Pre-FAT",
    site_location: "Pertamina Balongan Substation",
    hours_logged: 8,
    validation_status: "Validated",
    source: "Google Forms Webhook",
    responseId: "gform-resp-1006",
    createdAt: "2026-07-16T17:20:00Z",
  },
  {
    id: "ts-007",
    engineer_id: "eng-004",
    project_id: "prj-001", // Mismatch soft warning example
    work_date: "2026-07-17",
    deployment_status: "Onsite",
    onsite_activity_type: "SAT",
    site_location: "PLN Cilegon 500kV Yard",
    hours_logged: 8,
    validation_status: "Flagged",
    validation_notes: "Allocation mismatch: Engineer SE-ENG-104 is not allocated to project PRJ-SE-2026-001.",
    source: "Google Forms Webhook",
    responseId: "gform-resp-1007",
    createdAt: "2026-07-17T16:15:00Z",
  },
];

export const INITIAL_ALLOWANCE_RECORDS: AllowanceRecord[] = [
  {
    id: "alw-001",
    timesheet_entry_id: "ts-001",
    engineer_id: "eng-001",
    policy_id: "pol-003",
    work_date: "2026-07-14",
    activity_type: "SAT",
    amount_idr: 150000,
    payroll_status: "Approved for Payroll",
    payroll_period: "July 2026",
    createdAt: "2026-07-14T23:59:00Z",
  },
  {
    id: "alw-002",
    timesheet_entry_id: "ts-002",
    engineer_id: "eng-001",
    policy_id: "pol-003",
    work_date: "2026-07-15",
    activity_type: "SAT",
    amount_idr: 150000,
    payroll_status: "Approved for Payroll",
    payroll_period: "July 2026",
    createdAt: "2026-07-15T23:59:00Z",
  },
  {
    id: "alw-003",
    timesheet_entry_id: "ts-004",
    engineer_id: "eng-002",
    policy_id: "pol-002",
    work_date: "2026-07-14",
    activity_type: "FAT",
    amount_idr: 150000,
    payroll_status: "Approved for Payroll",
    payroll_period: "July 2026",
    createdAt: "2026-07-14T23:59:00Z",
  },
  {
    id: "alw-004",
    timesheet_entry_id: "ts-005",
    engineer_id: "eng-002",
    policy_id: "pol-002",
    work_date: "2026-07-15",
    activity_type: "FAT",
    amount_idr: 150000,
    payroll_status: "Pending Payroll Approval",
    payroll_period: "July 2026",
    createdAt: "2026-07-15T23:59:00Z",
  },
  {
    id: "alw-005",
    timesheet_entry_id: "ts-006",
    engineer_id: "eng-003",
    policy_id: "pol-001",
    work_date: "2026-07-16",
    activity_type: "Pre-FAT",
    amount_idr: 150000,
    payroll_status: "Pending Payroll Approval",
    payroll_period: "July 2026",
    createdAt: "2026-07-16T23:59:00Z",
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-001",
    timestamp: "2026-07-01T09:00:00Z",
    actor: "Rina Wijaya (Admin)",
    action: "POLICY_UPDATE",
    details: "Initialized Onsite Allowance rate to IDR 150,000/day for Pre-FAT, FAT, SAT.",
  },
  {
    id: "log-002",
    timestamp: "2026-07-14T17:31:00Z",
    actor: "System Webhook Bridge",
    action: "TIMESHEET_PROMOTION",
    details: "Promoted responseId gform-resp-1001 to production timesheets (Validated).",
  },
];

const STORAGE_KEYS = {
  ENGINEERS: "rdmp_engineers",
  PROJECTS: "rdmp_projects",
  ALLOCATIONS: "rdmp_allocations",
  TIMESHEETS: "rdmp_timesheets",
  POLICIES: "rdmp_policies",
  ALLOWANCES: "rdmp_allowances",
  STAGING: "rdmp_staging",
  AUDIT: "rdmp_audit",
  SESSION: "rdmp_current_session",
};

export class RDMPDataStore {
  private static isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  private static getItem<T>(key: string, fallback: T): T {
    if (!this.isBrowser()) return fallback;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
      return fallback;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage`, e);
    }
  }

  // Session & Authentication
  public static getCurrentSession(): any | null {
    return this.getItem(STORAGE_KEYS.SESSION, null);
  }

  public static setCurrentSession(user: any | null): void {
    this.setItem(STORAGE_KEYS.SESSION, user);
  }

  public static validateAdminCredentials(username: string, password: string): { success: boolean; user?: any; message?: string } {
    const cleanUser = username.trim().toLowerCase();

    // Administrator Level (Level 3) Credentials
    if ((cleanUser === "admin" || cleanUser === "admin@se.com") && password === "admin123") {
      const adminUser = {
        id: "admin-001",
        employee_code: "SE-ADM-001",
        name: "Schneider System Admin",
        email: "admin@se.com",
        role: "admin" as Role,
        department: "IT System Governance",
        avatar: "/images/user/user-05.jpg",
        authProvider: "admin_credentials" as const,
      };
      this.setCurrentSession(adminUser);
      this.addAuditLog("System", "ADMIN_LOGIN", "Admin logged in via designated management portal.");
      return { success: true, user: adminUser };
    }

    // Manager Level (Level 2) Credentials
    if ((cleanUser === "manager" || cleanUser === "manager@se.com") && password === "manager123") {
      const managerUser = {
        id: "mgr-001",
        employee_code: "SE-MGR-001",
        name: "Manager Level",
        email: "manager@se.com",
        role: "manager" as Role,
        department: "Field Engineering Operations",
        avatar: "/images/user/user-01.jpg",
        authProvider: "admin_credentials" as const,
      };
      this.setCurrentSession(managerUser);
      this.addAuditLog("System", "MANAGER_LOGIN", "Manager logged in via designated management portal.");
      return { success: true, user: managerUser };
    }

    // Check existing manager engineers with password
    const engineers = this.getEngineers();
    const existingMgr = engineers.find(
      (e) => (e.email.toLowerCase() === cleanUser || e.employee_code.toLowerCase() === cleanUser) && e.role === "manager"
    );
    if (existingMgr && (password === "manager123" || password === "admin123")) {
      const mgrSession = {
        id: existingMgr.id,
        employee_code: existingMgr.employee_code,
        name: existingMgr.name,
        email: existingMgr.email,
        role: existingMgr.role,
        department: existingMgr.department,
        avatar: existingMgr.avatar,
        authProvider: "admin_credentials" as const,
      };
      this.setCurrentSession(mgrSession);
      this.addAuditLog(existingMgr.name, "MANAGER_LOGIN", `Manager ${existingMgr.name} logged in via designated management portal.`);
      return { success: true, user: mgrSession };
    }

    return {
      success: false,
      message: "Invalid credentials. Manager password is 'manager123' and Admin password is 'admin123'",
    };
  }

  public static authenticateGoogleUser(email: string, customName?: string, customAvatar?: string): { success: boolean; user: any } {
    const engineers = this.getEngineers();
    let engineer = engineers.find((e) => e.email.toLowerCase() === email.toLowerCase());

    if (!engineer) {
      // Auto-register new Google user as Engineer
      const codeNum = 100 + engineers.length + 1;
      const nameFromEmail = email.split("@")[0].replace(".", " ").replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());

      engineer = {
        id: `eng-${Date.now()}`,
        employee_code: `SE-ENG-${codeNum}`,
        name: customName || nameFromEmail,
        department: "Schneider Electric Field Engineering",
        role: "engineer" as Role,
        email: email,
        avatar: customAvatar || "/images/user/user.png",
        capacity_hours_per_week: 40,
      };

      this.setItem(STORAGE_KEYS.ENGINEERS, [...engineers, engineer]);
      this.addAuditLog("System", "GOOGLE_AUTH_REGISTER", `Registered new Google OAuth user ${email} as Engineer.`);
    } else {
      let updated = false;
      if (customName && engineer.name !== customName) {
        engineer.name = customName;
        updated = true;
      }
      if (customAvatar && engineer.avatar !== customAvatar) {
        engineer.avatar = customAvatar;
        updated = true;
      }
      if (updated) {
        this.setItem(
          STORAGE_KEYS.ENGINEERS,
          engineers.map((e) => (e.id === engineer!.id ? engineer! : e))
        );
      }
    }

    const sessionUser = {
      id: engineer.id,
      employee_code: engineer.employee_code,
      name: engineer.name,
      email: engineer.email,
      role: engineer.role, // Level assigned by Admin!
      department: engineer.department,
      avatar: engineer.avatar,
      authProvider: "google" as const,
    };

    this.setCurrentSession(sessionUser);
    this.addAuditLog(engineer.name, "GOOGLE_AUTH_LOGIN", `Logged in via Google OAuth (${sessionUser.role.toUpperCase()} level).`);

    return { success: true, user: sessionUser };
  }

  public static authenticateGithubUser(email: string, customName?: string, customAvatar?: string): { success: boolean; user: any } {
    const engineers = this.getEngineers();
    let engineer = engineers.find((e) => e.email.toLowerCase() === email.toLowerCase());

    if (!engineer) {
      // Auto-register new GitHub user as Engineer
      const codeNum = 100 + engineers.length + 1;
      const fallbackName = email.includes("@")
        ? email.split("@")[0].replace(".", " ").replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
        : email;
      const name = customName || fallbackName;

      engineer = {
        id: `eng-${Date.now()}`,
        employee_code: `SE-ENG-${codeNum}`,
        name: name,
        department: "Schneider Electric Field Engineering",
        role: "engineer" as Role,
        email: email.includes("@") ? email : `${email.toLowerCase()}@se.com`,
        avatar: customAvatar || "/images/user/user-03.jpg",
        capacity_hours_per_week: 40,
      };

      this.setItem(STORAGE_KEYS.ENGINEERS, [...engineers, engineer]);
      this.addAuditLog("System", "GITHUB_AUTH_REGISTER", `Registered new GitHub OAuth user ${email} as Engineer.`);
    } else {
      let updated = false;
      if (customName && engineer.name !== customName) {
        engineer.name = customName;
        updated = true;
      }
      if (customAvatar && engineer.avatar !== customAvatar) {
        engineer.avatar = customAvatar;
        updated = true;
      }
      if (updated) {
        this.setItem(
          STORAGE_KEYS.ENGINEERS,
          engineers.map((e) => (e.id === engineer!.id ? engineer! : e))
        );
      }
    }

    const sessionUser = {
      id: engineer.id,
      employee_code: engineer.employee_code,
      name: engineer.name,
      email: engineer.email,
      role: engineer.role,
      department: engineer.department,
      avatar: engineer.avatar || "/images/user/user-03.jpg",
      authProvider: "github" as const,
    };

    this.setCurrentSession(sessionUser);
    this.addAuditLog(engineer.name, "GITHUB_AUTH_LOGIN", `Logged in via GitHub OAuth (${sessionUser.role.toUpperCase()} level).`);

    return { success: true, user: sessionUser };
  }

  public static authenticateOAuthUser(provider: "google" | "github", email: string, name?: string): { success: boolean; user: any } {
    if (provider === "github") {
      return this.authenticateGithubUser(email, name);
    }
    return this.authenticateGoogleUser(email);
  }


  // Getters
  public static getEngineers(): Engineer[] {
    return this.getItem(STORAGE_KEYS.ENGINEERS, INITIAL_ENGINEERS);
  }

  public static getProjects(): Project[] {
    return this.getItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  }

  public static getAllocations(): ResourceAllocation[] {
    return this.getItem(STORAGE_KEYS.ALLOCATIONS, INITIAL_ALLOCATIONS);
  }

  public static getTimesheets(): TimesheetEntry[] {
    return this.getItem(STORAGE_KEYS.TIMESHEETS, INITIAL_TIMESHEETS);
  }

  public static getPolicies(): AllowancePolicy[] {
    return this.getItem(STORAGE_KEYS.POLICIES, INITIAL_POLICIES);
  }

  public static getAllowances(): AllowanceRecord[] {
    return this.getItem(STORAGE_KEYS.ALLOWANCES, INITIAL_ALLOWANCE_RECORDS);
  }

  public static getStagingSubmissions(): RawStagingSubmission[] {
    return this.getItem(STORAGE_KEYS.STAGING, []);
  }

  public static getAuditLogs(): AuditLog[] {
    return this.getItem(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
  }

  // Setters & Mutators
  public static updateEngineerRole(engineerId: string, newRole: Role): void {
    const engineers = this.getEngineers();
    const updated = engineers.map((eng) =>
      eng.id === engineerId ? { ...eng, role: newRole } : eng
    );
    this.setItem(STORAGE_KEYS.ENGINEERS, updated);

    this.addAuditLog(
      "Admin",
      "USER_ROLE_CHANGE",
      `Updated user ${engineerId} role to ${newRole}`
    );
  }

  public static addProject(project: Omit<Project, "id">): Project {
    const projects = this.getProjects();
    const newProject: Project = {
      ...project,
      id: `prj-${Date.now()}`,
    };
    this.setItem(STORAGE_KEYS.PROJECTS, [newProject, ...projects]);
    this.addAuditLog("Admin", "PROJECT_CREATE", `Added project ${newProject.project_code} - ${newProject.name}`);
    return newProject;
  }

  public static updateProjectStatus(projectId: string, status: "Planned" | "Active" | "Closed"): void {
    const projects = this.getProjects();
    const updated = projects.map((p) => (p.id === projectId ? { ...p, status } : p));
    this.setItem(STORAGE_KEYS.PROJECTS, updated);
    this.addAuditLog("Admin", "PROJECT_UPDATE", `Updated project ${projectId} status to ${status}`);
  }

  public static updatePolicyAmount(policyId: string, newAmountIDR: number): void {
    const policies = this.getPolicies();
    const updated = policies.map((pol) =>
      pol.id === policyId ? { ...pol, amount_idr: newAmountIDR } : pol
    );
    this.setItem(STORAGE_KEYS.POLICIES, updated);
    this.addAuditLog("Admin", "POLICY_UPDATE", `Updated policy ${policyId} amount to IDR ${newAmountIDR.toLocaleString()}`);
  }

  public static approveTimesheetEntry(timesheetId: string, managerName: string): void {
    const timesheets = this.getTimesheets();
    const target = timesheets.find((ts) => ts.id === timesheetId);
    if (!target) return;

    const updated = timesheets.map((ts) =>
      ts.id === timesheetId
        ? { ...ts, validation_status: "Approved" as const, validation_notes: `Approved by manager ${managerName}` }
        : ts
    );
    this.setItem(STORAGE_KEYS.TIMESHEETS, updated);

    // If entry is Onsite, ensure allowance record is generated
    if (target.deployment_status === "Onsite" && target.onsite_activity_type !== "None") {
      this.recalculateAllowancesForEntry({ ...target, validation_status: "Approved" });
    }

    this.addAuditLog(managerName, "TIMESHEET_APPROVE", `Approved timesheet entry ${timesheetId}`);
  }

  public static approveAllowanceForPayroll(allowanceId: string): void {
    const allowances = this.getAllowances();
    const updated = allowances.map((alw) =>
      alw.id === allowanceId ? { ...alw, payroll_status: "Approved for Payroll" as const } : alw
    );
    this.setItem(STORAGE_KEYS.ALLOWANCES, updated);
  }

  // Webhook Ingestion & Business Rules Engine
  public static simulateWebhookIngestion(payload: {
    engineer_code: string;
    project_code: string;
    work_date: string;
    deployment_status: "Onsite" | "Office";
    onsite_activity_type: OnsiteActivityType;
    site_location?: string;
    hours_logged: number;
  }): { success: boolean; message: string; staging: RawStagingSubmission; promotedTimesheet?: TimesheetEntry } {
    const responseId = `gform-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const signature = `hmac-sha256-${Math.random().toString(36).substring(2, 10)}`;

    const stagingItem: RawStagingSubmission = {
      responseId,
      submittedAt: timestamp,
      engineer_code: payload.engineer_code,
      project_code: payload.project_code,
      work_date: payload.work_date,
      deployment_status: payload.deployment_status,
      onsite_activity_type: payload.onsite_activity_type,
      site_location: payload.site_location,
      hours_logged: payload.hours_logged,
      signature,
      status: "Staged",
    };

    // Staging table append
    const currentStaging = this.getStagingSubmissions();
    this.setItem(STORAGE_KEYS.STAGING, [stagingItem, ...currentStaging]);

    // Perform Validation Chain (Section 3.2 of Proposal)
    const errors: string[] = [];
    const engineers = this.getEngineers();
    const projects = this.getProjects();
    const allocations = this.getAllocations();
    const timesheets = this.getTimesheets();

    const engineer = engineers.find((e) => e.employee_code === payload.engineer_code);
    if (!engineer) {
      errors.push(`Referential Error: Employee code '${payload.engineer_code}' does not exist.`);
    }

    const project = projects.find((p) => p.project_code === payload.project_code);
    if (!project) {
      errors.push(`Referential Error: Project code '${payload.project_code}' does not exist.`);
    } else if (project.status !== "Active") {
      errors.push(`Status Warning: Project '${payload.project_code}' is currently ${project.status}.`);
    }

    // Conditional Schema Validation
    if (payload.deployment_status === "Onsite") {
      if (payload.onsite_activity_type === "None") {
        errors.push("Deployment Error: Onsite entries require a valid activity type (Pre-FAT, FAT, or SAT).");
      }
      if (!payload.site_location || payload.site_location.trim() === "") {
        errors.push("Deployment Error: Site location is mandatory for Onsite entries.");
      }
    }

    // Deduplication check
    if (engineer) {
      const duplicateDate = timesheets.find(
        (ts) => ts.engineer_id === engineer.id && ts.work_date === payload.work_date
      );
      if (duplicateDate) {
        errors.push(`Duplicate Day Error: Engineer already logged a timesheet entry for date ${payload.work_date}.`);
      }
    }

    // Allocation Cross-check (Soft Warning vs Flagged)
    let isAllocationMismatch = false;
    if (engineer && project) {
      const allocation = allocations.find(
        (a) => a.engineer_id === engineer.id && a.project_id === project.id
      );
      if (!allocation) {
        isAllocationMismatch = true;
      }
    }

    // If hard validation errors occur
    const hardErrors = errors.filter((e) => !e.startsWith("Status Warning"));
    if (hardErrors.length > 0) {
      stagingItem.status = "Failed Validation";
      stagingItem.validationErrors = hardErrors;
      const updatedStaging = this.getStagingSubmissions().map((s) =>
        s.responseId === responseId ? stagingItem : s
      );
      this.setItem(STORAGE_KEYS.STAGING, updatedStaging);

      return {
        success: false,
        message: `Validation Failed: ${hardErrors.join(" ")}`,
        staging: stagingItem,
      };
    }

    // Promoted to Production Schema
    let validation_status: TimesheetEntry["validation_status"] = "Validated";
    let validation_notes: string | undefined = undefined;

    if (isAllocationMismatch) {
      validation_status = "Flagged";
      validation_notes = `Allocation Mismatch: Engineer ${engineer?.name} is not assigned to project ${project?.project_code} in Resource Allocations.`;
    }

    const newTimesheet: TimesheetEntry = {
      id: `ts-${Date.now()}`,
      engineer_id: engineer!.id,
      project_id: project!.id,
      work_date: payload.work_date,
      deployment_status: payload.deployment_status,
      onsite_activity_type: payload.onsite_activity_type,
      site_location: payload.deployment_status === "Onsite" ? payload.site_location || "Site" : null,
      hours_logged: payload.hours_logged,
      validation_status,
      validation_notes,
      source: "Google Forms Webhook",
      responseId,
      createdAt: timestamp,
    };

    stagingItem.status = "Promoted";
    const updatedStaging = this.getStagingSubmissions().map((s) =>
      s.responseId === responseId ? stagingItem : s
    );
    this.setItem(STORAGE_KEYS.STAGING, updatedStaging);

    const updatedTimesheets = [newTimesheet, ...timesheets];
    this.setItem(STORAGE_KEYS.TIMESHEETS, updatedTimesheets);

    // Compute Allowance if Onsite and Validated
    if (validation_status === "Validated" && payload.deployment_status === "Onsite") {
      this.recalculateAllowancesForEntry(newTimesheet);
    }

    this.addAuditLog(
      "Ingestion Webhook Bridge",
      "WEBHOOK_INSPECT_PROMOTE",
      `Processed payload ${responseId} -> Promoted to Timesheets (${validation_status})`
    );

    return {
      success: true,
      message: isAllocationMismatch
        ? "Submitted successfully with soft warning (Flagged for Manager Approval)."
        : "Submitted and promoted successfully (Validated).",
      staging: stagingItem,
      promotedTimesheet: newTimesheet,
    };
  }

  private static recalculateAllowancesForEntry(ts: TimesheetEntry): void {
    if (ts.deployment_status !== "Onsite" || ts.onsite_activity_type === "None") return;

    const policies = this.getPolicies();
    const policy = policies.find((p) => p.activity_type === ts.onsite_activity_type);
    if (!policy) return;

    const allowances = this.getAllowances();
    // Check dedup guard
    const exists = allowances.find(
      (a) => a.engineer_id === ts.engineer_id && a.work_date === ts.work_date
    );
    if (exists) return;

    const newAllowance: AllowanceRecord = {
      id: `alw-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timesheet_entry_id: ts.id,
      engineer_id: ts.engineer_id,
      policy_id: policy.id,
      work_date: ts.work_date,
      activity_type: ts.onsite_activity_type,
      amount_idr: policy.amount_idr,
      payroll_status: "Pending Payroll Approval",
      payroll_period: "July 2026",
      createdAt: new Date().toISOString(),
    };

    this.setItem(STORAGE_KEYS.ALLOWANCES, [newAllowance, ...allowances]);
  }

  public static addAuditLog(actor: string, action: string, details: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      details,
    };
    this.setItem(STORAGE_KEYS.AUDIT, [newLog, ...logs]);
  }

  public static resetToInitialData(): void {
    this.setItem(STORAGE_KEYS.ENGINEERS, INITIAL_ENGINEERS);
    this.setItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    this.setItem(STORAGE_KEYS.ALLOCATIONS, INITIAL_ALLOCATIONS);
    this.setItem(STORAGE_KEYS.TIMESHEETS, INITIAL_TIMESHEETS);
    this.setItem(STORAGE_KEYS.POLICIES, INITIAL_POLICIES);
    this.setItem(STORAGE_KEYS.ALLOWANCES, INITIAL_ALLOWANCE_RECORDS);
    this.setItem(STORAGE_KEYS.STAGING, []);
    this.setItem(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
  }
}
