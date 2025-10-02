import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { clientIntakeSchema, ClientIntakeFormData } from "@/lib/validations";
import { ClientInfoSection } from "./sections/ClientInfoSection";
import { CredentialingSection } from "./sections/CredentialingSection";
import { BillingSection } from "./sections/BillingSection";
import { EnrollmentSection } from "./sections/EnrollmentSection";
import { PoliciesSection } from "./sections/PoliciesSection";
import { SlaSection } from "./sections/SlaSection";
import { ProgressSection } from "./sections/ProgressSection";
import { ClientIntakeRecord, WorkflowState } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Save, Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSectionSave } from "@/hooks/useSectionSave";
import { useToast } from "@/hooks/use-toast";

interface ClientIntakeFormProps {
  initialData?: Partial<ClientIntakeRecord>;
  onSave: (data: ClientIntakeFormData, status: WorkflowState) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
  currentStatus?: WorkflowState;
}

export function ClientIntakeForm({ 
  initialData, 
  onSave, 
  onCancel,
  isEditing = false,
  currentStatus = "draft"
}: ClientIntakeFormProps) {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ClientIntakeFormData>({
    resolver: zodResolver(clientIntakeSchema),
    defaultValues: {
      clientName: initialData?.clientName || "",
      contactName: initialData?.contactName || "",
      contactEmail: initialData?.contactEmail || "",
      contactPhone: initialData?.contactPhone || "",
      practiceAddress: initialData?.practiceAddress || "",
      pointOfContact: initialData?.pointOfContact || "",
      startDate: initialData?.startDate || undefined,
      kickoffCallCompleted: initialData?.kickoffCallCompleted || "pending",
      kickoffCallDate: initialData?.kickoffCallDate || undefined,
      relationshipManager: initialData?.relationshipManager || "",
      assignedAccountManager: initialData?.assignedAccountManager || "",
      assignedBillingLead: initialData?.assignedBillingLead || "",
      assignedCredentialingLead: initialData?.assignedCredentialingLead || "",
      assignedITLead: initialData?.assignedITLead || "",
      practiceFacilityName: initialData?.practiceFacilityName || "",
      practiceFacilityAddress: initialData?.practiceFacilityAddress || "",
      licenseNumbers: initialData?.licenseNumbers || "",
      certificationExpiryDate: initialData?.certificationExpiryDate || undefined,
      complianceDocuments: initialData?.complianceDocuments || [],
      medicareEnrollmentStatus: initialData?.medicareEnrollmentStatus || "pending",
      medicaidEnrollmentStatus: initialData?.medicaidEnrollmentStatus || "pending",
      commercialPayerEnrollmentStatus: initialData?.commercialPayerEnrollmentStatus || "pending",
      caqhProfileStatus: initialData?.caqhProfileStatus || "pending",
      pecosAccessReceived: initialData?.pecosAccessReceived || false,
      credentialingTrackerCreated: initialData?.credentialingTrackerCreated || false,
      w9Received: initialData?.w9Received || false,
      licenseCopyReceived: initialData?.licenseCopyReceived || false,
      deaCopyReceived: initialData?.deaCopyReceived || false,
      boardCertReceived: initialData?.boardCertReceived || false,
      degreeCertReceived: initialData?.degreeCertReceived || false,
      malpracticeCOIReceived: initialData?.malpracticeCOIReceived || false,
      payerEnrollmentStatus: initialData?.payerEnrollmentStatus || "pending",
      clearinghouseSelection: initialData?.clearinghouseSelection || "",
      providerNpiNumbers: initialData?.providerNpiNumbers || "",
      billingPathway: initialData?.billingPathway || "",
      chargeMasterCreated: initialData?.chargeMasterCreated || false,
      feeSchedulePercentage: initialData?.feeSchedulePercentage || undefined,
      payerFeeScheduleUploaded: initialData?.payerFeeScheduleUploaded || false,
      testClaimsSubmitted: initialData?.testClaimsSubmitted || false,
      insurancePlans: initialData?.insurancePlans || [],
      eraEnrollmentStatus: initialData?.eraEnrollmentStatus || "pending",
      ediEnrollmentStatus: initialData?.ediEnrollmentStatus || "pending",
      eftEnrollmentStatus: initialData?.eftEnrollmentStatus || "pending",
      simpliBillPortalSetup: initialData?.simpliBillPortalSetup || false,
      sftpSetupComplete: initialData?.sftpSetupComplete || false,
      eligibilityToolAccess: initialData?.eligibilityToolAccess || false,
      allPortalAccessComplete: initialData?.allPortalAccessComplete || false,
      loginCredentialsShared: initialData?.loginCredentialsShared || false,
      portalTestingCompleted: initialData?.portalTestingCompleted || false,
      policyAcknowledgment: initialData?.policyAcknowledgment || false,
      policyFiles: initialData?.policyFiles || [],
      patientStatementProcessFinalized: initialData?.patientStatementProcessFinalized || false,
      refundPolicyFinalized: initialData?.refundPolicyFinalized || false,
      creditBalancePolicyFinalized: initialData?.creditBalancePolicyFinalized || false,
      patientCallHandlingSetup: initialData?.patientCallHandlingSetup || false,
      billingManualDelivered: initialData?.billingManualDelivered || false,
      userGuideDelivered: initialData?.userGuideDelivered || false,
      simpliBillAppOffered: initialData?.simpliBillAppOffered || false,
      reportingRequirementsProvided: initialData?.reportingRequirementsProvided || false,
      slaAgreedDate: initialData?.slaAgreedDate || undefined,
      meetingCadence: initialData?.meetingCadence || "",
      slaChargeLagSet: initialData?.slaChargeLagSet || false,
      slaPaymentPostingSet: initialData?.slaPaymentPostingSet || false,
      slaDenialFollowUpSet: initialData?.slaDenialFollowUpSet || false,
      weeklyInternalMeetingsSetup: initialData?.weeklyInternalMeetingsSetup || false,
      weeklyClientMeetingsSetup: initialData?.weeklyClientMeetingsSetup || false,
      reviewerComments: initialData?.reviewerComments || "",
      tasksCompletedPercentage: initialData?.tasksCompletedPercentage || undefined,
    },
  });

  const canEdit = currentStatus === "draft" || currentStatus === "rejected";
  const canSubmit = hasPermission("intake_user") && canEdit;
  const showProgressSection = hasPermission(["reviewer_manager", "administrator"]);

  // Section save handler
  const handleSectionSave = async (sectionData: Partial<ClientIntakeFormData>) => {
    try {
      await onSave(sectionData, currentStatus);
      // Don't navigate - sections remain editable after save
    } catch (error) {
      throw error; // Let useSectionSave handle the error
    }
  };

  const { saveSection: saveSectionBase, isSaving } = useSectionSave(form, handleSectionSave);

  // Define section field mappings
  const sectionFields = {
    clientInfo: [
      'clientName', 'contactName', 'contactEmail', 'contactPhone', 'practiceAddress',
      'pointOfContact', 'startDate', 'kickoffCallCompleted', 'kickoffCallDate',
      'relationshipManager', 'assignedAccountManager', 'assignedBillingLead',
      'assignedCredentialingLead', 'assignedITLead', 'practiceFacilityName',
      'practiceFacilityAddress'
    ] as (keyof ClientIntakeFormData)[],
    credentialing: [
      'licenseNumbers', 'certificationExpiryDate', 'complianceDocuments',
      'medicareEnrollmentStatus', 'medicaidEnrollmentStatus', 'commercialPayerEnrollmentStatus',
      'caqhProfileStatus', 'pecosAccessReceived', 'credentialingTrackerCreated',
      'w9Received', 'licenseCopyReceived', 'deaCopyReceived', 'boardCertReceived',
      'degreeCertReceived', 'malpracticeCOIReceived'
    ] as (keyof ClientIntakeFormData)[],
    billing: [
      'payerEnrollmentStatus', 'clearinghouseSelection', 'providerNpiNumbers',
      'billingPathway', 'chargeMasterCreated', 'feeSchedulePercentage',
      'payerFeeScheduleUploaded', 'testClaimsSubmitted'
    ] as (keyof ClientIntakeFormData)[],
    enrollment: [
      'insurancePlans', 'eraEnrollmentStatus', 'ediEnrollmentStatus', 'eftEnrollmentStatus',
      'simpliBillPortalSetup', 'sftpSetupComplete', 'eligibilityToolAccess',
      'allPortalAccessComplete', 'loginCredentialsShared', 'portalTestingCompleted'
    ] as (keyof ClientIntakeFormData)[],
    policies: [
      'policyAcknowledgment', 'policyFiles', 'patientStatementProcessFinalized',
      'refundPolicyFinalized', 'creditBalancePolicyFinalized', 'patientCallHandlingSetup',
      'billingManualDelivered', 'userGuideDelivered', 'simpliBillAppOffered',
      'reportingRequirementsProvided'
    ] as (keyof ClientIntakeFormData)[],
    sla: [
      'slaAgreedDate', 'meetingCadence', 'slaChargeLagSet', 'slaPaymentPostingSet',
      'slaDenialFollowUpSet', 'weeklyInternalMeetingsSetup', 'weeklyClientMeetingsSetup'
    ] as (keyof ClientIntakeFormData)[],
  };

  const createSectionSaveHandler = (sectionKey: keyof typeof sectionFields) => async () => {
    await saveSectionBase(sectionFields[sectionKey]);
  };

  const handleSave = async (status: WorkflowState) => {
    setIsSubmitting(true);
    try {
      const data = form.getValues();
      await onSave(data, status);
      if (status === "submitted") {
        navigate("/records");
      }
    } catch (error) {
      console.error("Error saving form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    handleSave("draft");
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    await handleSave("submitted");
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onCancel ? onCancel() : navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit Client Intake" : "New Client Intake"}
            </h1>
            <p className="text-muted-foreground">
              Complete all required fields and submit for review
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client & Onboarding Info */}
          <Card>
            <CardHeader>
              <CardTitle>Client & Onboarding Information</CardTitle>
              <CardDescription>
                Basic client details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientInfoSection 
                form={form} 
                disabled={!canEdit}
                onSaveSection={createSectionSaveHandler('clientInfo')}
                isSaving={isSaving}
              />
            </CardContent>
          </Card>

          {/* Credentialing & Compliance */}
          <Card>
            <CardHeader>
              <CardTitle>Credentialing & Compliance</CardTitle>
              <CardDescription>
                License information and compliance documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CredentialingSection form={form} disabled={!canEdit} />
            </CardContent>
          </Card>

          {/* Billing Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Setup</CardTitle>
              <CardDescription>
                Payer enrollment and provider information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BillingSection form={form} disabled={!canEdit} />
            </CardContent>
          </Card>

          {/* Enrollment Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Setup</CardTitle>
              <CardDescription>
                Insurance plans and enrollment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnrollmentSection form={form} disabled={!canEdit} />
            </CardContent>
          </Card>

          {/* Policies & Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>Policies & Documentation</CardTitle>
              <CardDescription>
                Policy acknowledgment and file attachments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PoliciesSection form={form} disabled={!canEdit} />
            </CardContent>
          </Card>

          {/* SLAs & Meetings */}
          <Card>
            <CardHeader>
              <CardTitle>SLAs & Meetings</CardTitle>
              <CardDescription>
                Service level agreements and meeting schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SlaSection form={form} disabled={!canEdit} />
            </CardContent>
          </Card>

          {/* Progress Tracking - Only for reviewers/admins */}
          {showProgressSection && (
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Review status and comments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressSection form={form} disabled={false} />
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          {canEdit && (
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              
              {canSubmit && (
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Review
                </Button>
              )}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}