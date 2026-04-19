import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "user" | "staff" | "admin";

interface LayoutProps {
  children: React.ReactNode;
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

const roleLabels: Record<Role, string> = {
  user: "Patient View",
  staff: "Staff Dashboard",
  admin: "Admin Dashboard",
};

export default function Layout({
  children,
  currentRole,
  onRoleChange,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-critical">
                <span className="text-xs font-bold text-critical-foreground">
                  ER
                </span>
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Emergency Response
              </h1>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                View:
              </span>
              <div className="relative inline-block">
                <select
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value as Role)}
                  className={cn(
                    "appearance-none rounded border border-border bg-card px-4 py-2 pr-10 text-sm font-medium",
                    "text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-critical focus:ring-offset-2",
                    "cursor-pointer"
                  )}
                >
                  <option value="user">{roleLabels.user}</option>
                  <option value="staff">{roleLabels.staff}</option>
                  <option value="admin">{roleLabels.admin}</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
