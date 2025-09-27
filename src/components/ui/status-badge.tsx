import { Badge } from "@/components/ui/badge";
import { WorkflowState } from "@/types";
import { WORKFLOW_STATE_LABELS, WORKFLOW_STATE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: WorkflowState;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge 
      variant="outline"
      className={cn(
        WORKFLOW_STATE_COLORS[status],
        "font-medium",
        className
      )}
    >
      {WORKFLOW_STATE_LABELS[status]}
    </Badge>
  );
}