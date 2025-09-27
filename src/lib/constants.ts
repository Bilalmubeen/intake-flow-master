import { DropdownOption } from "@/types";

export const POINT_OF_CONTACT_OPTIONS: DropdownOption[] = [
  { value: "primary_physician", label: "Primary Physician" },
  { value: "practice_manager", label: "Practice Manager" },
  { value: "billing_manager", label: "Billing Manager" },
  { value: "office_manager", label: "Office Manager" },
  { value: "clinical_director", label: "Clinical Director" }
];

export const PAYER_ENROLLMENT_STATUS_OPTIONS: DropdownOption[] = [
  { value: "enrolled", label: "Enrolled" },
  { value: "pending", label: "Pending" },
  { value: "not_enrolled", label: "Not Enrolled" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" }
];

export const CLEARINGHOUSE_OPTIONS: DropdownOption[] = [
  { value: "change_healthcare", label: "Change Healthcare" },
  { value: "availity", label: "Availity" },
  { value: "relay_health", label: "Relay Health" },
  { value: "navinet", label: "NaviNet" },
  { value: "other", label: "Other" }
];

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