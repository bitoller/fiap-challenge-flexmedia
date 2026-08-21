export interface HotelSummary {
  id: number;
  name: string;
  ownerName: string;
  active: boolean;
}

export interface AdminSession {
  token: string;
  adminName: string;
  role: string;
  hotels: HotelSummary[];
}

export interface HotelBranding {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
  logoUrl: string;
  activePresetId: string;
  presets: BrandingPreset[];
}

export interface BrandingPreset {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
}

export interface HotelContent {
  languageDefault: string;
  supportedLanguages: string[];
  promotions: Array<{ title: string; description: string; active: boolean; order: number }>;
  amenities: string[];
  mapUrl: string;
  supportMessage: string;
}

export interface HotelProfile extends HotelSummary {
  timezone: string;
  checkinTime: string;
  checkoutTime: string;
  earlyCheckinMinutes: number;
  lateCheckoutMinutes: number;
  branding: HotelBranding;
  content: HotelContent;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardResult {
  hotelId: number | null;
  reservationsToday: number;
  activeStays: number;
  completedCheckins: number;
  completedCheckouts: number;
  failedSessions: number;
  deviceStatus: DeviceStatus;
  recentSessions: Array<Record<string, unknown>>;
}

export interface DeviceStatus {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  maintenanceDevices: number;
  errorDevices: number;
  devices: KioskDevice[];
}

export interface AuditEvent {
  hotelId: number | null;
  actorType: string;
  actorId: string | null;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  result: string;
  correlationId: string | null;
  createdAt?: string | null;
}

export interface KioskDevice {
  id: number;
  hotelId: number;
  deviceCode: string;
  name: string;
  status: string;
  batteryLevel: number | null;
  cameraOnline: boolean;
  printerOnline: boolean;
  lastSeenAt: string;
}

export interface ReservationSummary {
  id: number;
  hotelId: number;
  code: string;
  status: string;
  hotelName: string;
  arrivalDate: string;
  departureDate: string;
  totalAmount: number;
  currency: string;
  eligible: boolean;
  eligibilityReasons: string[];
  guest: {
    id: number;
    fullName: string;
    documentType: string;
    maskedDocument: string;
    birthDate: string;
    email: string;
    phone: string;
  };
  room: {
    id: number;
    number: string;
    type: string;
    status: string;
  };
}

export interface CreateReservationPayload {
  hotelName: string;
  roomNumber: string;
  roomType: string;
  reservationCode?: string;
  arrivalDate: string;
  departureDate: string;
  adults: number;
  children: number;
  totalAmount: number;
  currency: string;
  guestFullName: string;
  guestDocumentType: string;
  guestDocumentNumber: string;
  guestBirthDate?: string;
  guestNationality?: string;
  guestEmail?: string;
  guestPhone?: string;
}
