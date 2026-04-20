import { useEffect, useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  alertsUpdatedEventName,
  readAlerts,
  writeAlerts,
  type AlertRecord,
} from "@/lib/alertsStore";

const initialAlerts: AlertRecord[] = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    room: "304",
    floor: "3rd",
    type: "medical",
    severity: "critical",
    label: "Medical Emergency",
    message: "Severe chest pain and difficulty breathing",
    timestamp: "2 min ago",
    status: "pending",
  },
  {
    id: "2",
    patientName: "Michael Chen",
    room: "215",
    floor: "2nd",
    type: "medical",
    severity: "critical",
    label: "Medical Emergency",
    message: "Patient experiencing sudden pain and discomfort",
    timestamp: "8 min ago",
    status: "accepted",
  },
  {
    id: "3",
    patientName: "Emma Wilson",
    room: "402",
    floor: "4th",
    type: "unknown",
    severity: "low",
    label: "General Request",
    message: "Assistance with mobility needed",
    timestamp: "15 min ago",
    status: "resolved",
  },
  {
    id: "4",
    patientName: "James Rodriguez",
    room: "510",
    floor: "5th",
    type: "security",
    severity: "medium",
    label: "Security Alert",
    message: "Suspicious activity and concern for safety",
    timestamp: "4 min ago",
    status: "pending",
  },
];

const severityConfig = {
  critical: {
    color: "bg-critical text-critical-foreground",
    label: "Critical",
    borderColor: "border-critical",
  },
  medium: {
    color: "bg-medium text-medium-foreground",
    label: "Medium",
    borderColor: "border-medium",
  },
  low: {
    color: "bg-low text-low-foreground",
    label: "Low",
    borderColor: "border-low",
  },
};

const statusConfig = {
  pending: { label: "Pending", color: "text-critical font-bold" },
  accepted: { label: "Accepted", color: "text-medium font-semibold" },
  resolved: { label: "Resolved", color: "text-low" },
};

const emergencyTypeConfig = {
  fire: { label: "Fire/Smoke", emoji: "🔥" },
  medical: { label: "Medical", emoji: "🏥" },
  security: { label: "Security", emoji: "🚨" },
  unknown: { label: "General", emoji: "⚠️" },
};

export default function StaffDashboard() {
  const [alerts, setAlerts] = useState<AlertRecord[]>(() =>
    readAlerts(initialAlerts)
  );

  useEffect(() => {
    const syncAlerts = () => {
      setAlerts(readAlerts(initialAlerts));
    };

    window.addEventListener(alertsUpdatedEventName(), syncAlerts);
    window.addEventListener("storage", syncAlerts);

    return () => {
      window.removeEventListener(alertsUpdatedEventName(), syncAlerts);
      window.removeEventListener("storage", syncAlerts);
    };
  }, []);

  const handleAccept = (id: string) => {
    const nextAlerts = alerts.map((alert) =>
      alert.id === id ? { ...alert, status: "accepted" } : alert
    );
    setAlerts(nextAlerts);
    writeAlerts(nextAlerts);
  };

  const handleResolve = (id: string) => {
    const nextAlerts = alerts.map((alert) =>
      alert.id === id ? { ...alert, status: "resolved" } : alert
    );
    setAlerts(nextAlerts);
    writeAlerts(nextAlerts);
  };

  const handleFalseAlert = (id: string) => {
    const nextAlerts = alerts.filter((alert) => alert.id !== id);
    setAlerts(nextAlerts);
    writeAlerts(nextAlerts);
  };

  // Sort alerts: pending first, then by severity
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    const severityOrder = { critical: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const pendingCount = alerts.filter((a) => a.status === "pending").length;
  const criticalCount = alerts.filter(
    (a) => a.severity === "critical" && a.status !== "resolved"
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Pending Alerts
          </p>
          <p className={cn("mt-1 text-3xl font-bold", pendingCount > 0 ? "text-critical" : "text-foreground")}>
            {pendingCount}
          </p>
        </div>
        <div className="rounded-lg border border-critical bg-red-50 p-4">
          <p className="text-sm font-medium text-critical">Critical Alerts</p>
          <p className="mt-1 text-3xl font-bold text-critical">
            {criticalCount}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Total Alerts
          </p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            {alerts.length}
          </p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Active Alerts</h2>

        {sortedAlerts.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No alerts at this time</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedAlerts.map((alert) => {
              const severity = severityConfig[alert.severity];
              const status = statusConfig[alert.status];
              const emergencyType = emergencyTypeConfig[alert.type];

              return (
                <div
                  key={alert.id}
                  className={cn(
                    "rounded-lg border-2 bg-card p-4 transition-all",
                    severity.borderColor,
                    alert.status === "pending" ? "shadow-md" : ""
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Alert Info */}
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <div className={cn(
                          "inline-block rounded px-2 py-1 text-xs font-bold",
                          severity.color
                        )}>
                          {severity.label}
                        </div>
                        <span className="inline-block rounded border border-border bg-secondary px-2 py-1 text-xs font-medium text-foreground">
                          {emergencyType.emoji} {emergencyType.label}
                        </span>
                        <span className={cn("text-sm font-medium", status.color)}>
                          {status.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-foreground">
                        {alert.patientName}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm">
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Room:
                          </span>{" "}
                          {alert.room}
                        </span>
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Floor:
                          </span>{" "}
                          {alert.floor}
                        </span>
                      </div>

                      <p className="mt-3 rounded bg-secondary p-2 text-sm text-foreground">
                        {alert.message}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 sm:min-w-fit">
                      {alert.status === "pending" && (
                        <button
                          onClick={() => handleAccept(alert.id)}
                          className={cn(
                            "flex items-center justify-center gap-2 rounded border-2 border-medium bg-medium px-3 py-2 font-medium text-medium-foreground",
                            "transition-colors hover:bg-yellow-600"
                          )}
                        >
                          <Check className="h-4 w-4" /> Accept
                        </button>
                      )}

                      {alert.status !== "resolved" && (
                        <button
                          onClick={() => handleResolve(alert.id)}
                          className={cn(
                            "flex items-center justify-center gap-2 rounded border-2 border-low bg-low px-3 py-2 font-medium text-low-foreground",
                            "transition-colors hover:bg-green-700"
                          )}
                        >
                          <Check className="h-4 w-4" /> Resolve
                        </button>
                      )}

                      <button
                        onClick={() => handleFalseAlert(alert.id)}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded border border-border bg-background px-3 py-2 font-medium text-foreground",
                          "transition-colors hover:bg-secondary"
                        )}
                      >
                        <X className="h-4 w-4" /> False Alert
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
