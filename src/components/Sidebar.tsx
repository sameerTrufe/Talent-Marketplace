import { cn } from "../lib/utils";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  FileText,
  Users,
  Heart,
  MessageSquare,
  FileCheck,
  CreditCard,
  Settings,
} from "lucide-react";

interface SidebarProps {
  role?: "client" | "admin";
}

const clientNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/client/dashboard" },
  { icon: FileText, label: "Post Requirement", path: "/client/post-requirement" },
  { icon: Users, label: "Browse Resources", path: "/client/browse" },
  { icon: Heart, label: "Shortlist", path: "/client/shortlist" },
  { icon: MessageSquare, label: "Messages", path: "/client/messaging" },
  { icon: FileCheck, label: "Contracts", path: "/client/contracts" },
  { icon: CreditCard, label: "Billing", path: "/client/billing" },
];

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: FileText, label: "Requirements", path: "/admin/requirements" },
  { icon: FileCheck, label: "Contracts", path: "/admin/contracts" },
  { icon: CreditCard, label: "Payments", path: "/admin/payments" },
  { icon: Settings, label: "Reports", path: "/admin/reports" },
];

export function Sidebar({ role = "client" }: SidebarProps) {
  const location = useLocation();
  const navItems = role === "admin" ? adminNavItems : clientNavItems;

  return (
    <div className="w-64 border-r bg-background h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b">
        <h2 className="font-semibold">TalentHub</h2>
        <p className="text-sm text-muted-foreground">Low-Code Marketplace</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
}
