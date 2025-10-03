import { UseFormReturn } from "react-hook-form";
import { ClientIntakeFormData } from "@/lib/validations";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PAYER_ENROLLMENT_STATUS_OPTIONS, CLEARINGHOUSE_OPTIONS, BILLING_PATHWAY_OPTIONS } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionActions, useSectionActions } from "./SectionActions";

interface BillingSectionProps {
  form: UseFormReturn<ClientIntakeFormData>;
  disabled?: boolean;
  onSaveSection?: () => Promise<boolean>;
}

export function BillingSection({ form, disabled = false, onSaveSection }: BillingSectionProps) {
  const { isReadOnly } = useSectionActions();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payer Enrollment Status */}
        <FormField
          control={form.control}
          name="payerEnrollmentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payer Enrollment Status *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={disabled || isReadOnly}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select enrollment status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PAYER_ENROLLMENT_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Clearinghouse Selection */}
        <FormField
          control={form.control}
          name="clearinghouseSelection"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clearinghouse Selection *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={disabled || isReadOnly}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select clearinghouse" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CLEARINGHOUSE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Provider NPI Numbers */}
        <FormField
          control={form.control}
          name="providerNpiNumbers"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Provider NPI Numbers *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="1234567890, 0987654321"
                  disabled={disabled || isReadOnly}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter NPI numbers separated by commas (numbers only)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Billing Pathway */}
        <FormField
          control={form.control}
          name="billingPathway"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billing Pathway</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={disabled || isReadOnly}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing pathway" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BILLING_PATHWAY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fee Schedule Percentage */}
        <FormField
          control={form.control}
          name="feeSchedulePercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fee Schedule %</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter percentage"
                  disabled={disabled || isReadOnly}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormDescription>
                Percentage agreed for fee schedule
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Billing Setup Checklist</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Charge Master Created */}
          <FormField
            control={form.control}
            name="chargeMasterCreated"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled || isReadOnly}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Charge Master Created</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Payer Fee Schedule Uploaded */}
          <FormField
            control={form.control}
            name="payerFeeScheduleUploaded"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled || isReadOnly}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Payer Fee Schedule Uploaded</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Test Claims Submitted */}
          <FormField
            control={form.control}
            name="testClaimsSubmitted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled || isReadOnly}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Test Claims Submitted</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      <SectionActions onSaveSection={onSaveSection} disabled={disabled} />
    </div>
  );
}
