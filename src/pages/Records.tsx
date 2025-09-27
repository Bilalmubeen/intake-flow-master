import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { WORKFLOW_STATE_LABELS } from "@/lib/constants";
import { Search, Plus, Eye, Edit, Trash2, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkflowState } from "@/types";

export function Records() {
  const { user, hasPermission } = useAuth();
  const { records, deleteRecord } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter records based on user role
  const userRecords = hasPermission(["reviewer_manager", "administrator"]) 
    ? records 
    : records.filter(record => record.createdBy === user?.id);

  // Apply search and status filters
  const filteredRecords = userRecords.filter(record => {
    const matchesSearch = record.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (recordId: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      await deleteRecord(recordId);
    }
  };

  const handleExport = () => {
    // In a real app, this would generate and download a CSV/Excel file
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Client Name,Email,Phone,Status,Created Date\n" +
      filteredRecords.map(record => 
        `"${record.clientName}","${record.contactEmail}","${record.contactPhone}","${WORKFLOW_STATE_LABELS[record.status]}","${new Date(record.createdAt).toLocaleDateString()}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "client_intake_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const canEdit = (status: WorkflowState) => {
    return status === "draft" || status === "rejected";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {hasPermission(["reviewer_manager", "administrator"]) ? "All Records" : "My Records"}
          </h1>
          <p className="text-muted-foreground">
            Manage and review client intake records
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          {hasPermission("intake_user") && (
            <Button asChild>
              <Link to="/intake/new">
                <Plus className="h-4 w-4 mr-2" />
                New Intake
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Search and filter records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(WORKFLOW_STATE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Records ({filteredRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No records found matching your criteria.</p>
              {hasPermission("intake_user") && searchTerm === "" && statusFilter === "all" && (
                <Button asChild className="mt-4" variant="outline">
                  <Link to="/intake/new">Create your first intake</Link>
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {record.clientName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {record.contactEmail}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={record.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(record.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/records/${record.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          
                          {(hasPermission("intake_user") && record.createdBy === user?.id && canEdit(record.status)) && (
                            <DropdownMenuItem onClick={() => navigate(`/records/${record.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          
                          {hasPermission(["reviewer_manager", "administrator"]) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(record.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}