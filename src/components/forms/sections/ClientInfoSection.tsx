import { UseFormReturn } from "react-hook-form";
import { ClientIntakeFormData } from "@/lib/validations";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { POINT_OF_CONTACT_OPTIONS, ACCOUNT_MANAGER_OPTIONS, STAFF_OPTIONS, STATUS_OPTIONS, PRACTICE_FACILITY_OPTIONS } from "@/lib/constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ClientInfoSectionProps {
  form: UseFormReturn<ClientIntakeFormData>;
  disabled?: boolean;
}

export function ClientInfoSection({ form, disabled = false }: ClientInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Organization Name */}
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

      {/* Contact Name */}
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

      {/* Point of Contact */}
      <FormField
        control={form.control}
        name="pointOfContact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Point of Contact *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
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

      {/* Contact Email */}
      <FormField
        control={form.control}
        name="contactEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email *</FormLabel>
            <FormControl>
              <Input 
                type="email"
                placeholder="email@example.com"
                disabled={disabled}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Contact Phone */}
      <FormField
        control={form.control}
        name="contactPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone *</FormLabel>
            <FormControl>
              <Input 
                type="tel"
                placeholder="+1234567890"
                disabled={disabled}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Start Date */}
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value || undefined}
                  onSelect={field.onChange}
                  disabled={disabled}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Kickoff Call Completed */}
      <FormField
        control={form.control}
        name="kickoffCallCompleted"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kickoff Call Status</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
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

      {/* Kickoff Call Date */}
      <FormField
        control={form.control}
        name="kickoffCallDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Kickoff Call Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value || undefined}
                  onSelect={field.onChange}
                  disabled={disabled}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Assigned Account Manager */}
      <FormField
        control={form.control}
        name="assignedAccountManager"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned Account Manager</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select account manager" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ACCOUNT_MANAGER_OPTIONS.map((option) => (
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

      {/* Assigned Billing Lead */}
      <FormField
        control={form.control}
        name="assignedBillingLead"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned Billing Lead</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select billing lead" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {STAFF_OPTIONS.map((option) => (
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

      {/* Assigned Credentialing Lead */}
      <FormField
        control={form.control}
        name="assignedCredentialingLead"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned Credentialing Lead</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select credentialing lead" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {STAFF_OPTIONS.map((option) => (
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

      {/* Assigned IT Lead */}
      <FormField
        control={form.control}
        name="assignedITLead"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned IT Lead</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select IT lead" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {STAFF_OPTIONS.map((option) => (
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

      {/* Practice/Facility Name */}
      <FormField
        control={form.control}
        name="practiceFacilityName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Practice/Facility Name</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select practice/facility" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PRACTICE_FACILITY_OPTIONS.map((option) => (
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

      {/* Practice/Facility Address */}
      <FormField
        control={form.control}
        name="practiceFacilityAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Practice/Facility Address</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter facility address"
                disabled={disabled}
                {...field} 
              />
            </FormControl>
            <FormDescription>Auto-populated based on practice selection</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Practice Address (original field) */}
      <FormField
        control={form.control}
        name="practiceAddress"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Full Practice Address *</FormLabel>
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
  );
}
