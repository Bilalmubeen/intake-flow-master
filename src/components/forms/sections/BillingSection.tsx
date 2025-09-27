import { UseFormReturn } from "react-hook-form";
import { ClientIntakeFormData } from "@/lib/validations";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PAYER_ENROLLMENT_STATUS_OPTIONS, CLEARINGHOUSE_OPTIONS } from "@/lib/constants";

interface BillingSectionProps {
  form: UseFormReturn<ClientIntakeFormData>;
  disabled?: boolean;
}

export function BillingSection({ form, disabled = false }: BillingSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="payerEnrollmentStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payer Enrollment Status *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
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

      <FormField
        control={form.control}
        name="clearinghouseSelection"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Clearinghouse Selection *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
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

      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="providerNpiNumbers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider NPI Numbers *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="1234567890, 0987654321"
                  disabled={disabled}
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
      </div>
    </div>
  );
}