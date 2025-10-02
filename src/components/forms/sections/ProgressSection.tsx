import { UseFormReturn } from "react-hook-form";
import { ClientIntakeFormData } from "@/lib/validations";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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

      <FormField
        control={form.control}
        name="tasksCompletedPercentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tasks Completed Percentage</FormLabel>
            <FormControl>
              <Input 
                type="number"
                min="0"
                max="100"
                placeholder="Enter percentage (0-100)"
                disabled={disabled}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
              />
            </FormControl>
            <FormDescription>
              Overall progress indicator (auto-calculated ideally)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}