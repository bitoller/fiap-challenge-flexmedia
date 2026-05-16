import type { DashboardResult, HotelProfile, HotelSummary, KioskDevice, ReservationSummary } from "../types";
import type { OverviewActivity, OverviewMetric, OverviewUnit, TrendPoint } from "./types";

const TREND_LABELS = ["00:00", "06:00", "12:00", "18:00", "AGORA"];

export function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined).format(value);
}

function normalizeText(value: unknown, fallback = "—") {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === "string") {
    return value.trim() || fallback;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

function toTitleCase(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getRecordValue(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      return record[key];
    }
  }
  return undefined;
}

function parseActivity(record: Record<string, unknown>, index: number, hotelId: number | null): OverviewActivity {
  const action = normalizeText(getRecordValue(record, ["action", "event", "name"]), "Operational event");
  const resourceType = normalizeText(getRecordValue(record, ["resourceType", "resource_type", "type"]), "");
  const actorType = normalizeText(getRecordValue(record, ["actorType", "actor_type"]), "");
  const result = normalizeText(getRecordValue(record, ["result", "status"]), "OK");
  const resourceId = normalizeText(getRecordValue(record, ["resourceId", "resource_id", "id"]), "");
  const correlationId = normalizeText(getRecordValue(record, ["correlationId", "correlation_id"]), "");
  const timestamp = normalizeText(getRecordValue(record, ["createdAt", "created_at", "timestamp", "time"]), "");

  const contextBits = [actorType, resourceType, resourceId].filter(Boolean).join(" ");
  const suffix = correlationId && correlationId !== "—" ? ` • ${correlationId}` : "";
  const hotelLabel = hotelId !== null ? `Hotel ${hotelId}` : "All hotels";

  return {
    title: `${action}${contextBits ? ` ${contextBits}` : ""}`,
    subtitle: result === "OK" ? `${hotelLabel} operation completed` : `${hotelLabel} operation needs attention`,
    meta: `${timestamp || `Event ${index + 1}`}${suffix}`,
    tone: result.toUpperCase().includes("FAIL") ? "muted" : index === 0 ? "gold" : "neutral",
  };
}

function pickAccent(index: number) {
  const palette = ["#8f6a19", "#b28933", "#d4b46f", "#6f5a38"];
  return palette[index % palette.length];
}

export function buildTrendPoints(dashboard: DashboardResult | null): TrendPoint[] {
  const reservations = dashboard?.reservationsToday ?? 0;
  const active = dashboard?.activeStays ?? 0;
  const checkins = dashboard?.completedCheckins ?? 0;
  const checkouts = dashboard?.completedCheckouts ?? 0;
  const failures = dashboard?.failedSessions ?? 0;
  const online = dashboard?.deviceStatus.onlineDevices ?? 0;
  const total = dashboard?.deviceStatus.totalDevices ?? 0;

  const max = Math.max(reservations, active, checkins, checkouts, failures, total, 1);
  const baseline = Math.max(1, Math.round(max * 0.15));
  const peak = Math.max(baseline + 3, Math.round(max * 0.95));
  const secondPeak = Math.max(baseline + 2, Math.round(max * 0.7));
  const closing = Math.max(baseline + 1, Math.round((online / Math.max(total, 1)) * peak));

  return [
    { label: TREND_LABELS[0], value: baseline },
    { label: TREND_LABELS[1], value: Math.max(baseline + 1, Math.round(reservations * 0.45) + baseline) },
    { label: TREND_LABELS[2], value: Math.max(secondPeak, checkins + active) },
    { label: TREND_LABELS[3], value: Math.max(baseline + 2, checkouts + failures + baseline) },
    { label: TREND_LABELS[4], value: peak > 0 ? peak : closing },
  ];
}

export function buildTrendPath(points: TrendPoint[]) {
  if (points.length === 0) {
    return "";
  }

  const width = 100;
  const height = 60;
  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const step = points.length === 1 ? 0 : width / (points.length - 1);

  const coords = points.map((point, index) => {
    const x = index * step;
    const y = height - (point.value / maxValue) * (height - 8) - 2;
    return { x, y };
  });

  return coords
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
}

export function buildMetricCards(dashboard: DashboardResult | null): OverviewMetric[] {
  const totalDevices = dashboard?.deviceStatus.totalDevices ?? 0;
  const onlineDevices = dashboard?.deviceStatus.onlineDevices ?? 0;
  const totalHealth = totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0;
  const averageTransaction = dashboard
    ? (dashboard.reservationsToday + dashboard.activeStays + dashboard.completedCheckins + dashboard.completedCheckouts) /
      Math.max(1, dashboard.reservationsToday || dashboard.activeStays || dashboard.completedCheckins || dashboard.completedCheckouts)
    : 0;

  return [
    {
      label: "Quartos ativos",
      value: formatNumber(dashboard?.activeStays ?? 0),
      detail: `${formatNumber(dashboard?.reservationsToday ?? 0)} reservas hoje`,
    },
    {
      label: "Check-ins diarios",
      value: formatNumber(dashboard?.completedCheckins ?? 0),
      detail: `${formatNumber(dashboard?.completedCheckouts ?? 0)} check-outs`,
    },
    {
      label: "Transacao media",
      value: `${averageTransaction > 0 ? averageTransaction.toFixed(0) : 0} sec`,
      detail: "Tempo estimado por interacao",
    },
    {
      label: "Saude do sistema",
      value: totalHealth > 0 ? "Estavel" : "Sem dados",
      detail: `${formatNumber(onlineDevices)} de ${formatNumber(totalDevices)} online`,
    },
  ];
}

export function buildActivityFeed(dashboard: DashboardResult | null, hotelId: number | null): OverviewActivity[] {
  const records = dashboard?.recentSessions ?? [];
  const activities = records.slice(0, 4).map((record, index) => parseActivity(record, index, hotelId));

  if (activities.length > 0) {
    return activities;
  }

  return [
    {
      title: "No recent activity",
      subtitle: "The overview will list operational events here as they arrive.",
      meta: hotelId !== null ? `Hotel ${hotelId}` : "All hotels",
      tone: "muted",
    },
  ];
}

export function buildUnits(dashboard: DashboardResult | null, selectedHotel: HotelSummary | null, hotelProfile: HotelProfile | null): OverviewUnit[] {
  const devices = dashboard?.deviceStatus.devices ?? [];
  const totalDevices = dashboard?.deviceStatus.totalDevices ?? 0;
  const online = dashboard?.deviceStatus.onlineDevices ?? 0;
  const offline = dashboard?.deviceStatus.offlineDevices ?? 0;
  const maintenance = dashboard?.deviceStatus.maintenanceDevices ?? 0;
  const errors = dashboard?.deviceStatus.errorDevices ?? 0;
  const hotelName = selectedHotel?.name ?? "Selected hotel";
  const amenity = hotelProfile?.content.amenities?.[0] ?? "Guest flow";

  const deviceUnits: OverviewUnit[] = devices.slice(0, 3).map((device, index) => {
    const kiosk = device as KioskDevice;
    const name = normalizeText(kiosk.name, `Kiosk ${index + 1}`);
    const status = normalizeText(kiosk.status, "ONLINE");
    const uptime = normalizeText(kiosk.lastSeenAt, "Monitoring active");
    const statusUpper = status.toUpperCase();

    return {
      name,
      subtitle: uptime,
      status: toTitleCase(status),
      statusTone: statusUpper.includes("OFFLINE") || statusUpper.includes("ERROR")
        ? "danger"
        : statusUpper.includes("MAINT") || statusUpper.includes("WARN")
          ? "warning"
          : "good",
      metric: kiosk.batteryLevel === null ? "Battery N/A" : `${kiosk.batteryLevel}% battery`,
      detail: `${hotelName} ${index === 0 ? "front line" : "operations"}`,
      accent: pickAccent(index),
    } satisfies OverviewUnit;
  });

  if (deviceUnits.length > 0) {
    return deviceUnits;
  }

  return [
    {
      name: "Reception",
      subtitle: amenity,
      status: totalDevices > 0 && offline === 0 && errors === 0 ? "Online" : "Review",
      statusTone: totalDevices > 0 && offline === 0 && errors === 0 ? "good" : "warning",
      metric: `${formatNumber(online)} online`,
      detail: `${formatNumber(totalDevices)} devices observed`,
      accent: pickAccent(0),
    },
    {
      name: "Guest floors",
      subtitle: "Room circulation",
      status: maintenance > 0 ? "Maintenance" : "Stable",
      statusTone: maintenance > 0 ? "warning" : "good",
      metric: `${formatNumber(dashboard?.activeStays ?? 0)} active`,
      detail: `${formatNumber(offline)} offline devices`,
      accent: pickAccent(1),
    },
    {
      name: "Operations",
      subtitle: "Admin oversight",
      status: errors > 0 || (dashboard?.failedSessions ?? 0) > 0 ? "Attention" : "Healthy",
      statusTone: errors > 0 || (dashboard?.failedSessions ?? 0) > 0 ? "danger" : "good",
      metric: `${formatNumber(dashboard?.failedSessions ?? 0)} failures`,
      detail: `${formatNumber(dashboard?.completedCheckins ?? 0)} check-ins completed`,
      accent: pickAccent(2),
    },
  ];
}
