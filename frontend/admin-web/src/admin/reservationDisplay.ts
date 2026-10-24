type SupportedLanguage = "en" | "pt-BR" | "es";

type LocalizedLabels = Record<SupportedLanguage, Record<string, string>>;

const STATUS_LABELS: LocalizedLabels = {
  en: {
    CONFIRMED: "Confirmed",
    PENDING: "Pending",
    CHECKED_IN: "Checked in",
    CHECKED_OUT: "Checked out",
    CANCELLED: "Cancelled",
  },
  "pt-BR": {
    CONFIRMED: "Confirmada",
    PENDING: "Pendente",
    CHECKED_IN: "Check-in realizado",
    CHECKED_OUT: "Check-out realizado",
    CANCELLED: "Cancelada",
  },
  es: {
    CONFIRMED: "Confirmada",
    PENDING: "Pendiente",
    CHECKED_IN: "Check-in realizado",
    CHECKED_OUT: "Check-out realizado",
    CANCELLED: "Cancelada",
  },
};

const ROOM_STATUS_LABELS: LocalizedLabels = {
  en: {
    AVAILABLE: "Available",
    OCCUPIED: "Occupied",
    RESERVED: "Reserved",
    CLEANING: "Being cleaned",
    MAINTENANCE: "Under maintenance",
  },
  "pt-BR": {
    AVAILABLE: "Disponível",
    OCCUPIED: "Ocupado",
    RESERVED: "Reservado",
    CLEANING: "Em limpeza",
    MAINTENANCE: "Em manutenção",
  },
  es: {
    AVAILABLE: "Disponible",
    OCCUPIED: "Ocupada",
    RESERVED: "Reservada",
    CLEANING: "En limpieza",
    MAINTENANCE: "En mantenimiento",
  },
};

const DEVICE_STATUS_LABELS: LocalizedLabels = {
  en: {
    ONLINE: "Online",
    OFFLINE: "Offline",
    MAINTENANCE: "Maintenance",
    ERROR: "Needs attention",
  },
  "pt-BR": {
    ONLINE: "Online",
    OFFLINE: "Offline",
    MAINTENANCE: "Em manutenção",
    ERROR: "Requer atenção",
  },
  es: {
    ONLINE: "En línea",
    OFFLINE: "Sin conexión",
    MAINTENANCE: "En mantenimiento",
    ERROR: "Requiere atención",
  },
};

const ROOM_TYPE_LABELS: LocalizedLabels = {
  en: { STANDARD: "Standard", DELUXE: "Deluxe", SUITE: "Suite" },
  "pt-BR": { STANDARD: "Standard", DELUXE: "Deluxe", SUITE: "Suíte" },
  es: { STANDARD: "Estándar", DELUXE: "Deluxe", SUITE: "Suite" },
};

const CURRENCY_LABELS: LocalizedLabels = {
  en: { BRL: "Brazilian real", USD: "US dollar", EUR: "Euro" },
  "pt-BR": { BRL: "Real brasileiro", USD: "Dólar americano", EUR: "Euro" },
  es: { BRL: "Real brasileño", USD: "Dólar estadounidense", EUR: "Euro" },
};

const REASON_LABELS: LocalizedLabels = {
  en: {
    CHECKIN_WINDOW_NOT_OPEN: "The check-in window is not open yet.",
    RESERVATION_EXPIRED: "The reservation has expired.",
    ROOM_NOT_ASSIGNED: "A room has not been assigned yet.",
    ROOM_NOT_AVAILABLE: "The assigned room is not available.",
  },
  "pt-BR": {
    CHECKIN_WINDOW_NOT_OPEN: "A janela de check-in ainda não está aberta.",
    RESERVATION_EXPIRED: "A reserva expirou.",
    ROOM_NOT_ASSIGNED: "Um quarto ainda não foi atribuído.",
    ROOM_NOT_AVAILABLE: "O quarto atribuído não está disponível.",
  },
  es: {
    CHECKIN_WINDOW_NOT_OPEN: "La ventana de check-in aún no está abierta.",
    RESERVATION_EXPIRED: "La reserva ha vencido.",
    ROOM_NOT_ASSIGNED: "Aún no se ha asignado una habitación.",
    ROOM_NOT_AVAILABLE: "La habitación asignada no está disponible.",
  },
};

const RESERVATION_STATUS_REASON_PREFIX: Record<SupportedLanguage, string> = {
  en: "The reservation is already",
  "pt-BR": "A reserva já está com",
  es: "La reserva ya tiene el",
};

function supportedLanguage(locale: string): SupportedLanguage {
  if (locale.toLowerCase().startsWith("pt")) return "pt-BR";
  if (locale.toLowerCase().startsWith("es")) return "es";
  return "en";
}

function humanizeCode(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function localizedCode(value: string, locale: string, labels: LocalizedLabels) {
  const normalized = value.trim().toUpperCase();
  return labels[supportedLanguage(locale)][normalized] ?? humanizeCode(value);
}

export function formatReservationStatus(value: string, locale: string) {
  return localizedCode(value, locale, STATUS_LABELS);
}

export function formatRoomStatus(value: string, locale: string) {
  return localizedCode(value, locale, ROOM_STATUS_LABELS);
}

export function formatDeviceStatus(value: string, locale: string) {
  return localizedCode(value, locale, DEVICE_STATUS_LABELS);
}

export function formatRoomType(value: string, locale: string) {
  return localizedCode(value, locale, ROOM_TYPE_LABELS);
}

export function formatCurrencyLabel(value: string, locale: string) {
  const normalized = value.trim().toUpperCase();
  const label = CURRENCY_LABELS[supportedLanguage(locale)][normalized];
  return label ? `${label} (${normalized})` : humanizeCode(value);
}

export function formatEligibilityReason(value: string, locale: string) {
  const normalized = value.trim().toUpperCase();
  const language = supportedLanguage(locale);
  const directLabel = REASON_LABELS[language][normalized];

  if (directLabel) return directLabel;

  const reservationStatusPrefix = "RESERVATION_STATUS_";
  if (normalized.startsWith(reservationStatusPrefix)) {
    const status = normalized.slice(reservationStatusPrefix.length);
    return `${RESERVATION_STATUS_REASON_PREFIX[language]} ${formatReservationStatus(status, locale).toLowerCase()}.`;
  }

  return `${humanizeCode(value)}.`;
}

export function formatLocalDate(value: string, locale: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
