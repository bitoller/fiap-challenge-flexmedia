import type { DashboardResult, HotelProfile, HotelSummary, KioskDevice } from "../types";
import type { OverviewActivity, OverviewMetric, OverviewUnit, TrendPoint } from "./types";
import type { AdminCopy } from "./copy";

type DashboardLabels = AdminCopy["overviewPage"]["dashboard"];
type LocaleKey = "en" | "pt-BR" | "es";

const INTL_LOCALE: Record<LocaleKey, string> = {
  en: "en-US",
  "pt-BR": "pt-BR",
  es: "es-ES",
};

export function formatCurrency(value: number, currency: string, locale = "en") {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
}

export function formatNumber(value: number, locale = "en") {
  return new Intl.NumberFormat(locale).format(value);
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

function resolveDate(value: unknown) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "string" && value.trim()) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export function formatEventTimestamp(value: unknown, locale: LocaleKey) {
  const date = resolveDate(value);
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function localizeAction(action: string, locale: LocaleKey) {
  const code = action.toUpperCase();
  const map: Record<LocaleKey, Record<string, string>> = {
    en: {
      SESSION_STARTED: "Session started",
      CHECKIN_COMPLETED: "Check-in completed",
      CHECKOUT_COMPLETED: "Check-out completed",
      IDENTITY_VERIFIED: "Identity verified",
      PAYMENT_APPROVED: "Payment approved",
      PAYMENT_DECLINED: "Payment declined",
      RESERVATION_CREATED: "Reservation created",
      RESERVATION_ATTACHED: "Reservation linked",
      RESERVATION_CANCELLED: "Reservation cancelled",
      ROOM_ASSIGNED: "Room assigned",
      GUEST_DATA_CONFIRMED: "Guest details confirmed",
      CONSENTS_REGISTERED: "Consents recorded",
      DOCUMENT_REJECTED: "Document rejected",
      BIOMETRY_REJECTED: "Biometry rejected",
      GUEST_SERVICE_REQUESTED: "Guest service requested",
      GUEST_SERVICE_ACKNOWLEDGED: "Guest service acknowledged",
      CONCIERGE_HELP_REQUESTED: "Concierge help requested",
      CONCIERGE_HELP_ACKNOWLEDGED: "Concierge help acknowledged",
    },
    "pt-BR": {
      SESSION_STARTED: "Sessão iniciada",
      CHECKIN_COMPLETED: "Check-in concluído",
      CHECKOUT_COMPLETED: "Check-out concluído",
      IDENTITY_VERIFIED: "Identidade verificada",
      PAYMENT_APPROVED: "Pagamento aprovado",
      PAYMENT_DECLINED: "Pagamento recusado",
      RESERVATION_CREATED: "Reserva criada",
      RESERVATION_ATTACHED: "Reserva vinculada",
      RESERVATION_CANCELLED: "Reserva cancelada",
      ROOM_ASSIGNED: "Quarto atribuído",
      GUEST_DATA_CONFIRMED: "Dados do hóspede confirmados",
      CONSENTS_REGISTERED: "Consentimentos registrados",
      DOCUMENT_REJECTED: "Documento recusado",
      BIOMETRY_REJECTED: "Biometria recusada",
      GUEST_SERVICE_REQUESTED: "Serviço solicitado pelo hóspede",
      GUEST_SERVICE_ACKNOWLEDGED: "Solicitação de serviço reconhecida",
      CONCIERGE_HELP_REQUESTED: "Ajuda da concierge solicitada",
      CONCIERGE_HELP_ACKNOWLEDGED: "Solicitação da concierge reconhecida",
    },
    es: {
      SESSION_STARTED: "Sesión iniciada",
      CHECKIN_COMPLETED: "Check-in completado",
      CHECKOUT_COMPLETED: "Check-out completado",
      IDENTITY_VERIFIED: "Identidad verificada",
      PAYMENT_APPROVED: "Pago aprobado",
      PAYMENT_DECLINED: "Pago rechazado",
      RESERVATION_CREATED: "Reserva creada",
      RESERVATION_ATTACHED: "Reserva vinculada",
      RESERVATION_CANCELLED: "Reserva cancelada",
      ROOM_ASSIGNED: "Habitación asignada",
      GUEST_DATA_CONFIRMED: "Datos del huésped confirmados",
      CONSENTS_REGISTERED: "Consentimientos registrados",
      DOCUMENT_REJECTED: "Documento rechazado",
      BIOMETRY_REJECTED: "Biometría rechazada",
      GUEST_SERVICE_REQUESTED: "Servicio solicitado por el huésped",
      GUEST_SERVICE_ACKNOWLEDGED: "Solicitud de servicio reconocida",
      CONCIERGE_HELP_REQUESTED: "Ayuda de conserjería solicitada",
      CONCIERGE_HELP_ACKNOWLEDGED: "Solicitud de conserjería reconocida",
    },
  };

  return map[locale][code] || toTitleCase(action);
}

export function localizeResourceType(resourceType: string, locale: LocaleKey) {
  const code = resourceType.toUpperCase();
  const map: Record<LocaleKey, Record<string, string>> = {
    en: {
      CHECKIN_SESSION: "check-in session",
      STAY: "stay",
      RESERVATION: "reservation",
      GUEST: "guest",
      IDENTITY: "identity",
      DEVICE: "device",
      KIOSK: "kiosk",
      PAYMENT: "payment",
      DOCUMENT: "document",
      BIOMETRY: "biometry",
      CONSENT: "consent",
      HOUSEKEEPING: "housekeeping",
      AMENITIES: "towels and amenities",
      DINING: "room service",
      CONCIERGE: "concierge",
    },
    "pt-BR": {
      CHECKIN_SESSION: "sessão de check-in",
      STAY: "estadia",
      RESERVATION: "reserva",
      GUEST: "hóspede",
      IDENTITY: "identidade",
      DEVICE: "dispositivo",
      KIOSK: "kiosk",
      PAYMENT: "pagamento",
      DOCUMENT: "documento",
      BIOMETRY: "biometria",
      CONSENT: "consentimento",
      HOUSEKEEPING: "arrumação do quarto",
      AMENITIES: "toalhas e amenities",
      DINING: "serviço de quarto",
      CONCIERGE: "concierge",
    },
    es: {
      CHECKIN_SESSION: "sesión de check-in",
      STAY: "estancia",
      RESERVATION: "reserva",
      GUEST: "huésped",
      IDENTITY: "identidad",
      DEVICE: "dispositivo",
      KIOSK: "kiosco",
      PAYMENT: "pago",
      DOCUMENT: "documento",
      BIOMETRY: "biometría",
      CONSENT: "consentimiento",
      HOUSEKEEPING: "limpieza de la habitación",
      AMENITIES: "toallas y amenities",
      DINING: "servicio de habitación",
      CONCIERGE: "conserjería",
    },
  };

  return map[locale][code] || toTitleCase(resourceType);
}

export function localizeActorType(actorType: string, locale: LocaleKey) {
  const code = actorType.toUpperCase();
  const map: Record<LocaleKey, Record<string, string>> = {
    en: { KIOSK: "kiosk", ADMIN: "admin", GUEST: "guest" },
    "pt-BR": { KIOSK: "kiosk", ADMIN: "admin", GUEST: "hóspede" },
    es: { KIOSK: "kiosco", ADMIN: "administración", GUEST: "huésped" },
  };

  return map[locale][code] || toTitleCase(actorType);
}

function parseActivity(
  record: Record<string, unknown>,
  index: number,
  hotelId: number | null,
  labels: DashboardLabels["activity"],
  locale: LocaleKey
): OverviewActivity {
  const action = normalizeText(getRecordValue(record, ["action", "event", "name"]), labels.eventPrefix);
  const resourceType = normalizeText(getRecordValue(record, ["resourceType", "resource_type", "type"]), "");
  const actorType = normalizeText(getRecordValue(record, ["actorType", "actor_type"]), "");
  const result = normalizeText(getRecordValue(record, ["result", "status"]), "OK");
  const resourceId = normalizeText(getRecordValue(record, ["resourceId", "resource_id", "id"]), "");
  const timestamp = getRecordValue(record, ["createdAt", "created_at", "timestamp", "time"]);

  const hotelLabel = hotelId !== null ? `${labels.hotelPrefix} ${hotelId}` : labels.allHotels;
  const humanAction = localizeAction(action, locale);
  const source = [action, resourceType, actorType].filter(Boolean).join(" ").toUpperCase();
  const messages = locale === "pt-BR"
    ? {
        support: "A recepção foi avisada de que um hóspede precisa de ajuda.",
        checkout: "A estadia foi encerrada e o quarto foi liberado.",
        checkin: "Um hóspede concluiu o check-in com sucesso.",
        identity: "A verificação de identidade foi concluída.",
        reservation: "Uma reserva foi vinculada à jornada do hóspede.",
        session: "Uma nova sessão foi iniciada no kiosk.",
      }
    : locale === "es"
      ? {
          support: "Recepción fue avisada de que un huésped necesita ayuda.",
          checkout: "La estancia se cerró y la habitación fue liberada.",
          checkin: "Un huésped completó el check-in correctamente.",
          identity: "La verificación de identidad se completó.",
          reservation: "Una reserva se vinculó al recorrido del huésped.",
          session: "Se inició una nueva sesión en el kiosco.",
        }
      : {
          support: "Reception was notified that a guest needs assistance.",
          checkout: "The stay was closed and the room was released.",
          checkin: "A guest completed check-in successfully.",
          identity: "Identity verification was completed.",
          reservation: "A reservation was linked to the guest journey.",
          session: "A new kiosk session was started.",
        };
  const detail = /HELP|CONCIERGE|ASSIST|GUEST_SERVICE|HOUSEKEEPING|AMENIT|DINING/.test(source)
    ? messages.support
    : /CHECK.?OUT|STAY/.test(source)
      ? messages.checkout
      : /CHECK.?IN/.test(source)
        ? messages.checkin
        : /IDENTITY|BIOMETRY|FACE|DOCUMENT/.test(source)
          ? messages.identity
          : /RESERVATION/.test(source)
            ? messages.reservation
            : /SESSION/.test(source)
              ? messages.session
              : "";
  const timestampLabel = formatEventTimestamp(timestamp, locale) || `${labels.eventPrefix} ${index + 1}`;

  return {
    title: humanAction,
    subtitle: detail || `${hotelLabel} ${result === "OK" ? labels.operationCompleted : labels.operationNeedsAttention}`,
    meta: timestampLabel,
    tone: result.toUpperCase().includes("FAIL") ? "muted" : index === 0 ? "gold" : "neutral",
  };
}

function pickAccent(index: number) {
  const palette = ["#8f6a19", "#b28933", "#d4b46f", "#6f5a38"];
  return palette[index % palette.length];
}

export function buildTrendPoints(dashboard: DashboardResult | null, labels: DashboardLabels): TrendPoint[] {
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
    { label: labels.trendLabels[0], value: baseline },
    { label: labels.trendLabels[1], value: Math.max(baseline + 1, Math.round(reservations * 0.45) + baseline) },
    { label: labels.trendLabels[2], value: Math.max(secondPeak, checkins + active) },
    { label: labels.trendLabels[3], value: Math.max(baseline + 2, checkouts + failures + baseline) },
    { label: labels.trendLabels[4], value: peak > 0 ? peak : closing },
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

export function buildMetricCards(dashboard: DashboardResult | null, labels: DashboardLabels["metrics"], locale = "en"): OverviewMetric[] {
  const totalDevices = dashboard?.deviceStatus.totalDevices ?? 0;
  const onlineDevices = dashboard?.deviceStatus.onlineDevices ?? 0;
  const totalHealth = totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0;
  const averageTransaction = dashboard
    ? (dashboard.reservationsToday + dashboard.activeStays + dashboard.completedCheckins + dashboard.completedCheckouts) /
      Math.max(1, dashboard.reservationsToday || dashboard.activeStays || dashboard.completedCheckins || dashboard.completedCheckouts)
    : 0;

  return [
    {
      label: labels.activeRoomsTitle,
      value: formatNumber(dashboard?.activeStays ?? 0, locale),
      detail: `${formatNumber(dashboard?.reservationsToday ?? 0, locale)} ${labels.activeRoomsDetailSuffix}`,
    },
    {
      label: labels.checkinsTitle,
      value: formatNumber(dashboard?.completedCheckins ?? 0, locale),
      detail: `${formatNumber(dashboard?.completedCheckouts ?? 0, locale)} ${labels.checkinsDetailSuffix}`,
    },
    {
      label: labels.transactionTitle,
      value: `${averageTransaction > 0 ? averageTransaction.toFixed(0) : 0} sec`,
      detail: labels.transactionDetail,
    },
    {
      label: labels.systemHealthTitle,
      value: totalHealth > 0 ? labels.systemHealthStable : labels.systemHealthNoData,
      detail: `${formatNumber(onlineDevices, locale)} ${labels.systemHealthDetailOnlineSuffix} ${formatNumber(totalDevices, locale)} ${labels.systemHealthDetailOfSuffix} online`,
    },
  ];
}

export function buildActivityFeed(
  dashboard: DashboardResult | null,
  hotelId: number | null,
  labels: DashboardLabels["activity"],
  locale: LocaleKey
): OverviewActivity[] {
  const records = dashboard?.recentSessions ?? [];
  const activities = records.slice(0, 4).map((record, index) => parseActivity(record, index, hotelId, labels, locale));

  if (activities.length > 0) {
    return activities;
  }

  return [
    {
      title: labels.noRecentActivityTitle,
      subtitle: labels.noRecentActivitySubtitle,
      meta: hotelId !== null ? `${labels.hotelPrefix} ${hotelId}` : labels.allHotels,
      tone: "muted",
    },
  ];
}

function translateDeviceStatus(status: string, labels: DashboardLabels["units"]) {
  const value = status.toUpperCase();
  if (value === "ONLINE") return labels.online;
  if (value === "OFFLINE") return labels.attention;
  if (value.includes("MAINT")) return labels.review;
  if (value.includes("ERROR")) return labels.attention;
  return toTitleCase(status);
}

export function buildUnits(
  dashboard: DashboardResult | null,
  selectedHotel: HotelSummary | null,
  hotelProfile: HotelProfile | null,
  labels: DashboardLabels["units"],
  locale = "en"
): OverviewUnit[] {
  const devices = dashboard?.deviceStatus.devices ?? [];
  const totalDevices = dashboard?.deviceStatus.totalDevices ?? 0;
  const online = dashboard?.deviceStatus.onlineDevices ?? 0;
  const offline = dashboard?.deviceStatus.offlineDevices ?? 0;
  const maintenance = dashboard?.deviceStatus.maintenanceDevices ?? 0;
  const errors = dashboard?.deviceStatus.errorDevices ?? 0;
  const hotelName = selectedHotel?.name ?? labels.selectedHotel;
  const amenity = hotelProfile?.content.amenities?.[0] ?? labels.roomCirculation;

  const deviceUnits: OverviewUnit[] = devices.slice(0, 3).map((device, index) => {
    const kiosk = device as KioskDevice;
    const name = normalizeText(kiosk.name, `${labels.selectedHotel} ${index + 1}`);
    const status = normalizeText(kiosk.status, "ONLINE");
    const uptime = formatEventTimestamp(kiosk.lastSeenAt, locale as LocaleKey) || normalizeText(kiosk.lastSeenAt, labels.monitoringActive);
    const statusUpper = status.toUpperCase();

    return {
      name,
      subtitle: uptime,
      status: translateDeviceStatus(status, labels),
      statusTone: statusUpper.includes("OFFLINE") || statusUpper.includes("ERROR")
        ? "danger"
        : statusUpper.includes("MAINT") || statusUpper.includes("WARN")
          ? "warning"
          : "good",
      metric: kiosk.batteryLevel === null ? labels.batteryUnavailable : `${kiosk.batteryLevel}% ${labels.batterySuffix}`,
      detail: `${hotelName} • ${index === 0 ? labels.frontLineSuffix : labels.operationsSuffix}`,
      accent: pickAccent(index),
    } satisfies OverviewUnit;
  });

  if (deviceUnits.length > 0) {
    return deviceUnits;
  }

  return [
    {
      name: labels.reception,
      subtitle: amenity,
      status: totalDevices > 0 && offline === 0 && errors === 0 ? labels.online : labels.review,
      statusTone: totalDevices > 0 && offline === 0 && errors === 0 ? "good" : "warning",
      metric: `${formatNumber(online, locale)} ${labels.online}`,
      detail: `${formatNumber(totalDevices, locale)} ${labels.observedDevices}`,
      accent: pickAccent(0),
    },
    {
      name: labels.guestFloors,
      subtitle: labels.roomCirculation,
      status: maintenance > 0 ? labels.review : labels.stable,
      statusTone: maintenance > 0 ? "warning" : "good",
      metric: `${formatNumber(dashboard?.activeStays ?? 0, locale)} ${labels.online}`,
      detail: `${formatNumber(offline, locale)} ${labels.observedDevices}`,
      accent: pickAccent(1),
    },
    {
      name: labels.operations,
      subtitle: labels.adminOversight,
      status: errors > 0 || (dashboard?.failedSessions ?? 0) > 0 ? labels.attention : labels.healthy,
      statusTone: errors > 0 || (dashboard?.failedSessions ?? 0) > 0 ? "danger" : "good",
      metric: `${formatNumber(dashboard?.failedSessions ?? 0, locale)} ${labels.failures}`,
      detail: `${formatNumber(dashboard?.completedCheckins ?? 0, locale)} ${labels.checkInsCompleted}`,
      accent: pickAccent(2),
    },
  ];
}
