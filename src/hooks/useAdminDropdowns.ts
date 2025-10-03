import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DropdownOption } from "@/types";

export function useAdminDropdowns(listName: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch dropdown options
  const { data: options = [], isLoading } = useQuery({
    queryKey: ["dropdown-options", listName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_dropdown_options")
        .select("*")
        .eq("list_name", listName)
        .order("sort_order");

      if (error) throw error;

      return data.map((item) => ({
        value: item.option_value,
        label: item.option_label,
      })) as DropdownOption[];
    },
  });

  // Add option
  const addOption = useMutation({
    mutationFn: async (option: { value: string; label: string }) => {
      // Get current max sort order
      const { data: existing } = await supabase
        .from("admin_dropdown_options")
        .select("sort_order")
        .eq("list_name", listName)
        .order("sort_order", { ascending: false })
        .limit(1);

      const maxOrder = existing?.[0]?.sort_order || 0;

      const { error } = await supabase.from("admin_dropdown_options").insert({
        list_name: listName,
        option_value: option.value,
        option_label: option.label,
        sort_order: maxOrder + 1,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropdown-options", listName] });
      toast({
        title: "Option Added",
        description: "The dropdown option has been added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Add Failed",
        description: error.message || "Could not add option",
        variant: "destructive",
      });
    },
  });

  // Delete option
  const deleteOption = useMutation({
    mutationFn: async (optionValue: string) => {
      const { error } = await supabase
        .from("admin_dropdown_options")
        .delete()
        .eq("list_name", listName)
        .eq("option_value", optionValue);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropdown-options", listName] });
      toast({
        title: "Option Deleted",
        description: "The dropdown option has been removed",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Could not delete option",
        variant: "destructive",
      });
    },
  });

  return {
    options,
    isLoading,
    addOption: addOption.mutate,
    deleteOption: deleteOption.mutate,
    isAdding: addOption.isPending,
    isDeleting: deleteOption.isPending,
  };
}
