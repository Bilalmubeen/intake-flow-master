import { DropdownOption } from "@/types";

// Status Options (used across multiple fields)
export const STATUS_OPTIONS: DropdownOption[] = [
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "in_process", label: "In Process" },
  { value: "not_required", label: "Not Required" },
];

// Staff Assignment Options (defaults - will be overridden by admin-managed options)
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

// Practice/Facility Options (defaults - will be overridden by admin-managed options)
export const PRACTICE_FACILITY_OPTIONS: DropdownOption[] = [
  { value: "practice_1", label: "Practice 1" },
  { value: "practice_2", label: "Practice 2" },
  { value: "practice_3", label: "Practice 3" },
];

// US States for address fields
export const US_STATES: DropdownOption[] = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
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
