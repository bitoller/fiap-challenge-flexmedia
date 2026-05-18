export interface Guest {
  id: number;
  fullName: string;
  documentType: string;
  maskedDocument: string;
  birthDate: string;
  email: string;
  phone: string;
}

export interface Room {
  id: number;
  number: string;
  type: string;
  status: string;
}

export interface Reservation {
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
  guest: Guest;
  room: Room;
}

export interface Session {
  sessionId: number;
  status: string;
  expiresAt: string;
  correlationId: string;
}

export interface SessionReservation extends Session {
  reservation: Reservation;
}

export interface CompleteCheckinResponse {
  sessionId: number;
  status: string;
  stayId: number;
  roomNumber: string;
  totalPaid: number;
  key: {
    keyId: number;
    type: string;
    status: string;
    value: string;
    expiresAt: string;
  };
}

export interface CheckoutResponse {
  stayId: number;
  status: string;
  totalPaid: number;
  receiptCode: string;
}

export type IdentityVerificationStatus =
  | "DOCUMENT_APPROVED"
  | "DOCUMENT_REJECTED"
  | "FACE_APPROVED"
  | "FACE_REJECTED"
  | "DOCUMENT_ONLY_APPROVED"
  | "PROVIDER_UNAVAILABLE"
  | "IDENTITY_CONFIRMED";

export interface IdentityVerificationResponse {
  sessionId: number;
  status: IdentityVerificationStatus;
  documentStatus: string | null;
  biometryStatus: string | null;
  provider: string | null;
  score: number | null;
  canContinue: boolean;
  fallbackUsed: boolean;
  message: string | null;
}

export interface CheckoutCharge {
  code: string;
  description: string;
  amount: number;
}

export interface CheckoutStayPreview {
  stayId: number;
  stayStatus: string;
  totalDue: number;
  reservation: Reservation;
  charges: CheckoutCharge[];
}

export interface CheckinAddOnOffer {
  code: string;
  pricingType: string;
  unitAmount: number;
  quantity: number;
  totalAmount: number;
  currency: string;
  selected: boolean;
}

export interface CheckinAddOnQuote {
  sessionId: number;
  reservation: Reservation;
  offers: CheckinAddOnOffer[];
  selectedCodes: string[];
  baseAmount: number;
  addOnsTotal: number;
  totalAmount: number;
  currency: string;
}

export * from "./hotel";
