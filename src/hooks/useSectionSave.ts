import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ClientIntakeFormData } from "@/lib/validations";

export function useSectionSave(
  form: UseFormReturn<ClientIntakeFormData>,
  onSave: (data: Partial<ClientIntakeFormData>) => Promise<boolean>
) {
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const { toast } = useToast();

  const saveSection = async (sectionFields: (keyof ClientIntakeFormData)[]) => {
    setIsSaving(true);
    try {
      // Extract only the fields for this section
      const sectionData: Partial<ClientIntakeFormData> = {};
      
      // Validate section fields
      const validationResults = await Promise.all(
        sectionFields.map((field) => form.trigger(field))
      );

      const isValid = validationResults.every((result) => result === true);

      if (!isValid) {
        toast({
          title: "Validation Error",
          description: "Please fix the errors in this section before saving.",
          variant: "destructive",
        });
        return;
      }

      // Get section data
      sectionFields.forEach((field) => {
        (sectionData as any)[field] = form.getValues(field);
      });

      // Save the section
      const success = await onSave(sectionData);

      if (success) {
        setIsEditMode(false);
        toast({
          title: "Section Saved",
          description: "This section has been saved successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save section. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const enableEdit = () => {
    setIsEditMode(true);
  };

  return { saveSection, isSaving, isEditMode, enableEdit };
}
