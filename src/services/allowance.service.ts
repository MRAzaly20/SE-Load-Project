import { prisma } from "@/lib/prisma";

/**
 * Allowance calculation service
 * Centralized business logic for allowance computation
 */

interface AllowanceCalculationParams {
  engineerId: string;
  workDate: string;
  deploymentStatus: string;
  onsiteActivityType: string;
  timesheetEntryId?: string;
}

interface AllowanceResult {
  created: boolean;
  allowance?: {
    id: string;
    amountIdr: number;
    activityType: string;
    payrollStatus: string;
  };
  message: string;
}

/**
 * Get current payroll period dynamically
 * Replaces hardcoded "July 2026" with actual current period
 */
export function getCurrentPayrollPeriod(): string {
  const now = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
}

/**
 * Calculate and create allowance record if eligible
 * Business rules:
 * - Must be Onsite deployment
 * - Must have valid onsite activity type (not "None")
 * - Must not already have an allowance for the same work date
 * - Timesheet must be Validated status
 */
export async function calculateAndCreateAllowance(
  params: AllowanceCalculationParams
): Promise<AllowanceResult> {
  const {
    engineerId,
    workDate,
    deploymentStatus,
    onsiteActivityType,
    timesheetEntryId,
  } = params;

  // Check eligibility
  if (deploymentStatus !== "Onsite") {
    return {
      created: false,
      message: "Allowance only applicable for Onsite deployment",
    };
  }

  if (!onsiteActivityType || onsiteActivityType === "None") {
    return {
      created: false,
      message: "No allowance for 'None' activity type",
    };
  }

  try {
    // Find matching allowance policy
    const policy = await prisma.allowancePolicy.findUnique({
      where: { activityType: onsiteActivityType },
    });

    if (!policy) {
      return {
        created: false,
        message: `No allowance policy found for activity type: ${onsiteActivityType}`,
      };
    }

    // Check if allowance already exists for this engineer on this date
    const existingAllowance = await prisma.allowanceRecord.findFirst({
      where: {
        engineerId,
        workDate,
      },
    });

    if (existingAllowance) {
      return {
        created: false,
        message: "Allowance already exists for this engineer on this date",
        allowance: {
          id: existingAllowance.id,
          amountIdr: existingAllowance.amountIdr,
          activityType: existingAllowance.activityType,
          payrollStatus: existingAllowance.payrollStatus,
        },
      };
    }

    // Create new allowance record
    const payrollPeriod = getCurrentPayrollPeriod();
    
    const newAllowance = await prisma.allowanceRecord.create({
      data: {
        timesheetEntryId: timesheetEntryId || "",
        engineerId,
        policyId: policy.id,
        workDate,
        activityType: onsiteActivityType,
        amountIdr: policy.amountIdr,
        payrollStatus: "Pending Payroll Approval",
        payrollPeriod,
      },
    });

    return {
      created: true,
      allowance: {
        id: newAllowance.id,
        amountIdr: newAllowance.amountIdr,
        activityType: newAllowance.activityType,
        payrollStatus: newAllowance.payrollStatus,
      },
      message: `Allowance of IDR ${policy.amountIdr.toLocaleString()} created for ${onsiteActivityType}`,
    };
  } catch (error) {
    console.error("Error calculating allowance:", error);
    throw new Error("Failed to calculate allowance");
  }
}

/**
 * Batch calculate allowances for multiple timesheet entries
 */
export async function batchCalculateAllowances(
  entries: Array<{
    engineerId: string;
    workDate: string;
    deploymentStatus: string;
    onsiteActivityType: string;
    timesheetEntryId: string;
  }>
): Promise<Array<AllowanceResult>> {
  const results: AllowanceResult[] = [];

  for (const entry of entries) {
    try {
      const result = await calculateAndCreateAllowance(entry);
      results.push(result);
    } catch (error) {
      results.push({
        created: false,
        message: `Error processing entry: ${(error as Error).message}`,
      });
    }
  }

  return results;
}

/**
 * Get total allowances for an engineer in a payroll period
 */
export async function getEngineerAllowanceTotal(
  engineerId: string,
  payrollPeriod: string
): Promise<number> {
  const records = await prisma.allowanceRecord.findMany({
    where: {
      engineerId,
      payrollPeriod,
      payrollStatus: {
        in: ["Approved for Payroll", "Paid"],
      },
    },
    select: {
      amountIdr: true,
    },
  });

  return records.reduce((total, record) => total + record.amountIdr, 0);
}

/**
 * Validate timesheet against allocation
 * Returns validation status and notes
 */
export async function validateTimesheetAllocation(
  engineerId: string,
  projectId: string
): Promise<{
  isValid: boolean;
  isAllocationMismatch: boolean;
  validationStatus: string;
  validationNotes?: string;
}> {
  const allocations = await prisma.resourceAllocation.findMany({
    where: {
      engineerId,
      projectId,
    },
  });

  const isAllocationMismatch = allocations.length === 0;

  return {
    isValid: !isAllocationMismatch,
    isAllocationMismatch,
    validationStatus: isAllocationMismatch ? "Flagged" : "Validated",
    validationNotes: isAllocationMismatch
      ? "Allocation mismatch: Engineer is not allocated to this project."
      : undefined,
  };
}
