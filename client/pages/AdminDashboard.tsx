import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertMetric {
  stage: string;
  count: number;
  percentage: number;
}

const mockAlerts = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    room: "304",
    floor: "3rd",
    severity: "critical",
    reportedAt: "2 min ago",
    assignedAt: "1 min ago",
    resolvedAt: null,
  },
  {
    id: "2",
    patientName: "Michael Chen",
    room: "215",
    floor: "2nd",
    severity: "medium",
    reportedAt: "8 min ago",
    assignedAt: "6 min ago",
    resolvedAt: "2 min ago",
  },
  {
    id: "3",
    patientName: "Emma Wilson",
    room: "402",
    floor: "4th",
    severity: "low",
    reportedAt: "15 min ago",
    assignedAt: "12 min ago",
    resolvedAt: "8 min ago",
  },
  {
    id: "4",
    patientName: "James Rodriguez",
    room: "510",
    floor: "5th",
    severity: "critical",
    reportedAt: "4 min ago",
    assignedAt: null,
    resolvedAt: null,
  },
];

const metrics: AlertMetric[] = [
  { stage: "Reported", count: 4, percentage: 100 },
  { stage: "Assigned", count: 3, percentage: 75 },
  { stage: "Resolved", count: 2, percentage: 50 },
];

const severityConfig = {
  critical: { color: "bg-critical text-critical-foreground", label: "Critical" },
  medium: { color: "bg-medium text-medium-foreground", label: "Medium" },
  low: { color: "bg-low text-low-foreground", label: "Low" },
};

export default function AdminDashboard() {
  const criticalAlerts = mockAlerts.filter(
    (a) => a.severity === "critical" && !a.resolvedAt
  );
  const avgResponseTime = 4;
  const resolutionRate = "50%";

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Total Alerts
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {mockAlerts.length}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="rounded-lg border-2 border-critical bg-red-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-critical">
                Critical
              </p>
              <p className="mt-2 text-3xl font-bold text-critical">
                {criticalAlerts.length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-critical" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Avg Response
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {avgResponseTime}m
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Resolution Rate
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {resolutionRate}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Alert Flow / Pipeline */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-bold text-foreground">
          Alert Pipeline
        </h2>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={metric.stage}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-foreground">
                  {metric.stage}
                </span>
                <span className="text-sm font-bold text-critical">
                  {metric.count} ({metric.percentage}%)
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-critical transition-all duration-300"
                  style={{ width: `${metric.percentage}%` }}
                />
              </div>
              {index < metrics.length - 1 && (
                <div className="mt-3 text-center text-sm text-muted-foreground">
                  ↓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Critical Alerts Highlight */}
      {criticalAlerts.length > 0 && (
        <div className="rounded-lg border-2 border-critical bg-red-50 p-6">
          <h2 className="mb-4 text-lg font-bold text-critical">
            Critical Alerts Requiring Attention
          </h2>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded border border-critical bg-white p-4"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "inline-block rounded px-2 py-1 text-xs font-bold",
                        severityConfig.critical.color
                      )}>
                        {severityConfig.critical.label}
                      </span>
                      <span className="font-bold text-foreground">
                        {alert.patientName}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Room {alert.room}</span>
                      <span>{alert.floor} Floor</span>
                      <span>{alert.reportedAt}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-critical">
                      ⚠ Not yet assigned
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Alerts Table */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-bold text-foreground">All Alerts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Patient
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Room
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Severity
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Reported
                </th>
              </tr>
            </thead>
            <tbody>
              {mockAlerts.map((alert) => (
                <tr key={alert.id} className="border-b border-border">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {alert.patientName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {alert.room}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-block rounded px-2 py-1 text-xs font-bold",
                        severityConfig[alert.severity].color
                      )}
                    >
                      {severityConfig[alert.severity].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {!alert.assignedAt ? (
                        <span className="h-2 w-2 rounded-full bg-critical"></span>
                      ) : !alert.resolvedAt ? (
                        <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-green-600"></span>
                      )}
                      <span className="text-muted-foreground">
                        {!alert.assignedAt
                          ? "Reported"
                          : !alert.resolvedAt
                            ? "Assigned"
                            : "Resolved"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {alert.reportedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
