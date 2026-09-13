import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, PlusCircle, ListChecks, Bell, User, Siren,
  Info, Settings, ShieldCheck, ChevronLeft, Building2, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Report an Issue", path: "/report", icon: PlusCircle },
  { label: "My Requests", path: "/requests", icon: ListChecks },
  { label: "Notifications", path: "/notifications", icon: Bell, badge: "unread" },
  { label: "Municipal Hub", path: "/hub", icon: Building2 },
  { label: "Community", path: "/community", icon: MessageSquare },
  { label: "Emergency", path: "/emergency", icon: Siren, urgent: true },
];

const bottomItems = [
  { label: "Profile", path: "/profile", icon: User },
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "About", path: "/about", icon: Info },
  { label: "Admin", path: "/admin", icon: ShieldCheck, admin: true },
];

export default function Sidebar({ collapsed, setCollapsed, unread = 0, role = "Resident" }) {
  const location = useLocation();
  const [adminOpen, setAdminOpen] = useState(false);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  const renderItem = (item) => {
    if (item.admin && !["admin", "Administrator", "Municipal Staff", "Department Manager"].includes(role)) return null;
    const Icon = item.icon;
    const active = isActive(item.path);
    return (
      <Link
        key={item.path}
        to={item.path}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
          active
            ? "bg-[hsl(var(--accent))] text-[hsl(var(--sidebar-primary))] shadow-sm"
            : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-white",
          collapsed && "justify-center"
        )}
        title={collapsed ? item.label : undefined}
      >
        <Icon className={cn("w-5 h-5 shrink-0", item.urgent && "text-[hsl(var(--danger))]")} />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {!collapsed && item.badge === "unread" && unread > 0 && (
          <span className="ml-auto grid place-items-center min-w-5 h-5 px-1 rounded-full bg-[hsl(var(--danger))] text-white text-[10px] font-bold">
            {unread}
          </span>
        )}
        {!collapsed && item.urgent && (
          <span className="ml-auto w-2 h-2 rounded-full bg-[hsl(var(--danger))] animate-pulse-soft" />
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] transition-all duration-300",
        collapsed ? "w-[76px]" : "w-64"
      )}
    >
      <div className={cn("flex items-center h-16 px-4 border-b border-[hsl(var(--sidebar-border))]", collapsed && "justify-center")}>
        <Logo compact={collapsed} light />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {!collapsed && <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">Main</p>}
        {navItems.map(renderItem)}
        {!collapsed && <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">Account</p>}
        {bottomItems.map(renderItem)}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-3 px-3 py-3 text-white/60 hover:text-white hover:bg-[hsl(var(--sidebar-accent))] transition-colors text-xs"
      >
        <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}