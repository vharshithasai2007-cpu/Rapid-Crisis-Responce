export interface EmergencyClassification {
  type: "fire" | "medical" | "security" | "unknown";
  severity: "critical" | "medium" | "low";
  label: string;
}

export function classifyEmergency(message: string): EmergencyClassification {
  const msg = message.toLowerCase();

  if (msg.includes("fire") || msg.includes("smoke")) {
    return {
      type: "fire",
      severity: "critical",
      label: "Fire/Smoke Emergency",
    };
  }
  if (msg.includes("pain") || msg.includes("breath") || msg.includes("faint")) {
    return {
      type: "medical",
      severity: "critical",
      label: "Medical Emergency",
    };
  }
  if (msg.includes("fight") || msg.includes("suspicious")) {
    return {
      type: "security",
      severity: "medium",
      label: "Security Alert",
    };
  }

  return { type: "unknown", severity: "low", label: "General Request" };
}
