import { useState, useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { WorkflowState, ClientIntakeRecord } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Download, Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { WORKFLOW_STATE_LABELS } from "@/lib/constants";

export function ReviewConsole() {
  const { records, changeRecordStatus } = useData();
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<ClientIntakeRecord | null>(null);
  const [actionDialog, setActionDialog] = useState<"approve" | "reject" | "view" | null>(null);
  const [comments, setComments] = useState("");

  // Filter records
  const filteredRecords = useMemo(() => {
    let filtered = records;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    } else {
      // Show submitted and in_review by default for review queue
      filtered = filtered.filter((r) => 
        r.status === "submitted" || r.status === "in_review"
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((r) =>
        r.clientName.toLowerCase().includes(query) ||
        r.contactEmail.toLowerCase().includes(query) ||
        r.createdBy.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => 
      new Date(b.submittedAt || b.createdAt).getTime() - 
      new Date(a.submittedAt || a.createdAt).getTime()
    );
  }, [records, statusFilter, searchQuery]);

  const handleApprove = async () => {
    if (!selectedRecord) return;

    try {
      await changeRecordStatus(selectedRecord.id, "approved", comments);
      toast({
        title: "Record Approved",
        description: `${selectedRecord.clientName} has been approved successfully.`,
      });
      setActionDialog(null);
      setSelectedRecord(null);
      setComments("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve record.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedRecord || !comments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide rejection comments.",
        variant: "destructive",
      });
      return;
    }

    try {
      await changeRecordStatus(selectedRecord.id, "rejected", comments);
      toast({
        title: "Record Rejected",
        description: `${selectedRecord.clientName} has been rejected and returned to draft.`,
      });
      setActionDialog(null);
      setSelectedRecord(null);
      setComments("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject record.",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Client Name",
      "Contact Email",
      "Status",
      "Created By",
      "Submitted At",
      "Reviewed At",
    ];

    const rows = filteredRecords.map((record) => [
      record.clientName,
      record.contactEmail,
      WORKFLOW_STATE_LABELS[record.status],
      record.createdBy,
      record.submittedAt ? format(new Date(record.submittedAt), "PPP") : "N/A",
      record.reviewedAt ? format(new Date(record.reviewedAt), "PPP") : "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `intake-records-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${filteredRecords.length} records to CSV.`,
    });
  };

  if (!hasPermission(["reviewer_manager", "administrator"])) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Review Console</h1>
        <p className="text-muted-foreground">
          Review and approve client intake submissions
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by client name, email, or creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pending</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.clientName}</TableCell>
                    <TableCell>{record.contactEmail}</TableCell>
                    <TableCell>
                      <StatusBadge status={record.status} />
                    </TableCell>
                    <TableCell>{record.createdBy}</TableCell>
                    <TableCell>
                      {record.submittedAt
                        ? format(new Date(record.submittedAt), "PPP")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRecord(record);
                            setActionDialog("view");
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(record.status === "submitted" || record.status === "in_review") && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRecord(record);
                                setActionDialog("approve");
                              }}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRecord(record);
                                setActionDialog("reject");
                              }}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* View Detail Dialog */}
      <Dialog open={actionDialog === "view"} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Details</DialogTitle>
            <DialogDescription>
              Client intake record for {selectedRecord?.clientName}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm">Client Name</h4>
                  <p className="text-sm">{selectedRecord.clientName}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Contact Email</h4>
                  <p className="text-sm">{selectedRecord.contactEmail}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Contact Phone</h4>
                  <p className="text-sm">{selectedRecord.contactPhone}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Status</h4>
                  <StatusBadge status={selectedRecord.status} />
                </div>
                <div className="col-span-2">
                  <h4 className="font-semibold text-sm">Practice Address</h4>
                  <p className="text-sm">{selectedRecord.practiceAddress}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">License Numbers</h4>
                  <p className="text-sm">{selectedRecord.licenseNumbers}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Provider NPI</h4>
                  <p className="text-sm">{selectedRecord.providerNpiNumbers}</p>
                </div>
              </div>
              
              {selectedRecord.reviewerComments && (
                <div>
                  <h4 className="font-semibold text-sm">Reviewer Comments</h4>
                  <p className="text-sm text-muted-foreground">{selectedRecord.reviewerComments}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-sm mb-2">Status History</h4>
                <div className="space-y-2">
                  {selectedRecord.statusHistory.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-2 text-sm">
                      <StatusBadge status={entry.status} />
                      <div className="flex-1">
                        <p className="font-medium">{entry.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(entry.timestamp), "PPP p")}
                        </p>
                        {entry.comments && (
                          <p className="text-xs mt-1">{entry.comments}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={actionDialog === "approve"} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Record</DialogTitle>
            <DialogDescription>
              Approve intake record for {selectedRecord?.clientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Add approval comments (optional)..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={actionDialog === "reject"} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Record</DialogTitle>
            <DialogDescription>
              Reject intake record for {selectedRecord?.clientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Rejection comments (required)..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[120px]"
              required
            />
            <p className="text-sm text-muted-foreground">
              The record will be returned to draft status and the user will be notified.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
