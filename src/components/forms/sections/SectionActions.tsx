import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Edit } from "lucide-react";

interface SectionActionsProps {
  onSaveSection?: () => Promise<boolean>;
  disabled?: boolean;
}

export function useSectionActions() {
  const [sectionStatus, setSectionStatus] = useState<'draft' | 'saved'>('draft');
  const [isSaving, setIsSaving] = useState(false);

  return {
    sectionStatus,
    setSectionStatus,
    isSaving,
    setIsSaving,
    isReadOnly: sectionStatus === 'saved',
  };
}

export function SectionActions({ onSaveSection, disabled }: SectionActionsProps) {
  const [sectionStatus, setSectionStatus] = useState<'draft' | 'saved'>('draft');
  const [isSaving, setIsSaving] = useState(false);

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

  if (!onSaveSection || disabled) return null;

  return (
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
          <Button 
            type="button" 
            onClick={handleSaveSection}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save (Finalize)"}
          </Button>
        )}
      </div>
    </div>
  );
}
