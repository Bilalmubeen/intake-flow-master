import { UseFormReturn } from "react-hook-form";
import { ClientIntakeFormData } from "@/lib/validations";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X } from "lucide-react";
import { useState } from "react";

interface PoliciesSectionProps {
  form: UseFormReturn<ClientIntakeFormData>;
  disabled?: boolean;
}

export function PoliciesSection({ form, disabled = false }: PoliciesSectionProps) {
  const [uploadedPolicyFiles, setUploadedPolicyFiles] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFileNames = files.map(file => file.name);
    const updatedFiles = [...uploadedPolicyFiles, ...newFileNames];
    setUploadedPolicyFiles(updatedFiles);
    form.setValue("policyFiles", updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedPolicyFiles.filter((_, i) => i !== index);
    setUploadedPolicyFiles(updatedFiles);
    form.setValue("policyFiles", updatedFiles);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="policyAcknowledgment"
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
              <FormLabel className="text-sm font-medium">
                Policy Acknowledgment *
              </FormLabel>
              <FormDescription>
                I acknowledge that I have read and agree to comply with all DVP policies and procedures, including privacy, security, and operational guidelines.
              </FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="policyFiles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Policy Documents</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    disabled={disabled}
                    className="hidden"
                    id="policy-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('policy-upload')?.click()}
                    disabled={disabled}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Policy Files
                  </Button>
                </div>
                
                {uploadedPolicyFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedPolicyFiles.map((fileName, index) => (
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
              Upload signed policy documents (PDF, DOC formats)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}