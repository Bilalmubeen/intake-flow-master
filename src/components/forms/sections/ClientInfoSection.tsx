import { UseFormReturn } from "react-hook-form";
import { ClientIntakeFormData } from "@/lib/validations";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { POINT_OF_CONTACT_OPTIONS } from "@/lib/constants";

interface ClientInfoSectionProps {
  form: UseFormReturn<ClientIntakeFormData>;
  disabled?: boolean;
}

export function ClientInfoSection({ form, disabled = false }: ClientInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="clientName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organization Name *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter organization name" 
                disabled={disabled}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Name *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter contact name" 
                disabled={disabled}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pointOfContact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Point of Contact *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select point of contact" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {POINT_OF_CONTACT_OPTIONS.map((option) => (
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
        name="contactEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email *</FormLabel>
            <FormControl>
              <Input 
                type="email"
                placeholder="contact@example.com"
                disabled={disabled}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone *</FormLabel>
            <FormControl>
              <Input 
                type="tel"
                placeholder="+1 (555) 123-4567"
                disabled={disabled}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="practiceAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Practice/Facility Address *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter complete practice address"
                  disabled={disabled}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}