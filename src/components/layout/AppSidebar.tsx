import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FileText,
  Users,
  BarChart3,
  Settings,
  FileCheck,
  Clock,
  Shield,
  Building2
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import trueBillingLogo from "@/assets/truebilling-logo.png";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    roles: ["intake_user", "reviewer_manager", "administrator"]
  },
  {
    title: "Create Intake",
    url: "/intake/new",
    icon: FileText,
    roles: ["intake_user", "administrator"]
  },
  {
    title: "My Records",
    url: "/records",
    icon: FileCheck,
    roles: ["intake_user", "reviewer_manager", "administrator"]
  },
  {
    title: "Review Queue",
    url: "/review",
    icon: Clock,
    roles: ["reviewer_manager", "administrator"]
  },
  {
    title: "All Records",
    url: "/records/all",
    icon: Users,
    roles: ["reviewer_manager", "administrator"]
  },
  {
    title: "Administration",
    url: "/admin",
    icon: Settings,
    roles: ["administrator"]
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    roles: ["reviewer_manager", "administrator"]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, hasPermission } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50";

  const filteredMenuItems = menuItems.filter(item => 
    hasPermission(item.roles as any)
  );

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"}>
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <div className="p-4 border-b">
          <div className="flex flex-col items-center gap-2">
            <img src={trueBillingLogo} alt="TrueBilling" className="h-10 object-contain" />
            {!collapsed && (
              <div className="text-center">
                <h2 className="text-sm font-semibold">Client Onboarding</h2>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role.replace('_', ' ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}