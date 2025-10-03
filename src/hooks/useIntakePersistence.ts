import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClientIntakeFormData } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";

export function useIntakePersistence(intakeId?: string) {
  const [loading, setLoading] = useState(false);
  const [currentIntakeId, setCurrentIntakeId] = useState<string | undefined>(intakeId);
  const { toast } = useToast();

  // Load intake data
  const loadIntake = async (id: string): Promise<ClientIntakeFormData | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("client_intakes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      return data?.data as ClientIntakeFormData;
    } catch (error) {
      console.error("Error loading intake:", error);
      toast({
        title: "Load Failed",
        description: "Could not load intake data",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Serialize data for JSON storage (convert Dates to ISO strings)
  const serializeData = (data: Partial<ClientIntakeFormData>): any => {
    const serialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof Date) {
        serialized[key] = value.toISOString();
      } else {
        serialized[key] = value;
      }
    }
    return serialized;
  };

  // Save entire intake
  const saveIntake = async (data: Partial<ClientIntakeFormData>): Promise<string | null> => {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      const serializedData = serializeData(data);

      if (currentIntakeId) {
        // Update existing
        const { error } = await supabase
          .from("client_intakes")
          .update({
            data: serializedData,
            organization_name: data.clientName || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentIntakeId);

        if (error) throw error;
        return currentIntakeId;
      } else {
        // Create new
        const { data: newIntake, error } = await supabase
          .from("client_intakes")
          .insert([{
            user_id: user.id,
            data: serializedData,
            organization_name: data.clientName || null,
            workflow_state: "draft",
          }])
          .select()
          .single();

        if (error) throw error;
        setCurrentIntakeId(newIntake.id);
        return newIntake.id;
      }
    } catch (error) {
      console.error("Error saving intake:", error);
      toast({
        title: "Save Failed",
        description: "Could not save intake data",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Save section with audit log
  const saveSection = async (
    sectionName: string,
    sectionData: Partial<ClientIntakeFormData>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      // First ensure we have an intake ID
      let intakeIdToUse = currentIntakeId;
      if (!intakeIdToUse) {
        intakeIdToUse = await saveIntake(sectionData);
        if (!intakeIdToUse) throw new Error("Could not create intake");
      }

      // Load current data
      const { data: currentIntake } = await supabase
        .from("client_intakes")
        .select("data")
        .eq("id", intakeIdToUse)
        .single();

      const currentData = currentIntake?.data as any || {};
      const mergedData = { ...currentData, ...serializeData(sectionData) };

      // Update intake with merged data
      const { error: updateError } = await supabase
        .from("client_intakes")
        .update({
          data: mergedData,
          organization_name: mergedData.clientName || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", intakeIdToUse);

      if (updateError) throw updateError;

      // Create audit log entry
      await supabase.from("intake_audit_log").insert([{
        intake_id: intakeIdToUse,
        user_id: user.id,
        action: "section_save",
        section: sectionName,
        changes: serializeData(sectionData),
      }]);

      return true;
    } catch (error) {
      console.error("Error saving section:", error);
      toast({
        title: "Save Failed",
        description: `Could not save ${sectionName}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    currentIntakeId,
    loadIntake,
    saveIntake,
    saveSection,
  };
}
