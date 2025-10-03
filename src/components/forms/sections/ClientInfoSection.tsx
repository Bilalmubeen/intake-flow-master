import { UseFormReturn } from "react-hook-form";
import { ClientIntakeFormData } from "@/lib/validations";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { POINT_OF_CONTACT_OPTIONS, ACCOUNT_MANAGER_OPTIONS, STAFF_OPTIONS, STATUS_OPTIONS, PRACTICE_FACILITY_OPTIONS, US_STATES } from "@/lib/constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useSectionSave } from "@/hooks/useSectionSave";
import { useState } from "react";
import { Edit } from "lucide-react";

interface ClientInfoSectionProps {
  form: UseFormReturn<ClientIntakeFormData>;
  disabled?: boolean;
  onSaveDraft?: () => Promise<boolean>;
  onSaveSection?: () => Promise<boolean>;
}

export function ClientInfoSection({ form, disabled = false, onSaveDraft, onSaveSection }: ClientInfoSectionProps) {
  const { user } = useAuth();
  const isIntakeUser = user?.role === "intake_user";
  const kickoffStatus = form.watch("kickoffCallCompleted");
  const [sectionStatus, setSectionStatus] = useState<'draft' | 'saved'>('draft');
  const [isSaving, setIsSaving] = useState(false);
  
  const isReadOnly = disabled || sectionStatus === 'saved';

  const handleSaveDraft = async () => {
    if (!onSaveDraft) return;
    setIsSaving(true);
    const success = await onSaveDraft();
    if (success) setSectionStatus('draft');
    setIsSaving(false);
  };

  const handleSaveSection = async () => {
    if (!onSaveSection) return;
    setIsSaving(true);
    const success = await onSaveSection();
    if (success) setSectionStatus('saved');
    setIsSaving(false);
  };

  const handleEdit = () => {
    setSectionStatus('draft');
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organization Name - read-only for intake_user */}
        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter organization name"
                  disabled={disabled || isIntakeUser}
                  {...field} 
                />
              </FormControl>
              {isIntakeUser && (
                <FormDescription>Auto-populated from Client Master</FormDescription>
              )}
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
                    disabled={isReadOnly}
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
            <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
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

      {/* Kickoff Call Date - Only visible if status is Completed or In Process */}
      {(kickoffStatus === "completed" || kickoffStatus === "in_process") && (
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
              <FormDescription>Required when status is Completed or In Process</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      </div>

      {/* Team Assignments Section */}
      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold mb-4">Team Assignments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Relationship Manager */}
          <FormField
            control={form.control}
            name="relationshipManager"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship Manager *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter relationship manager name"
                    disabled={disabled}
                    {...field} 
                  />
                </FormControl>
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
                <FormLabel>Assigned Account Manager *</FormLabel>
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
                <FormDescription>Admin-manageable list</FormDescription>
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
                <FormLabel>Assigned Billing Lead *</FormLabel>
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
                <FormDescription>Admin-manageable list</FormDescription>
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
                <FormLabel>Assigned Credentialing Lead *</FormLabel>
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
                <FormDescription>Internal Staff List</FormDescription>
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
                <FormLabel>Assigned IT Lead (Optional)</FormLabel>
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
        {/* Practice/Facility Name */}
        <FormField
          control={form.control}
          name="practiceFacilityName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Practice/Facility Name</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
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

      </div>

      {/* Full Practice Address Section */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold">Full Practice Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address Line 1 */}
          <FormField
            control={form.control}
            name="practiceAddress"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Address Line 1 *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter street address"
                    disabled={isReadOnly}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* State */}
          <FormField
            control={form.control}
            name="practiceState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {US_STATES.map((option) => (
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

          {/* Zip Code */}
          <FormField
            control={form.control}
            name="practiceZipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter 5-digit zip code"
                    maxLength={5}
                    disabled={isReadOnly}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Section Actions */}
      {(onSaveDraft || onSaveSection) && !disabled && (
        <div className="flex justify-between pt-4 border-t">
          {sectionStatus === 'saved' && (
            <Button 
              type="button" 
              variant="outline"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Section
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            {sectionStatus === 'draft' && (
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button 
                  type="button" 
                  onClick={handleSaveSection}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save (Finalize)"}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
