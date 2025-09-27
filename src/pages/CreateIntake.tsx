import { ClientIntakeForm } from "@/components/forms/ClientIntakeForm";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { ClientIntakeFormData } from "@/lib/validations";
import { WorkflowState } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { checkDuplicateClientName } from "@/lib/validations";

export function CreateIntake() {
  const { createRecord, records } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = async (data: ClientIntakeFormData, status: WorkflowState) => {
    // Check for duplicate client name
    if (checkDuplicateClientName(data.clientName, records)) {
      toast({
        title: "Duplicate Client Name",
        description: "A client with this name already exists. Please use a different name.",
        variant: "destructive"
      });
      return;
    }

    try {
      const recordId = await createRecord({
        ...data,
        status,
        insurancePlans: data.insurancePlans.map(plan => ({
          planId: plan.planId,
          enrollmentEffectiveDate: plan.enrollmentEffectiveDate,
          notes: plan.notes || ""
        }))
      });

      if (status === "submitted") {
        toast({
          title: "Intake Submitted",
          description: "Your client intake has been submitted for review."
        });
      } else {
        toast({
          title: "Draft Saved",
          description: "Your client intake has been saved as a draft."
        });
      }

      navigate("/records");
    } catch (error) {
      console.error("Error creating record:", error);
      toast({
        title: "Error",
        description: "Failed to save the intake record. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (!user) {
    return <div>Please log in to create an intake record.</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <ClientIntakeForm
        onSave={handleSave}
        onCancel={handleCancel}
        isEditing={false}
      />
    </div>
  );
}