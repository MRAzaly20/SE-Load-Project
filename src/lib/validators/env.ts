import { z } from "zod";

/**
 * Environment variable validation schema
 * Ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  DATABASE_URL: z.string().url({ message: "DATABASE_URL must be a valid PostgreSQL connection string" }),
  NEXTAUTH_SECRET: z.string().min(32, { message: "NEXTAUTH_SECRET must be at least 32 characters" }),
  JWT_SECRET: z.string().min(32, { message: "JWT_SECRET must be at least 32 characters" }).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // OAuth providers (optional but recommended)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),
  
  // Application settings
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables
 * Throws error if required variables are missing or invalid
 */
export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => 
      `${err.path.join(".")}: ${err.message}`
    );
    
    console.error("❌ Environment validation failed:");
    errors.forEach(err => console.error(`  - ${err}`));
    
    throw new Error(
      `Invalid environment configuration:\n${errors.join("\n")}`
    );
  }
  
  return result.data;
}

/**
 * Get validated environment config
 * Caches the result to avoid repeated validation
 */
let cachedEnv: EnvConfig | null = null;

export function getEnv(): EnvConfig {
  if (!cachedEnv) {
    cachedEnv = validateEnv();
  }
  return cachedEnv;
}

/**
 * Safe environment access with defaults
 */
export const env = {
  databaseUrl: process.env.DATABASE_URL || "",
  nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
  jwtSecret: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "",
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  
  // OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  githubId: process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID || "",
  githubSecret: process.env.GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET || "",
};

/**
 * Assert that critical secrets are configured
 * Call this during application startup
 */
export function assertCriticalSecrets() {
  const missing: string[] = [];
  
  if (!process.env.DATABASE_URL) {
    missing.push("DATABASE_URL");
  }
  
  if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32) {
    missing.push("NEXTAUTH_SECRET (min 32 characters)");
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing critical environment variables: ${missing.join(", ")}`
    );
  }
  
  console.log("✅ All critical environment variables are configured");
}
