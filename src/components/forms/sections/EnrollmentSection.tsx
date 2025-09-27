import { UseFormReturn } from "react-hook-form";
import { ClientIntakeFormData } from "@/lib/validations";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { INSURANCE_PLANS_OPTIONS } from "@/lib/constants";
import { useState } from "react";

interface EnrollmentSectionProps {
  form: UseFormReturn<ClientIntakeFormData>;
  disabled?: boolean;
}

export function EnrollmentSection({ form, disabled = false }: EnrollmentSectionProps) {
  const selectedPlans = form.watch("insurancePlans") || [];
  const [customPlanName, setCustomPlanName] = useState("");

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

  const handleAddCustomPlan = () => {
    if (!customPlanName.trim()) return;
    
    const currentPlans = form.getValues("insurancePlans") || [];
    const customPlanId = `custom_${Date.now()}`;
    
    const updatedPlans = [...currentPlans, {
      planId: customPlanId,
      enrollmentEffectiveDate: new Date(),
      notes: `${customPlanName}|custom_plan`
    }];
    
    form.setValue("insurancePlans", updatedPlans);
    setCustomPlanName("");
  };

  const handleRemoveCustomPlan = (planId: string) => {
    const currentPlans = form.getValues("insurancePlans") || [];
    const updatedPlans = currentPlans.filter(plan => plan.planId !== planId);
    form.setValue("insurancePlans", updatedPlans);
  };

  const updatePlanField = (planId: string, field: 'enrollmentEffectiveDate' | 'notes', value: any) => {
    const currentPlans = form.getValues("insurancePlans") || [];
    const updatedPlans = currentPlans.map(plan => 
      plan.planId === planId ? { ...plan, [field]: value } : plan
    );
    form.setValue("insurancePlans", updatedPlans);
  };

  const getPlanDisplayName = (planId: string) => {
    const standardPlan = INSURANCE_PLANS_OPTIONS.find(option => option.value === planId);
    if (standardPlan) return standardPlan.label;
    
    // For custom plans, extract the name from the notes field
    if (planId.startsWith('custom_')) {
      const customPlan = selectedPlans.find(p => p.planId === planId);
      if (customPlan?.notes) {
        const parts = customPlan.notes.split('|');
        return parts[0] || 'Custom Plan';
      }
    }
    
    return 'Unknown Plan';
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
              Select all applicable insurance plans or add custom ones below
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      
      {/* Add Custom Insurance Plan */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Add Custom Insurance Plan</label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Enter insurance plan name..."
              value={customPlanName}
              onChange={(e) => setCustomPlanName(e.target.value)}
              disabled={disabled}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCustomPlan}
              disabled={disabled || !customPlanName.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Show added custom plans */}
        {selectedPlans.filter(plan => plan.planId.startsWith('custom_')).length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Insurance Plans:</label>
            {selectedPlans
              .filter(plan => plan.planId.startsWith('custom_'))
              .map((plan) => {
                const planName = getPlanDisplayName(plan.planId);
                return (
                  <div key={plan.planId} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="text-sm">{planName}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCustomPlan(plan.planId)}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {selectedPlans.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-sm font-medium">Enrollment Details for Selected Plans</h4>
          {selectedPlans.map((plan) => {
            const isCustomPlan = plan.planId.startsWith('custom_');
            const planDisplayName = getPlanDisplayName(plan.planId);
            
            return (
              <div key={plan.planId} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-sm">{planDisplayName}</h5>
                  {isCustomPlan && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCustomPlan(plan.planId)}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
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
                      value={isCustomPlan ? (plan.notes?.split('|')[1] === 'custom_plan' ? '' : plan.notes) : (plan.notes || "")}
                      onChange={(e) => {
                        const newValue = isCustomPlan && plan.notes?.includes('|') ? 
                          `${plan.notes.split('|')[0]}|${e.target.value}` : 
                          e.target.value;
                        updatePlanField(plan.planId, 'notes', newValue);
                      }}
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