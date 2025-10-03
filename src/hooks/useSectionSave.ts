import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ClientIntakeFormData } from "@/lib/validations";

export type SectionStatus = 'draft' | 'saved';

export function useSectionSave(
  form: UseFormReturn<ClientIntakeFormData>,
  onSave: (data: Partial<ClientIntakeFormData>, status: SectionStatus) => Promise<boolean>
) {
  const [isSaving, setIsSaving] = useState(false);
  const [sectionStatus, setSectionStatus] = useState<SectionStatus>('draft');
  const { toast } = useToast();

  const saveDraft = async (sectionFields: (keyof ClientIntakeFormData)[]) => {
    setIsSaving(true);
    try {
      const sectionData: Partial<ClientIntakeFormData> = {};
      
      // Get section data
      sectionFields.forEach((field) => {
        (sectionData as any)[field] = form.getValues(field);
      });

      // Save as draft
      const success = await onSave(sectionData, 'draft');

      if (success) {
        setSectionStatus('draft');
        toast({
          title: "Draft Saved",
          description: "This section has been saved as draft.",
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveSection = async (sectionFields: (keyof ClientIntakeFormData)[]) => {
    setIsSaving(true);
    try {
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

      // Save and finalize section
      const success = await onSave(sectionData, 'saved');

      if (success) {
        setSectionStatus('saved');
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
    setSectionStatus('draft');
  };

  return { saveSection, saveDraft, isSaving, sectionStatus, enableEdit };
}
