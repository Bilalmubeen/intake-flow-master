export type UserRole = "intake_user" | "reviewer_manager" | "administrator";

export type WorkflowState = "draft" | "submitted" | "in_review" | "approved" | "rejected" | "archived";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ClientIntakeRecord {
  id: string;
  
  // Client & Onboarding Info
  clientName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  practiceAddress: string;
  pointOfContact: string;
  
  // Credentialing & Compliance
  licenseNumbers: string;
  certificationExpiryDate: Date | null;
  complianceDocuments: string[];
  
  // Billing Setup
  payerEnrollmentStatus: string;
  clearinghouseSelection: string;
  providerNpiNumbers: string;
  
  // Enrollment Setup
  insurancePlans: {
    planId: string;
    enrollmentEffectiveDate: Date | null;
    notes?: string;
  }[];
  
  // Policies & Documentation
  policyAcknowledgment: boolean;
  policyFiles: string[];
  
  // SLAs & Meetings
  slaAgreedDate: Date | null;
  meetingCadence: string;
  
  // Progress Tracking
  status: WorkflowState;
  reviewerComments: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
  submittedAt?: Date;
  reviewedAt?: Date;
  statusHistory: StatusHistoryEntry[];
}

export interface StatusHistoryEntry {
  id: string;
  status: WorkflowState;
  timestamp: Date;
  userId: string;
  userName: string;
  comments?: string;
}

export interface DropdownOption {
  value: string;
  label: string;
}

export interface ValidationError {
  field: string;
  message: string;
}