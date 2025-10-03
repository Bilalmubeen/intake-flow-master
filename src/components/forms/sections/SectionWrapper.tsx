import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Edit } from "lucide-react";

interface SectionWrapperProps {
  children: ReactNode;
  onSaveDraft?: () => Promise<boolean>;
  onSaveSection?: () => Promise<boolean>;
  disabled?: boolean;
}

export function SectionWrapper({ 
  children, 
  onSaveDraft, 
  onSaveSection, 
  disabled = false 
}: SectionWrapperProps) {
  const [sectionStatus, setSectionStatus] = useState<'draft' | 'saved'>('draft');
  const [isSaving, setIsSaving] = useState(false);

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
      {children}
      
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
