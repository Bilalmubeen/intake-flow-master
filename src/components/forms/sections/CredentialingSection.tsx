import { UseFormReturn } from "react-hook-form";
import { ClientIntakeFormData } from "@/lib/validations";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_OPTIONS } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface CredentialingSectionProps {
  form: UseFormReturn<ClientIntakeFormData>;
  disabled?: boolean;
}

export function CredentialingSection({ form, disabled = false }: CredentialingSectionProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFileNames = files.map(file => file.name);
    const updatedFiles = [...uploadedFiles, ...newFileNames];
    setUploadedFiles(updatedFiles);
    form.setValue("complianceDocuments", updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    form.setValue("complianceDocuments", updatedFiles);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* License Numbers */}
        <FormField
          control={form.control}
          name="licenseNumbers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Numbers *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter license numbers"
                  disabled={disabled}
                  {...field} 
                />
              </FormControl>
              <FormDescription>Comma-separated if multiple</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Certification Expiry Date */}
        <FormField
          control={form.control}
          name="certificationExpiryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Certification Expiry Date *</FormLabel>
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
                    disabled={(date) => date < new Date() || disabled}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Medicare Enrollment Status */}
        <FormField
          control={form.control}
          name="medicareEnrollmentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicare Enrollment Status</FormLabel>
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

        {/* Medicaid Enrollment Status */}
        <FormField
          control={form.control}
          name="medicaidEnrollmentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicaid Enrollment Status</FormLabel>
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

        {/* Commercial Payer Enrollment Status */}
        <FormField
          control={form.control}
          name="commercialPayerEnrollmentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commercial Payer Enrollment Status</FormLabel>
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

        {/* CAQH Profile Status */}
        <FormField
          control={form.control}
          name="caqhProfileStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CAQH Profile Status</FormLabel>
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
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Document Checklist</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PECOS Access Received */}
          <FormField
            control={form.control}
            name="pecosAccessReceived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>PECOS Access Received</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Credentialing Tracker Created */}
          <FormField
            control={form.control}
            name="credentialingTrackerCreated"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Credentialing Tracker Created</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* W9 Received */}
          <FormField
            control={form.control}
            name="w9Received"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>W9 Received</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* License Copy Received */}
          <FormField
            control={form.control}
            name="licenseCopyReceived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>License Copy Received</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* DEA Copy Received */}
          <FormField
            control={form.control}
            name="deaCopyReceived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>DEA Copy Received</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Board Cert Received */}
          <FormField
            control={form.control}
            name="boardCertReceived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Board Certification Received</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Degree Cert Received */}
          <FormField
            control={form.control}
            name="degreeCertReceived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Degree Certificate Received</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Malpractice COI Received */}
          <FormField
            control={form.control}
            name="malpracticeCOIReceived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Malpractice COI Received</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="complianceDocuments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Compliance Documents</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    disabled={disabled}
                    className="hidden"
                    id="compliance-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('compliance-upload')?.click()}
                    disabled={disabled}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((fileName, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{fileName}</span>
                        {!disabled && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>
              Upload relevant compliance documents (PDF, DOC, images)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
