import { useState } from "react";
import { Mic, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  classifyEmergency,
  type EmergencyClassification,
} from "@/lib/classifyEmergency";

interface AlertStatus {
  isActive: boolean;
  message: string;
  classification: EmergencyClassification;
}

export default function UserView() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState<AlertStatus | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleSOSClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmAlert = () => {
    const messageToSend = message || "Emergency assistance needed";
    const classification = classifyEmergency(messageToSend);
    setAlertStatus({
      isActive: true,
      message: messageToSend,
      classification,
    });
    setShowConfirmation(false);
    setMessage("");
  };

  const handleResolveAlert = () => {
    setAlertStatus(null);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice input
      setTimeout(() => {
        setMessage("I need immediate medical assistance");
        setIsRecording(false);
      }, 2000);
    }
  };

  const handleReportUnattended = () => {
    const unattendedMessage = "Patient is unattended";
    const classification = classifyEmergency(unattendedMessage);
    setAlertStatus({
      isActive: true,
      message: unattendedMessage,
      classification,
    });
  };

  return (
    <div className="space-y-8">
      {/* User Info Card */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Patient Name
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              Sarah Johnson
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Room Number
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              Room 304
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Floor
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              3rd Floor
            </p>
          </div>
        </div>
      </div>

      {/* Alert Status */}
      {alertStatus?.isActive && (
        <div
          className={cn(
            "rounded-lg border-2 p-6",
            alertStatus.classification.severity === "critical"
              ? "border-critical bg-red-50"
              : alertStatus.classification.severity === "medium"
                ? "border-medium bg-yellow-50"
                : "border-low bg-green-50"
          )}
        >
          <div className="mb-4 flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                alertStatus.classification.severity === "critical"
                  ? "bg-critical"
                  : alertStatus.classification.severity === "medium"
                    ? "bg-medium"
                    : "bg-low"
              )}
            >
              <span
                className={cn(
                  "text-lg font-bold",
                  alertStatus.classification.severity === "critical"
                    ? "text-critical-foreground"
                    : alertStatus.classification.severity === "medium"
                      ? "text-medium-foreground"
                      : "text-low-foreground"
                )}
              >
                !
              </span>
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <p
                  className={cn(
                    "font-semibold",
                    alertStatus.classification.severity === "critical"
                      ? "text-critical"
                      : alertStatus.classification.severity === "medium"
                        ? "text-medium"
                        : "text-low"
                  )}
                >
                  Alert Sent
                </p>
                <span
                  className={cn(
                    "rounded px-2 py-1 text-xs font-bold",
                    alertStatus.classification.severity === "critical"
                      ? "bg-critical text-critical-foreground"
                      : alertStatus.classification.severity === "medium"
                        ? "bg-medium text-medium-foreground"
                        : "bg-low text-low-foreground"
                  )}
                >
                  {alertStatus.classification.label}
                </span>
              </div>
              <p className="text-sm text-foreground">
                {alertStatus.message}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              ✓ Help is on the way
            </p>
            <p className="text-xs text-muted-foreground">
              Staff has been notified. Please remain calm and stay in your
              location.
            </p>
            <button
              onClick={handleResolveAlert}
              className={cn(
                "mt-4 rounded border px-4 py-2 text-sm font-medium transition-colors",
                alertStatus.classification.severity === "critical"
                  ? "border-critical bg-critical text-critical-foreground hover:bg-red-700"
                  : alertStatus.classification.severity === "medium"
                    ? "border-medium bg-medium text-medium-foreground hover:bg-yellow-600"
                    : "border-low bg-low text-low-foreground hover:bg-green-700"
              )}
            >
              Clear Alert
            </button>
          </div>
        </div>
      )}

      {/* Main SOS Button */}
      {!alertStatus?.isActive && (
        <div className="flex flex-col items-center justify-center gap-8 py-12">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Press the button below in case of emergency
          </p>

          <button
            onClick={handleSOSClick}
            className={cn(
              "flex h-48 w-48 flex-col items-center justify-center rounded-full border-4 border-critical bg-critical text-critical-foreground",
              "shadow-lg transition-all hover:scale-105 active:scale-95",
              "text-4xl font-bold"
            )}
          >
            <span>SOS</span>
            <span className="mt-2 text-sm font-normal">Press for help</span>
          </button>

          {/* Emergency Message Input */}
          <div className="w-full max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">
                Emergency Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your emergency..."
                className={cn(
                  "mt-2 w-full rounded border border-border bg-background px-4 py-3 text-sm text-foreground",
                  "placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-critical focus:ring-offset-2",
                  "resize-none"
                )}
                rows={3}
              />
            </div>

            {/* Voice Input Button */}
            <button
              onClick={handleVoiceInput}
              className={cn(
                "w-full rounded border-2 px-4 py-3 font-medium transition-all",
                isRecording
                  ? "border-critical bg-red-50 text-critical"
                  : "border-border bg-secondary text-foreground hover:bg-muted"
              )}
            >
              <Mic className="mb-2 inline h-5 w-5" />
              {isRecording ? " Recording..." : " Voice Input"}
            </button>

            {/* Report Unattended Button */}
            <button
              onClick={handleReportUnattended}
              className={cn(
                "w-full rounded border-2 border-medium bg-medium px-4 py-3 font-medium text-medium-foreground",
                "transition-colors hover:bg-yellow-600"
              )}
            >
              Report Unattended
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-xl">
            <div className="mb-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-critical bg-red-50">
                  <span className="text-2xl font-bold text-critical">!</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Confirm Emergency Alert
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Are you sure you need emergency assistance?
              </p>
              {message && (
                <p className="mt-4 rounded bg-secondary p-3 text-sm text-foreground">
                  "{message}"
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className={cn(
                  "flex-1 rounded border border-border bg-background px-4 py-3 font-medium text-foreground",
                  "transition-colors hover:bg-secondary"
                )}
              >
                <X className="mb-1 inline h-4 w-4" /> Cancel
              </button>
              <button
                onClick={handleConfirmAlert}
                className={cn(
                  "flex-1 rounded border border-critical bg-critical px-4 py-3 font-medium text-critical-foreground",
                  "transition-colors hover:bg-red-700"
                )}
              >
                Send Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
