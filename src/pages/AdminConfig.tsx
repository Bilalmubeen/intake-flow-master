import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Webhook, Database, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

type DropdownCategory = 
  | "assigned_account_manager"
  | "assigned_billing_lead"
  | "point_of_contact"
  | "payer_enrollment_status"
  | "clearinghouse"
  | "insurance_plans"
  | "meeting_cadence"
  | "practice_facility";

interface DropdownOption {
  value: string;
  label: string;
}

export function AdminConfig() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DropdownCategory>("assigned_account_manager");
  const [newOptionValue, setNewOptionValue] = useState("");
  const [newOptionLabel, setNewOptionLabel] = useState("");

  // Mock dropdown data - in production, this would come from a database
  const [dropdownData, setDropdownData] = useState<Record<DropdownCategory, DropdownOption[]>>({
    assigned_account_manager: [
      { value: "murshid", label: "Murshid" },
      { value: "bisma", label: "Bisma" },
      { value: "sarah", label: "Sarah" },
    ],
    assigned_billing_lead: [
      { value: "staff_1", label: "Staff Member 1" },
      { value: "staff_2", label: "Staff Member 2" },
      { value: "staff_3", label: "Staff Member 3" },
    ],
    practice_facility: [
      { value: "practice_1", label: "Practice 1" },
      { value: "practice_2", label: "Practice 2" },
      { value: "practice_3", label: "Practice 3" },
    ],
    point_of_contact: [
      { value: "primary_physician", label: "Primary Physician" },
      { value: "practice_manager", label: "Practice Manager" },
      { value: "billing_manager", label: "Billing Manager" },
    ],
    payer_enrollment_status: [
      { value: "enrolled", label: "Enrolled" },
      { value: "pending", label: "Pending" },
      { value: "not_enrolled", label: "Not Enrolled" },
    ],
    clearinghouse: [
      { value: "change_healthcare", label: "Change Healthcare" },
      { value: "availity", label: "Availity" },
      { value: "relay_health", label: "Relay Health" },
    ],
    insurance_plans: [
      { value: "aetna", label: "Aetna" },
      { value: "anthem", label: "Anthem" },
      { value: "blue_cross", label: "Blue Cross Blue Shield" },
      { value: "cigna", label: "Cigna" },
      { value: "medicare", label: "Medicare" },
      { value: "medicaid", label: "Medicaid" },
    ],
    meeting_cadence: [
      { value: "weekly", label: "Weekly" },
      { value: "bi_weekly", label: "Bi-weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Quarterly" },
    ],
  });

  const handleAddOption = () => {
    if (!newOptionValue || !newOptionLabel) {
      toast({
        title: "Missing Information",
        description: "Please provide both value and label.",
        variant: "destructive",
      });
      return;
    }

    const currentOptions = dropdownData[selectedCategory];
    if (currentOptions.some((opt) => opt.value === newOptionValue)) {
      toast({
        title: "Duplicate Value",
        description: "An option with this value already exists.",
        variant: "destructive",
      });
      return;
    }

    setDropdownData({
      ...dropdownData,
      [selectedCategory]: [
        ...currentOptions,
        { value: newOptionValue, label: newOptionLabel },
      ],
    });

    setNewOptionValue("");
    setNewOptionLabel("");

    toast({
      title: "Option Added",
      description: `Added new option to ${selectedCategory.replace(/_/g, " ")}`,
    });
  };

  const handleRemoveOption = (value: string) => {
    setDropdownData({
      ...dropdownData,
      [selectedCategory]: dropdownData[selectedCategory].filter(
        (opt) => opt.value !== value
      ),
    });

    toast({
      title: "Option Removed",
      description: "Dropdown option has been removed.",
    });
  };

  const handleSaveWebhook = () => {
    // In production, this would save to database
    localStorage.setItem("webhook_url", webhookUrl);
    
    toast({
      title: "Webhook Saved",
      description: "Webhook URL has been saved successfully.",
    });
  };

  if (!hasPermission(["administrator"])) {
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
        <h1 className="text-3xl font-bold">Administration</h1>
        <p className="text-muted-foreground">
          Manage system configuration and automation settings
        </p>
      </div>

      <Tabs defaultValue="dropdowns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dropdowns">
            <Database className="h-4 w-4 mr-2" />
            Dropdown Options
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dropdowns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Dropdown Options</CardTitle>
              <CardDescription>
                Add, edit, or remove dropdown options used throughout the intake form
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Select Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as DropdownCategory)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assigned_account_manager">Assigned Account Manager</SelectItem>
                    <SelectItem value="assigned_billing_lead">Assigned Billing Lead</SelectItem>
                    <SelectItem value="practice_facility">Practice/Facility</SelectItem>
                    <SelectItem value="point_of_contact">Point of Contact</SelectItem>
                    <SelectItem value="payer_enrollment_status">Payer Enrollment Status</SelectItem>
                    <SelectItem value="clearinghouse">Clearinghouse</SelectItem>
                    <SelectItem value="insurance_plans">Insurance Plans</SelectItem>
                    <SelectItem value="meeting_cadence">Meeting Cadence</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Option Value (internal)</Label>
                  <Input
                    placeholder="e.g., new_option"
                    value={newOptionValue}
                    onChange={(e) => setNewOptionValue(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Option Label (displayed)</Label>
                  <Input
                    placeholder="e.g., New Option"
                    value={newOptionLabel}
                    onChange={(e) => setNewOptionLabel(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleAddOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Value</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dropdownData[selectedCategory].map((option) => (
                      <TableRow key={option.value}>
                        <TableCell className="font-mono text-sm">{option.value}</TableCell>
                        <TableCell>{option.label}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveOption(option.value)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Configure webhooks to receive notifications when records are approved
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Webhook URL</Label>
                <Input
                  type="url"
                  placeholder="https://your-webhook-endpoint.com/intake"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  This URL will receive a POST request with the record data when approved.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-semibold text-sm mb-2">Payload Format</h4>
                <pre className="text-xs overflow-x-auto">
{`{
  "event": "record.approved",
  "timestamp": "2024-01-01T12:00:00Z",
  "record": {
    "id": "...",
    "clientName": "...",
    "contactEmail": "...",
    ...
  }
}`}
                </pre>
              </div>

              <Button onClick={handleSaveWebhook}>
                <Save className="h-4 w-4 mr-2" />
                Save Webhook Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and automation rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>SLA Reminder Threshold (days)</Label>
                <Input type="number" defaultValue="3" min="1" max="30" />
                <p className="text-sm text-muted-foreground mt-2">
                  Send reminder if record is in review for more than this many business days.
                </p>
              </div>

              <div>
                <Label>Auto-archive Approved Records (days)</Label>
                <Input type="number" defaultValue="90" min="30" max="365" />
                <p className="text-sm text-muted-foreground mt-2">
                  Automatically archive approved records after this many days.
                </p>
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
