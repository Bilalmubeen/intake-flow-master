import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { WORKFLOW_STATE_LABELS } from "@/lib/constants";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus,
  BarChart3,
  Users,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";

export function Dashboard() {
  const { user, hasPermission } = useAuth();
  const { records } = useData();

  // Calculate statistics based on user role
  const userRecords = hasPermission(["reviewer_manager", "administrator"]) 
    ? records 
    : records.filter(record => record.createdBy === user?.id);

  const stats = {
    total: userRecords.length,
    draft: userRecords.filter(r => r.status === "draft").length,
    submitted: userRecords.filter(r => r.status === "submitted").length,
    inReview: userRecords.filter(r => r.status === "in_review").length,
    approved: userRecords.filter(r => r.status === "approved").length,
    rejected: userRecords.filter(r => r.status === "rejected").length,
  };

  const recentRecords = userRecords
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const pendingReviews = records.filter(r => r.status === "submitted").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        
        {hasPermission("intake_user") && (
          <Button asChild>
            <Link to="/intake/new">
              <Plus className="h-4 w-4 mr-2" />
              New Intake
            </Link>
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {hasPermission(["reviewer_manager", "administrator"]) ? "All records" : "Your records"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft + stats.submitted + stats.inReview}</div>
            <p className="text-xs text-muted-foreground">
              Draft, submitted & in review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        {hasPermission(["reviewer_manager", "administrator"]) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReviews}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting your review
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Records</CardTitle>
            <CardDescription>
              Latest client intake submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentRecords.length === 0 ? (
              <div className="text-center text-muted-foreground py-6">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No records yet</p>
                {hasPermission("intake_user") && (
                  <Button asChild className="mt-4" variant="outline">
                    <Link to="/intake/new">Create your first intake</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {recentRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{record.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={record.status} />
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link to="/records">View All Records</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Overview</CardTitle>
            <CardDescription>
              Breakdown of record statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats).filter(([key]) => key !== 'total').map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize text-sm">
                    {WORKFLOW_STATE_LABELS[status] || status.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hasPermission("intake_user") && (
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Link to="/intake/new">
                  <Plus className="h-6 w-6" />
                  <span>Create New Intake</span>
                </Link>
              </Button>
            )}
            
            {hasPermission(["reviewer_manager", "administrator"]) && (
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Link to="/review">
                  <Clock className="h-6 w-6" />
                  <span>Review Queue</span>
                </Link>
              </Button>
            )}
            
            {hasPermission(["reviewer_manager", "administrator"]) && (
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Link to="/reports">
                  <BarChart3 className="h-6 w-6" />
                  <span>View Reports</span>
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}