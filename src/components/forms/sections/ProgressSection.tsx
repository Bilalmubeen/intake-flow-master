import { UseFormReturn } from "react-hook-form";
import { ClientIntakeFormData } from "@/lib/validations";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface ProgressSectionProps {
  form: UseFormReturn<ClientIntakeFormData>;
  disabled?: boolean;
}

export function ProgressSection({ form, disabled = false }: ProgressSectionProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="reviewerComments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reviewer Comments</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter reviewer comments..."
                className="min-h-[120px]"
                disabled={disabled}
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Comments from reviewers during the approval process
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}