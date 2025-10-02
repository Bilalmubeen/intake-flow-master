import { DropdownOption } from "@/types";

// Status Options (used across multiple fields)
export const STATUS_OPTIONS: DropdownOption[] = [
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "in_process", label: "In Process" },
  { value: "not_required", label: "Not Required" },
];

// Staff Assignment Options
export const ACCOUNT_MANAGER_OPTIONS: DropdownOption[] = [
  { value: "murshid", label: "Murshid" },
  { value: "bisma", label: "Bisma" },
  { value: "sarah", label: "Sarah" },
];

export const STAFF_OPTIONS: DropdownOption[] = [
  { value: "staff_1", label: "Staff Member 1" },
  { value: "staff_2", label: "Staff Member 2" },
  { value: "staff_3", label: "Staff Member 3" },
];

// Billing Options
export const BILLING_PATHWAY_OPTIONS: DropdownOption[] = [
  { value: "centralized", label: "Centralized" },
  { value: "decentralized", label: "Decentralized" },
];

export const CLEARINGHOUSE_OPTIONS: DropdownOption[] = [
  { value: "waystar", label: "Waystar" },
  { value: "availity", label: "Availity" },
  { value: "change_healthcare", label: "Change Healthcare" },
  { value: "zirmed", label: "Zirmed" },
];

// Practice/Facility Options
export const PRACTICE_FACILITY_OPTIONS: DropdownOption[] = [
  { value: "practice_1", label: "Practice 1" },
  { value: "practice_2", label: "Practice 2" },
  { value: "practice_3", label: "Practice 3" },
];

// Legacy/Compatibility Options
export const POINT_OF_CONTACT_OPTIONS: DropdownOption[] = [
  { value: "primary_physician", label: "Primary Physician" },
  { value: "practice_manager", label: "Practice Manager" },
  { value: "billing_manager", label: "Billing Manager" },
  { value: "office_manager", label: "Office Manager" },
  { value: "clinical_director", label: "Clinical Director" }
];

export const PAYER_ENROLLMENT_STATUS_OPTIONS: DropdownOption[] = STATUS_OPTIONS;

export const INSURANCE_PLANS_OPTIONS: DropdownOption[] = [
  { value: "aetna", label: "Aetna" },
  { value: "anthem", label: "Anthem" },
  { value: "blue_cross", label: "Blue Cross Blue Shield" },
  { value: "cigna", label: "Cigna" },
  { value: "humana", label: "Humana" },
  { value: "medicare", label: "Medicare" },
  { value: "medicaid", label: "Medicaid" },
  { value: "tricare", label: "TRICARE" }
];

export const MEETING_CADENCE_OPTIONS: DropdownOption[] = [
  { value: "weekly", label: "Weekly" },
  { value: "bi_weekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "as_needed", label: "As Needed" }
];

export const WORKFLOW_STATE_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
  archived: "Archived"
};

export const WORKFLOW_STATE_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  submitted: "bg-warning text-warning-foreground",
  in_review: "bg-primary text-primary-foreground",
  approved: "bg-success text-success-foreground",
  rejected: "bg-destructive text-destructive-foreground",
  archived: "bg-secondary text-secondary-foreground"
};
