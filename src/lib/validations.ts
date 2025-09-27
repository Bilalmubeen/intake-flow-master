import { z } from "zod";

export const clientIntakeSchema = z.object({
  // Client & Onboarding Info
  clientName: z.string()
    .trim()
    .min(1, "Client name is required")
    .max(100, "Client name must be less than 100 characters"),
  
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
  
  pointOfContact: z.string()
    .min(1, "Point of contact is required"),
  
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
  
  // Billing Setup
  payerEnrollmentStatus: z.string()
    .min(1, "Payer enrollment status is required"),
  
  clearinghouseSelection: z.string()
    .min(1, "Clearinghouse selection is required"),
  
  providerNpiNumbers: z.string()
    .trim()
    .min(1, "Provider NPI numbers are required")
    .regex(/^[\d\s,]+$/, "NPI numbers must contain only digits, spaces, and commas"),
  
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
  
  // Policies & Documentation
  policyAcknowledgment: z.boolean()
    .refine((val) => val === true, "Policy acknowledgment is required"),
  
  policyFiles: z.array(z.string()),
  
  // SLAs & Meetings
  slaAgreedDate: z.date({
    required_error: "SLA agreed date is required"
  }),
  
  meetingCadence: z.string()
    .min(1, "Meeting cadence is required"),
  
  // Progress Tracking
  reviewerComments: z.string()
    .max(2000, "Reviewer comments must be less than 2000 characters")
    .optional(),
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