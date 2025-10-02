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
  clientName: string; // Organization Name
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  practiceAddress: string;
  pointOfContact: string;
  startDate: Date | null;
  kickoffCallCompleted: string;
  kickoffCallDate: Date | null;
  assignedAccountManager: string;
  assignedBillingLead: string;
  assignedCredentialingLead: string;
  assignedITLead: string;
  practiceFacilityName: string;
  practiceFacilityAddress: string;
  
  // Credentialing & Compliance
  licenseNumbers: string;
  certificationExpiryDate: Date | null;
  complianceDocuments: string[];
  medicareEnrollmentStatus: string;
  medicaidEnrollmentStatus: string;
  commercialPayerEnrollmentStatus: string;
  caqhProfileStatus: string;
  pecosAccessReceived: boolean;
  credentialingTrackerCreated: boolean;
  w9Received: boolean;
  licenseCopyReceived: boolean;
  deaCopyReceived: boolean;
  boardCertReceived: boolean;
  degreeCertReceived: boolean;
  malpracticeCOIReceived: boolean;
  
  // Billing Setup
  payerEnrollmentStatus: string;
  clearinghouseSelection: string;
  providerNpiNumbers: string;
  billingPathway: string;
  chargeMasterCreated: boolean;
  feeSchedulePercentage: number | null;
  payerFeeScheduleUploaded: boolean;
  testClaimsSubmitted: boolean;
  
  // Enrollment Setup
  insurancePlans: {
    planId: string;
    enrollmentEffectiveDate: Date | null;
    notes?: string;
  }[];
  eraEnrollmentStatus: string;
  ediEnrollmentStatus: string;
  eftEnrollmentStatus: string;
  simpliBillPortalSetup: boolean;
  sftpSetupComplete: boolean;
  eligibilityToolAccess: boolean;
  allPortalAccessComplete: boolean;
  loginCredentialsShared: boolean;
  portalTestingCompleted: boolean;
  
  // Policies & Documentation
  policyAcknowledgment: boolean;
  policyFiles: string[];
  patientStatementProcessFinalized: boolean;
  refundPolicyFinalized: boolean;
  creditBalancePolicyFinalized: boolean;
  patientCallHandlingSetup: boolean;
  billingManualDelivered: boolean;
  userGuideDelivered: boolean;
  simpliBillAppOffered: boolean;
  reportingRequirementsProvided: boolean;
  
  // SLAs & Meetings
  slaAgreedDate: Date | null;
  meetingCadence: string;
  slaChargeLagSet: boolean;
  slaPaymentPostingSet: boolean;
  slaDenialFollowUpSet: boolean;
  weeklyInternalMeetingsSetup: boolean;
  weeklyClientMeetingsSetup: boolean;
  
  // Progress Tracking
  status: WorkflowState;
  reviewerComments: string;
  tasksCompletedPercentage: number | null;
  
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
