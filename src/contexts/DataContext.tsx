import React, { createContext, useContext, useState, useEffect } from "react";
import { ClientIntakeRecord, WorkflowState, StatusHistoryEntry } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

interface DataContextType {
  records: ClientIntakeRecord[];
  createRecord: (data: Partial<ClientIntakeRecord>) => Promise<string>;
  updateRecord: (id: string, data: Partial<ClientIntakeRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  changeRecordStatus: (id: string, newStatus: WorkflowState, comments?: string) => Promise<void>;
  getRecord: (id: string) => ClientIntakeRecord | undefined;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<ClientIntakeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load saved records from localStorage
    const savedRecords = localStorage.getItem("dvp_records");
    if (savedRecords) {
      const parsedRecords = JSON.parse(savedRecords).map((record: any) => ({
        ...record,
        createdAt: new Date(record.createdAt),
        updatedAt: new Date(record.updatedAt),
        submittedAt: record.submittedAt ? new Date(record.submittedAt) : undefined,
        reviewedAt: record.reviewedAt ? new Date(record.reviewedAt) : undefined,
        certificationExpiryDate: record.certificationExpiryDate ? new Date(record.certificationExpiryDate) : null,
        startDate: record.startDate ? new Date(record.startDate) : null,
        kickoffCallDate: record.kickoffCallDate ? new Date(record.kickoffCallDate) : null,
        insurancePlans: record.insurancePlans?.map((plan: any) => ({
          ...plan,
          enrollmentEffectiveDate: plan.enrollmentEffectiveDate ? new Date(plan.enrollmentEffectiveDate) : null
        })) || [],
        slaAgreedDate: record.slaAgreedDate ? new Date(record.slaAgreedDate) : null,
        statusHistory: record.statusHistory.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }))
      }));
      setRecords(parsedRecords);
    }
  }, []);

  const saveRecords = (updatedRecords: ClientIntakeRecord[]) => {
    localStorage.setItem("dvp_records", JSON.stringify(updatedRecords));
    setRecords(updatedRecords);
  };

  const createRecord = async (data: Partial<ClientIntakeRecord>): Promise<string> => {
    if (!user) throw new Error("User not authenticated");
    
    setLoading(true);
    
    const newRecord: ClientIntakeRecord = {
      id: crypto.randomUUID(),
      // Client & Onboarding Info
      clientName: data.clientName || "",
      contactName: data.contactName || "",
      contactEmail: data.contactEmail || "",
      contactPhone: data.contactPhone || "",
      practiceAddress: data.practiceAddress || "",
      pointOfContact: data.pointOfContact || "",
      startDate: data.startDate || null,
      kickoffCallCompleted: data.kickoffCallCompleted || "pending",
      kickoffCallDate: data.kickoffCallDate || null,
      relationshipManager: data.relationshipManager || "",
      assignedAccountManager: data.assignedAccountManager || "",
      assignedBillingLead: data.assignedBillingLead || "",
      assignedCredentialingLead: data.assignedCredentialingLead || "",
      assignedITLead: data.assignedITLead || "",
      practiceFacilityName: data.practiceFacilityName || "",
      practiceFacilityAddress: data.practiceFacilityAddress || "",
      // Credentialing & Compliance
      licenseNumbers: data.licenseNumbers || "",
      certificationExpiryDate: data.certificationExpiryDate || null,
      complianceDocuments: data.complianceDocuments || [],
      medicareEnrollmentStatus: data.medicareEnrollmentStatus || "pending",
      medicaidEnrollmentStatus: data.medicaidEnrollmentStatus || "pending",
      commercialPayerEnrollmentStatus: data.commercialPayerEnrollmentStatus || "pending",
      caqhProfileStatus: data.caqhProfileStatus || "pending",
      pecosAccessReceived: data.pecosAccessReceived || false,
      credentialingTrackerCreated: data.credentialingTrackerCreated || false,
      w9Received: data.w9Received || false,
      licenseCopyReceived: data.licenseCopyReceived || false,
      deaCopyReceived: data.deaCopyReceived || false,
      boardCertReceived: data.boardCertReceived || false,
      degreeCertReceived: data.degreeCertReceived || false,
      malpracticeCOIReceived: data.malpracticeCOIReceived || false,
      // Billing Setup
      payerEnrollmentStatus: data.payerEnrollmentStatus || "pending",
      clearinghouseSelection: data.clearinghouseSelection || "",
      providerNpiNumbers: data.providerNpiNumbers || "",
      billingPathway: data.billingPathway || "",
      chargeMasterCreated: data.chargeMasterCreated || false,
      feeSchedulePercentage: data.feeSchedulePercentage || null,
      payerFeeScheduleUploaded: data.payerFeeScheduleUploaded || false,
      testClaimsSubmitted: data.testClaimsSubmitted || false,
      // Enrollment Setup
      insurancePlans: data.insurancePlans || [],
      eraEnrollmentStatus: data.eraEnrollmentStatus || "pending",
      ediEnrollmentStatus: data.ediEnrollmentStatus || "pending",
      eftEnrollmentStatus: data.eftEnrollmentStatus || "pending",
      simpliBillPortalSetup: data.simpliBillPortalSetup || false,
      sftpSetupComplete: data.sftpSetupComplete || false,
      eligibilityToolAccess: data.eligibilityToolAccess || false,
      allPortalAccessComplete: data.allPortalAccessComplete || false,
      loginCredentialsShared: data.loginCredentialsShared || false,
      portalTestingCompleted: data.portalTestingCompleted || false,
      // Policies & Documentation
      policyAcknowledgment: data.policyAcknowledgment || false,
      policyFiles: data.policyFiles || [],
      patientStatementProcessFinalized: data.patientStatementProcessFinalized || false,
      refundPolicyFinalized: data.refundPolicyFinalized || false,
      creditBalancePolicyFinalized: data.creditBalancePolicyFinalized || false,
      patientCallHandlingSetup: data.patientCallHandlingSetup || false,
      billingManualDelivered: data.billingManualDelivered || false,
      userGuideDelivered: data.userGuideDelivered || false,
      simpliBillAppOffered: data.simpliBillAppOffered || false,
      reportingRequirementsProvided: data.reportingRequirementsProvided || false,
      // SLAs & Meetings
      slaAgreedDate: data.slaAgreedDate || null,
      meetingCadence: data.meetingCadence || "",
      slaChargeLagSet: data.slaChargeLagSet || false,
      slaPaymentPostingSet: data.slaPaymentPostingSet || false,
      slaDenialFollowUpSet: data.slaDenialFollowUpSet || false,
      weeklyInternalMeetingsSetup: data.weeklyInternalMeetingsSetup || false,
      weeklyClientMeetingsSetup: data.weeklyClientMeetingsSetup || false,
      // Progress Tracking
      status: data.status || "draft",
      reviewerComments: data.reviewerComments || "",
      tasksCompletedPercentage: data.tasksCompletedPercentage || null,
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.id,
      lastModifiedBy: user.id,
      statusHistory: [{
        id: crypto.randomUUID(),
        status: data.status || "draft",
        timestamp: new Date(),
        userId: user.id,
        userName: user.name,
        comments: "Record created"
      }]
    };

    const updatedRecords = [...records, newRecord];
    saveRecords(updatedRecords);
    
    setLoading(false);
    
    toast({
      title: "Record Created",
      description: "Client intake record has been created successfully."
    });
    
    return newRecord.id;
  };

  const updateRecord = async (id: string, data: Partial<ClientIntakeRecord>): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    
    setLoading(true);
    
    const updatedRecords = records.map(record => {
      if (record.id === id) {
        return {
          ...record,
          ...data,
          updatedAt: new Date(),
          lastModifiedBy: user.id
        };
      }
      return record;
    });
    
    saveRecords(updatedRecords);
    setLoading(false);
    
    toast({
      title: "Record Updated",
      description: "Client intake record has been updated successfully."
    });
  };

  const changeRecordStatus = async (id: string, newStatus: WorkflowState, comments?: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    
    setLoading(true);
    
    const statusEntry: StatusHistoryEntry = {
      id: crypto.randomUUID(),
      status: newStatus,
      timestamp: new Date(),
      userId: user.id,
      userName: user.name,
      comments
    };
    
    const updatedRecords = records.map(record => {
      if (record.id === id) {
        const updatedRecord = {
          ...record,
          status: newStatus === "rejected" ? "draft" : newStatus,
          updatedAt: new Date(),
          lastModifiedBy: user.id,
          statusHistory: [...record.statusHistory, statusEntry]
        };
        
        if (newStatus === "submitted") {
          updatedRecord.submittedAt = new Date();
        } else if (newStatus === "approved" || newStatus === "rejected") {
          updatedRecord.reviewedAt = new Date();
        }
        
        if (comments) {
          updatedRecord.reviewerComments = comments;
        }
        
        return updatedRecord;
      }
      return record;
    });
    
    saveRecords(updatedRecords);
    setLoading(false);
    
    // Trigger automation notifications
    triggerStatusChangeNotification(newStatus, comments);
    
    toast({
      title: "Status Updated",
      description: `Record status changed to ${newStatus.replace('_', ' ')}.`
    });
  };

  const deleteRecord = async (id: string): Promise<void> => {
    setLoading(true);
    const updatedRecords = records.filter(record => record.id !== id);
    saveRecords(updatedRecords);
    setLoading(false);
    
    toast({
      title: "Record Deleted",
      description: "Client intake record has been deleted successfully."
    });
  };

  const getRecord = (id: string): ClientIntakeRecord | undefined => {
    return records.find(record => record.id === id);
  };

  const triggerStatusChangeNotification = async (status: WorkflowState, comments?: string) => {
    const { notifyReviewerOnSubmit, notifyUserOnApproval, notifyUserOnRejection } = await import("@/lib/notifications");
    
    // Get the record that was just updated
    const record = records.find(r => r.status === status);
    if (!record || !user) return;
    
    if (status === "submitted") {
      await notifyReviewerOnSubmit(record, user.name);
    } else if (status === "approved") {
      await notifyUserOnApproval(record, user.name, comments);
    } else if (status === "rejected") {
      await notifyUserOnRejection(record, user.name, comments || "");
    }
  };

  return (
    <DataContext.Provider value={{
      records,
      createRecord,
      updateRecord,
      deleteRecord,
      changeRecordStatus,
      getRecord,
      loading
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
