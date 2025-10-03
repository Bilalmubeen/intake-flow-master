import { z } from "zod";

export const clientIntakeSchema = z.object({
  // Client & Onboarding Info
  clientName: z.string()
    .trim()
    .min(1, "Organization name is required")
    .max(100, "Organization name must be less than 100 characters"),
  
  contactName: z.string()
    .trim()
    .min(1, "Contact name is required")
    .max(100, "Contact name must be less than 100 characters"),
  
  contactEmail: z.string()
    .trim()
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters"),
  
  contactPhone: z.string()
    .trim()
    .min(1, "Contact phone is required")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format"),
  
  practiceAddress: z.string()
    .trim()
    .min(1, "Practice address is required")
    .max(500, "Address must be less than 500 characters"),
  
  practiceState: z.string()
    .min(1, "State is required"),
  
  practiceZipCode: z.string()
    .min(5, "Zip code must be 5 digits")
    .max(5, "Zip code must be 5 digits")
    .regex(/^\d{5}$/, "Zip code must be exactly 5 digits"),
  
  pointOfContact: z.string()
    .min(1, "Point of contact is required"),

  startDate: z.date({
    required_error: "Start date is required",
  }).nullable(),
  
  kickoffCallCompleted: z.string().default("pending"),
  
  kickoffCallDate: z.date().nullable().optional(),
  
  relationshipManager: z.string()
    .min(1, "Relationship Manager is required"),
  
  assignedAccountManager: z.string()
    .min(1, "Assigned Account Manager is required"),
  
  assignedBillingLead: z.string()
    .min(1, "Assigned Billing Lead is required"),
  
  assignedCredentialingLead: z.string()
    .min(1, "Assigned Credentialing Lead is required"),
  
  assignedITLead: z.string().default(""),
  
  practiceFacilityName: z.string().default(""),
  
  practiceFacilityAddress: z.string().default(""),
  
  // Credentialing & Compliance
  licenseNumbers: z.string()
    .trim()
    .min(1, "License numbers are required")
    .max(200, "License numbers must be less than 200 characters"),
  
  certificationExpiryDate: z.date({
    required_error: "Certification expiry date is required"
  }).refine(
    (date) => date > new Date(),
    "Certification expiry date must be in the future"
  ),
  
  complianceDocuments: z.array(z.string()),

  medicareEnrollmentStatus: z.string().default("pending"),
  medicaidEnrollmentStatus: z.string().default("pending"),
  commercialPayerEnrollmentStatus: z.string().default("pending"),
  caqhProfileStatus: z.string().default("pending"),
  pecosAccessReceived: z.boolean().default(false),
  credentialingTrackerCreated: z.boolean().default(false),
  w9Received: z.boolean().default(false),
  licenseCopyReceived: z.boolean().default(false),
  deaCopyReceived: z.boolean().default(false),
  boardCertReceived: z.boolean().default(false),
  degreeCertReceived: z.boolean().default(false),
  malpracticeCOIReceived: z.boolean().default(false),
  
  // Billing Setup
  payerEnrollmentStatus: z.string()
    .min(1, "Payer enrollment status is required"),
  
  clearinghouseSelection: z.string()
    .min(1, "Clearinghouse selection is required"),
  
  providerNpiNumbers: z.string()
    .trim()
    .min(1, "Provider NPI numbers are required")
    .regex(/^[\d\s,]+$/, "NPI numbers must contain only digits, spaces, and commas"),

  billingPathway: z.string().default(""),
  chargeMasterCreated: z.boolean().default(false),
  feeSchedulePercentage: z.number().min(0).max(100).nullable().optional(),
  payerFeeScheduleUploaded: z.boolean().default(false),
  testClaimsSubmitted: z.boolean().default(false),
  
  // Enrollment Setup
  insurancePlans: z.array(z.object({
    planId: z.string(),
    enrollmentEffectiveDate: z.date({
      required_error: "Enrollment effective date is required"
    }),
    notes: z.string()
      .max(2000, "Notes must be less than 2000 characters")
      .optional()
      .default("")
  })).min(1, "At least one insurance plan must be selected"),

  eraEnrollmentStatus: z.string().default("pending"),
  ediEnrollmentStatus: z.string().default("pending"),
  eftEnrollmentStatus: z.string().default("pending"),
  simpliBillPortalSetup: z.boolean().default(false),
  sftpSetupComplete: z.boolean().default(false),
  eligibilityToolAccess: z.boolean().default(false),
  allPortalAccessComplete: z.boolean().default(false),
  loginCredentialsShared: z.boolean().default(false),
  portalTestingCompleted: z.boolean().default(false),
  
  // Policies & Documentation
  policyAcknowledgment: z.boolean()
    .refine((val) => val === true, "Policy acknowledgment is required"),
  
  policyFiles: z.array(z.string()),

  patientStatementProcessFinalized: z.boolean().default(false),
  refundPolicyFinalized: z.boolean().default(false),
  creditBalancePolicyFinalized: z.boolean().default(false),
  patientCallHandlingSetup: z.boolean().default(false),
  billingManualDelivered: z.boolean().default(false),
  userGuideDelivered: z.boolean().default(false),
  simpliBillAppOffered: z.boolean().default(false),
  reportingRequirementsProvided: z.boolean().default(false),
  
  // SLAs & Meetings
  slaAgreedDate: z.date({
    required_error: "SLA agreed date is required"
  }),
  
  meetingCadence: z.string()
    .min(1, "Meeting cadence is required"),

  slaChargeLagSet: z.boolean().default(false),
  slaPaymentPostingSet: z.boolean().default(false),
  slaDenialFollowUpSet: z.boolean().default(false),
  weeklyInternalMeetingsSetup: z.boolean().default(false),
  weeklyClientMeetingsSetup: z.boolean().default(false),
  
  // Progress Tracking
  reviewerComments: z.string()
    .max(2000, "Reviewer comments must be less than 2000 characters")
    .optional(),

  tasksCompletedPercentage: z.number().min(0).max(100).nullable().optional(),
});

export type ClientIntakeFormData = z.infer<typeof clientIntakeSchema>;

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateNPI = (npi: string): boolean => {
  // NPI numbers are 10-digit numbers
  const npiRegex = /^\d{10}$/;
  return npiRegex.test(npi.replace(/[\s,]/g, ''));
};

export const checkDuplicateClientName = (name: string, existingRecords: any[]): boolean => {
  return existingRecords.some(record => 
    record.clientName.toLowerCase() === name.toLowerCase()
  );
};
