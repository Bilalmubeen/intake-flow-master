import { WorkflowState, ClientIntakeRecord } from "@/types";

/**
 * Notification helpers for workflow state changes
 * In production, these would integrate with email service, webhooks, etc.
 */

export interface NotificationPayload {
  event: string;
  timestamp: Date;
  record: ClientIntakeRecord;
  actor?: string;
  comments?: string;
}

/**
 * Send notification when record is submitted for review
 */
export async function notifyReviewerOnSubmit(record: ClientIntakeRecord, actor: string) {
  const payload: NotificationPayload = {
    event: "record.submitted",
    timestamp: new Date(),
    record,
    actor,
  };

  console.log("[Notification] Reviewer notified:", payload);
  
  // TODO: Integrate with email service
  // await sendEmail({
  //   to: "reviewer@truebilling.com",
  //   subject: `New Intake Submission: ${record.clientName}`,
  //   body: `A new client intake has been submitted for review.`
  // });
}

/**
 * Send notification when record is approved
 */
export async function notifyUserOnApproval(record: ClientIntakeRecord, actor: string, comments?: string) {
  const payload: NotificationPayload = {
    event: "record.approved",
    timestamp: new Date(),
    record,
    actor,
    comments,
  };

  console.log("[Notification] User notified of approval:", payload);

  // Send webhook if configured
  const webhookUrl = localStorage.getItem("webhook_url");
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("[Webhook] Sent approval notification to:", webhookUrl);
    } catch (error) {
      console.error("[Webhook] Failed to send:", error);
    }
  }

  // TODO: Send email to intake user
  // await sendEmail({
  //   to: record.contactEmail,
  //   subject: `Intake Approved: ${record.clientName}`,
  //   body: `Your client intake has been approved. ${comments || ""}`
  // });
}

/**
 * Send notification when record is rejected
 */
export async function notifyUserOnRejection(record: ClientIntakeRecord, actor: string, comments: string) {
  const payload: NotificationPayload = {
    event: "record.rejected",
    timestamp: new Date(),
    record,
    actor,
    comments,
  };

  console.log("[Notification] User notified of rejection:", payload);

  // TODO: Send email to intake user
  // await sendEmail({
  //   to: record.contactEmail,
  //   subject: `Intake Requires Revision: ${record.clientName}`,
  //   body: `Your client intake has been returned for revision. Reason: ${comments}`
  // });
}

/**
 * Send SLA reminder for records in review too long
 */
export async function sendSLAReminder(record: ClientIntakeRecord, daysInReview: number) {
  console.log(`[SLA Reminder] Record ${record.id} has been in review for ${daysInReview} days`);

  // TODO: Send reminder email
  // await sendEmail({
  //   to: "reviewer@truebilling.com",
  //   subject: `SLA Alert: ${record.clientName} - ${daysInReview} days in review`,
  //   body: `This record has been in review for ${daysInReview} business days.`
  // });
}

/**
 * Export record data for approved records
 */
export function exportRecordData(record: ClientIntakeRecord): Record<string, any> {
  return {
    id: record.id,
    clientName: record.clientName,
    contactEmail: record.contactEmail,
    contactPhone: record.contactPhone,
    practiceAddress: record.practiceAddress,
    pointOfContact: record.pointOfContact,
    licenseNumbers: record.licenseNumbers,
    certificationExpiryDate: record.certificationExpiryDate,
    payerEnrollmentStatus: record.payerEnrollmentStatus,
    clearinghouseSelection: record.clearinghouseSelection,
    providerNpiNumbers: record.providerNpiNumbers,
    insurancePlans: record.insurancePlans,
    policyAcknowledgment: record.policyAcknowledgment,
    slaAgreedDate: record.slaAgreedDate,
    meetingCadence: record.meetingCadence,
    status: record.status,
    approvedAt: record.reviewedAt,
  };
}
