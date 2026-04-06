"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  DoorOpen,
  RotateCcw,
  Settings,
  ChevronRight,
  Users,
  CreditCard,
  LayoutTemplate,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Units", href: "/units", icon: DoorOpen },
  { label: "Turnovers", href: "/turnovers", icon: RotateCcw },
  { label: "Team", href: "/team", icon: Users },
  { label: "Templates", href: "/templates", icon: LayoutTemplate },
];

const bottomNavItems = [
  { label: "User Guide", href: "/guide", icon: BookOpen },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  companyName?: string;
  userInitials?: string;
  userName?: string;
}

export function Sidebar({ companyName, userInitials, userName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-4">
        <Logo size="sm" />
      </div>

      {/* Company chip */}
      {companyName && (
        <div className="border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2 rounded-md bg-primary/6 px-2.5 py-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/15 shrink-0">
              <Building2 className="h-3 w-3 text-primary" />
            </div>
            <p className="text-xs font-semibold text-primary truncate">{companyName}</p>
          </div>
        </div>
      )}

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Main
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
                {item.label}
                {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-white/60" />}
              </Link>
            );
          })}
        </div>

        <p className="px-3 pb-1.5 pt-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Account
        </p>
        <div className="space-y-0.5">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User footer */}
      {userName && (
        <div className="border-t border-border px-3 py-3">
          <Link href="/settings" className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-accent transition-colors group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary shrink-0">
              {userInitials || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
              <p className="text-[10px] text-muted-foreground">View settings</p>
            </div>
            <Settings className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
          </Link>
        </div>
      )}
    </aside>
  );
}
