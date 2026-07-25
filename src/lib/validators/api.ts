import { z } from "zod";

/**
 * Common validation schemas for API requests
 */

// Project validation
export const projectSchema = z.object({
  project_code: z.string().min(1, "Project code is required").max(50),
  name: z.string().min(1, "Project name is required").max(200),
  client_name: z.string().optional(),
  location: z.string().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format").optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format").optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// Timesheet validation
export const timesheetSchema = z.object({
  engineer_id: z.string().min(1, "Engineer ID is required"),
  project_id: z.string().min(1, "Project ID is required"),
  work_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Work date must be in YYYY-MM-DD format"),
  deployment_status: z.enum(["Onsite", "Office"]).optional(),
  onsite_activity_type: z.enum(["Pre-FAT", "FAT", "SAT", "None"]).optional(),
  site_location: z.string().optional().nullable(),
  hours_logged: z.number().min(0).max(24).optional(),
});

export type TimesheetInput = z.infer<typeof timesheetSchema>;

// Allowance approval validation
export const allowanceApprovalSchema = z.object({
  allowanceId: z.string().min(1, "Allowance ID is required"),
});

// User role update validation
export const userRoleUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["engineer", "manager", "admin"]),
});

// Audit log creation validation
export const auditLogSchema = z.object({
  actor: z.string().min(1, "Actor is required"),
  action: z.string().min(1, "Action is required"),
  details: z.string().optional(),
});

// Google Forms webhook ingestion validation
export const webhookIngestSchema = z.object({
  engineer_code: z.string().min(1, "Engineer code is required").max(50),
  project_code: z.string().min(1, "Project code is required").max(50),
  work_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Work date must be in YYYY-MM-DD format"),
  deployment_status: z.enum(["Onsite", "Office"]),
  onsite_activity_type: z.enum(["Pre-FAT", "FAT", "SAT", "None"]).optional(),
  site_location: z.string().optional().nullable(),
  hours_logged: z.union([z.string(), z.number()]).transform(val => Number(val)).optional(),
  signature: z.string().optional(),
});

export type WebhookIngestInput = z.infer<typeof webhookIngestSchema>;

// Login validation
export const loginSchema = z.object({
  provider: z.enum(["admin", "credentials", "google", "github"]),
  email: z.string().email().optional(),
  username: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Validate request body against schema
 * Returns parsed data if valid, throws error if invalid
 */
export function validateRequest<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => 
      `${err.path.join(".")}: ${err.message}`
    );
    throw new Error(`Validation failed: ${errors.join(", ")}`);
  }
  
  return result.data;
}

/**
 * Safe validation that returns result object
 */
export function safeValidate<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => 
      `${err.path.join(".")}: ${err.message}`
    );
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
}
