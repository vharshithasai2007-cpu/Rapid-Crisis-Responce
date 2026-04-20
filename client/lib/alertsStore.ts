import type { EmergencyClassification } from "@/lib/classifyEmergency";

export interface AlertRecord {
  id: string;
  patientName: string;
  room: string;
  floor: string;
  type: EmergencyClassification["type"];
  severity: EmergencyClassification["severity"];
  label: string;
  message: string;
  timestamp: string;
  status: "pending" | "accepted" | "resolved";
}

const ALERTS_STORAGE_KEY = "emergency-alerts";
const ALERTS_UPDATED_EVENT = "emergency-alerts-updated";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function readAlerts(fallback: AlertRecord[]): AlertRecord[] {
  if (!canUseStorage()) {
    return fallback;
  }

  const raw = window.localStorage.getItem(ALERTS_STORAGE_KEY);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as AlertRecord[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writeAlerts(alerts: AlertRecord[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  window.dispatchEvent(new Event(ALERTS_UPDATED_EVENT));
}

export function addAlert(alert: AlertRecord, fallback: AlertRecord[] = []) {
  const existing = readAlerts(fallback);
  writeAlerts([alert, ...existing]);
}

export function alertsUpdatedEventName() {
  return ALERTS_UPDATED_EVENT;
}
