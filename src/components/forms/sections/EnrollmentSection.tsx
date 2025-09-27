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
      updatedPlans = [...currentPlans, {
        planId: planValue,
        enrollmentEffectiveDate: new Date(),
        notes: ""
      }];
    } else {
      updatedPlans = currentPlans.filter(plan => plan.planId !== planValue);
    }
    
    form.setValue("insurancePlans", updatedPlans);
  };

  const updatePlanField = (planId: string, field: 'enrollmentEffectiveDate' | 'notes', value: any) => {
    const currentPlans = form.getValues("insurancePlans") || [];
    const updatedPlans = currentPlans.map(plan => 
      plan.planId === planId ? { ...plan, [field]: value } : plan
    );
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
                      checked={selectedPlans.some(plan => plan.planId === option.value)}
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

      {selectedPlans.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-sm font-medium">Enrollment Details for Selected Plans</h4>
          {selectedPlans.map((plan) => {
            const planOption = INSURANCE_PLANS_OPTIONS.find(option => option.value === plan.planId);
            return (
              <div key={plan.planId} className="border rounded-lg p-4 space-y-4">
                <h5 className="font-medium text-sm">{planOption?.label}</h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-2">Enrollment Effective Date *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !plan.enrollmentEffectiveDate && "text-muted-foreground"
                          )}
                          disabled={disabled}
                        >
                          {plan.enrollmentEffectiveDate ? (
                            format(plan.enrollmentEffectiveDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={plan.enrollmentEffectiveDate}
                          onSelect={(date) => updatePlanField(plan.planId, 'enrollmentEffectiveDate', date)}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-2">Notes</label>
                    <Textarea 
                      placeholder="Enter notes for this plan..."
                      className="min-h-[80px]"
                      disabled={disabled}
                      value={plan.notes || ""}
                      onChange={(e) => updatePlanField(plan.planId, 'notes', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}