import { UseFormReturn } from "react-hook-form";
import { ClientIntakeFormData } from "@/lib/validations";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
      <FormField
        control={form.control}
        name="licenseNumbers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>License Numbers *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter license numbers (comma separated)"
                disabled={disabled}
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Enter all relevant license numbers separated by commas
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

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
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              Certification must expire in the future
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

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