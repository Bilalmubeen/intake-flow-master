import { ClientIntakeForm } from "@/components/forms/ClientIntakeForm";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { ClientIntakeFormData } from "@/lib/validations";
import { WorkflowState } from "@/types";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { checkDuplicateClientName } from "@/lib/validations";
import { useIntakePersistence } from "@/hooks/useIntakePersistence";
import { useState, useEffect } from "react";

export function CreateIntake() {
  const { id } = useParams();
  const { createRecord, records, updateRecord } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loadIntake, saveIntake, loading } = useIntakePersistence(id);
  const [initialData, setInitialData] = useState<Partial<ClientIntakeFormData>>();

  useEffect(() => {
    if (id) {
      loadExistingIntake();
    }
  }, [id]);

  const loadExistingIntake = async () => {
    if (!id) return;
    const data = await loadIntake(id);
    if (data) {
      setInitialData(data);
    }
  };

  const handleSave = async (data: Partial<ClientIntakeFormData>, status: WorkflowState) => {
    // Save to Supabase using persistence hook
    const intakeId = await saveIntake(data);
    
    if (!intakeId) {
      toast({
        title: "Error",
        description: "Failed to save the intake record. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (status === "submitted") {
      toast({
        title: "Intake Submitted",
        description: "Your client intake has been submitted for review."
      });
      navigate("/records");
    } else {
      toast({
        title: "Draft Saved",
        description: "Your client intake has been saved as a draft."
      });
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (!user) {
    return <div>Please log in to create an intake record.</div>;
  }

  if (loading && id) {
    return <div className="container mx-auto py-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <ClientIntakeForm
        initialData={initialData}
        onSave={handleSave}
        onCancel={handleCancel}
        isEditing={!!id}
        currentStatus={initialData ? "draft" : "draft"}
      />
    </div>
  );
}