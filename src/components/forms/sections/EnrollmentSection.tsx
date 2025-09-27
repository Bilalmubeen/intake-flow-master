import { UseFormReturn } from "react-hook-form";
import { ClientIntakeFormData } from "@/lib/validations";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { INSURANCE_PLANS_OPTIONS } from "@/lib/constants";

interface EnrollmentSectionProps {
  form: UseFormReturn<ClientIntakeFormData>;
  disabled?: boolean;
}

export function EnrollmentSection({ form, disabled = false }: EnrollmentSectionProps) {
  const selectedPlans = form.watch("insurancePlans") || [];

  const handlePlanChange = (planValue: string, checked: boolean) => {
    const currentPlans = form.getValues("insurancePlans") || [];
    let updatedPlans;
    
    if (checked) {
      updatedPlans = [...currentPlans, planValue];
    } else {
      updatedPlans = currentPlans.filter(plan => plan !== planValue);
    }
    
    form.setValue("insurancePlans", updatedPlans);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="insurancePlans"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Insurance Plans *</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {INSURANCE_PLANS_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={selectedPlans.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handlePlanChange(option.value, checked as boolean)
                      }
                      disabled={disabled}
                    />
                    <label
                      htmlFor={option.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormDescription>
              Select all applicable insurance plans
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="enrollmentEffectiveDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Enrollment Effective Date *</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter any additional notes or comments..."
                className="min-h-[100px]"
                disabled={disabled}
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Optional notes about the enrollment
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}