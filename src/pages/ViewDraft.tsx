import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { ClientIntakeRecord } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

export function ViewDraft() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [draft, setDraft] = useState<ClientIntakeRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDraft(id);
    }
  }, [id]);

  const loadDraft = async (draftId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("client_intakes")
        .select("*")
        .eq("id", draftId)
        .single();

      if (error) throw error;
      
      if (data) {
        const formData = (data.data || {}) as any;
        setDraft({
          id: data.id,
          clientName: formData.clientName || '',
          contactName: formData.contactName || '',
          contactEmail: formData.contactEmail || '',
          contactPhone: formData.contactPhone || '',
          pointOfContact: formData.pointOfContact || '',
          startDate: formData.startDate,
          kickoffCallCompleted: formData.kickoffCallCompleted || 'pending',
          kickoffCallDate: formData.kickoffCallDate,
          relationshipManager: formData.relationshipManager || '',
          assignedAccountManager: formData.assignedAccountManager || '',
          assignedBillingLead: formData.assignedBillingLead || '',
          assignedCredentialingLead: formData.assignedCredentialingLead || '',
          assignedITLead: formData.assignedITLead,
          practiceAddress: formData.practiceAddress || '',
          practiceState: formData.practiceState,
          practiceZipCode: formData.practiceZipCode,
          practiceFacilityName: formData.practiceFacilityName,
          licenseNumbers: formData.licenseNumbers || '',
          certificationExpiryDate: formData.certificationExpiryDate,
          complianceDocuments: formData.complianceDocuments || [],
          medicareEnrollmentStatus: formData.medicareEnrollmentStatus || 'pending',
          medicaidEnrollmentStatus: formData.medicaidEnrollmentStatus || 'pending',
          commercialPayerEnrollmentStatus: formData.commercialPayerEnrollmentStatus || 'pending',
          caqhProfileStatus: formData.caqhProfileStatus || 'pending',
          pecosAccessReceived: formData.pecosAccessReceived || false,
          credentialingTrackerCreated: formData.credentialingTrackerCreated || false,
          w9Received: formData.w9Received || false,
          licenseCopyReceived: formData.licenseCopyReceived || false,
          deaCopyReceived: formData.deaCopyReceived || false,
          boardCertReceived: formData.boardCertReceived || false,
          degreeCertReceived: formData.degreeCertReceived || false,
          malpracticeCOIReceived: formData.malpracticeCOIReceived || false,
          payerEnrollmentStatus: formData.payerEnrollmentStatus || 'pending',
          clearinghouseSelection: formData.clearinghouseSelection || '',
          providerNpiNumbers: formData.providerNpiNumbers || '',
          billingPathway: formData.billingPathway || '',
          chargeMasterCreated: formData.chargeMasterCreated || false,
          feeSchedulePercentage: formData.feeSchedulePercentage,
          payerFeeScheduleUploaded: formData.payerFeeScheduleUploaded || false,
          testClaimsSubmitted: formData.testClaimsSubmitted || false,
          insurancePlans: formData.insurancePlans || [],
          eraEnrollmentStatus: formData.eraEnrollmentStatus || 'pending',
          ediEnrollmentStatus: formData.ediEnrollmentStatus || 'pending',
          eftEnrollmentStatus: formData.eftEnrollmentStatus || 'pending',
          simpliBillPortalSetup: formData.simpliBillPortalSetup || false,
          sftpSetupComplete: formData.sftpSetupComplete || false,
          eligibilityToolAccess: formData.eligibilityToolAccess || false,
          allPortalAccessComplete: formData.allPortalAccessComplete || false,
          loginCredentialsShared: formData.loginCredentialsShared || false,
          portalTestingCompleted: formData.portalTestingCompleted || false,
          policyAcknowledgment: formData.policyAcknowledgment || false,
          policyFiles: formData.policyFiles || [],
          patientStatementProcessFinalized: formData.patientStatementProcessFinalized || false,
          refundPolicyFinalized: formData.refundPolicyFinalized || false,
          creditBalancePolicyFinalized: formData.creditBalancePolicyFinalized || false,
          patientCallHandlingSetup: formData.patientCallHandlingSetup || false,
          billingManualDelivered: formData.billingManualDelivered || false,
          userGuideDelivered: formData.userGuideDelivered || false,
          simpliBillAppOffered: formData.simpliBillAppOffered || false,
          reportingRequirementsProvided: formData.reportingRequirementsProvided || false,
          slaAgreedDate: formData.slaAgreedDate,
          meetingCadence: formData.meetingCadence || '',
          slaChargeLagSet: formData.slaChargeLagSet || false,
          slaPaymentPostingSet: formData.slaPaymentPostingSet || false,
          slaDenialFollowUpSet: formData.slaDenialFollowUpSet || false,
          weeklyInternalMeetingsSetup: formData.weeklyInternalMeetingsSetup || false,
          weeklyClientMeetingsSetup: formData.weeklyClientMeetingsSetup || false,
          reviewerComments: formData.reviewerComments || '',
          tasksCompletedPercentage: formData.tasksCompletedPercentage,
          status: data.workflow_state as any,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          createdBy: data.user_id,
          lastModifiedBy: data.user_id,
          statusHistory: [],
        });
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!draft) {
    return <div className="p-6">Draft not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">View Draft</h1>
            <p className="text-muted-foreground">
              Read-only view of draft record
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/intake/${id}`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Draft
          </Link>
        </Button>
      </div>

      {/* Client & Onboarding Info */}
      <Card>
        <CardHeader>
          <CardTitle>Client & Onboarding Information</CardTitle>
          <CardDescription>
            Last updated: {draft.updatedAt ? format(new Date(draft.updatedAt), 'PPP') : 'N/A'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
              <p className="text-base">{draft.clientName || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contact Name</label>
              <p className="text-base">{draft.contactName || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contact Email</label>
              <p className="text-base">{draft.contactEmail || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contact Phone</label>
              <p className="text-base">{draft.contactPhone || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Point of Contact</label>
              <p className="text-base capitalize">{draft.pointOfContact?.replace('_', ' ') || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Start Date</label>
              <p className="text-base">{draft.startDate ? format(new Date(draft.startDate), 'PPP') : 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Team Assignments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Relationship Manager</label>
              <p className="text-base">{draft.relationshipManager || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Assigned Account Manager</label>
              <p className="text-base">{draft.assignedAccountManager || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Assigned Billing Lead</label>
              <p className="text-base">{draft.assignedBillingLead || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Assigned Credentialing Lead</label>
              <p className="text-base">{draft.assignedCredentialingLead || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Address */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <p className="text-base">{draft.practiceAddress || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">State</label>
              <p className="text-base">{draft.practiceState || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Zip Code</label>
              <p className="text-base">{draft.practiceZipCode || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
