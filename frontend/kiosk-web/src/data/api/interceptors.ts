import { CheckinAddOnOffer, CheckinAddOnQuote, CompleteCheckinResponse, CheckoutCharge, CheckoutResponse, CheckoutStayPreview, Guest, IdentityVerificationResponse, Reservation, Room, Session, SessionReservation } from "../../domain/models";
import { KIOSK_CONFIG } from "../../core/constants";

export const checkoutResponseInterceptor = (data: any): CheckoutResponse => {
  return {
    stayId: data.stayId,
    status: data.status,
    totalPaid: data.totalPaid,
    receiptCode: data.receiptCode,
  };
};

export const checkoutLookupResponseInterceptor = (data: any): CheckoutStayPreview => {
  return {
    stayId: data.stayId,
    stayStatus: data.stayStatus,
    totalDue: data.totalDue ?? data.reservation?.totalAmount ?? 0,
    reservation: reservationResponseInterceptor(data.reservation),
    charges: Array.isArray(data.charges)
      ? data.charges.map((charge: any) => checkoutChargeResponseInterceptor(charge))
      : [],
  };
};

export const completeCheckinResponseInterceptor = (data: any): CompleteCheckinResponse => {
  return {
    sessionId: data.sessionId,
    status: data.status,
    stayId: data.stayId,
    roomNumber: data.roomNumber,
    totalPaid: data.totalPaid,
    key: {
      keyId: data.key?.keyId,
      type: data.key?.type,
      status: data.key?.status,
      value: data.key?.value,
      expiresAt: data.key?.expiresAt,
    },
  };
};

export const sessionResponseInterceptor = (data: any): Session => {
  return {
    sessionId: data.sessionId,
    status: data.status,
    expiresAt: data.expiresAt,
    correlationId: data.correlationId,
  };
};

export const sessionReservationResponseInterceptor = (data: any): SessionReservation => {
  return {
    ...sessionResponseInterceptor(data),
    reservation: data.reservation,
  };
};

export const identityVerificationResponseInterceptor = (data: any): IdentityVerificationResponse => {
  return {
    sessionId: data.sessionId,
    status: data.status,
    documentStatus: data.documentStatus ?? null,
    biometryStatus: data.biometryStatus ?? null,
    provider: data.provider ?? null,
    score: data.score ?? null,
    canContinue: Boolean(data.canContinue),
    fallbackUsed: Boolean(data.fallbackUsed),
    message: data.message ?? null,
  };
};

export const checkinAddOnQuoteResponseInterceptor = (data: any): CheckinAddOnQuote => {
  return {
    sessionId: data.sessionId,
    reservation: reservationResponseInterceptor(data.reservation),
    offers: Array.isArray(data.offers)
      ? data.offers.map((offer: any) => checkinAddOnOfferResponseInterceptor(offer))
      : [],
    selectedCodes: Array.isArray(data.selectedCodes) ? data.selectedCodes : [],
    baseAmount: data.baseAmount ?? 0,
    addOnsTotal: data.addOnsTotal ?? 0,
    totalAmount: data.totalAmount ?? data.reservation?.totalAmount ?? 0,
    currency: data.currency ?? data.reservation?.currency ?? "BRL",
  };
};

const checkoutChargeResponseInterceptor = (data: any): CheckoutCharge => {
  return {
    code: data.code,
    description: data.description,
    amount: data.amount,
  };
};

const checkinAddOnOfferResponseInterceptor = (data: any): CheckinAddOnOffer => {
  return {
    code: data.code,
    pricingType: data.pricingType,
    unitAmount: data.unitAmount ?? 0,
    quantity: data.quantity ?? 1,
    totalAmount: data.totalAmount ?? 0,
    currency: data.currency ?? "BRL",
    selected: Boolean(data.selected),
  };
};

const reservationResponseInterceptor = (data: any): Reservation => {
  return {
    id: data.id,
    hotelId: data.hotelId,
    code: data.code,
    status: data.status,
    hotelName: data.hotelName,
    arrivalDate: data.arrivalDate,
    departureDate: data.departureDate,
    totalAmount: data.totalAmount,
    currency: data.currency,
    eligible: data.eligible,
    eligibilityReasons: Array.isArray(data.eligibilityReasons) ? data.eligibilityReasons : [],
    guest: guestResponseInterceptor(data.guest),
    room: roomResponseInterceptor(data.room),
  };
};

const guestResponseInterceptor = (data: any): Guest => {
  return {
    id: data.id,
    fullName: data.fullName,
    documentType: data.documentType,
    maskedDocument: data.maskedDocument,
    birthDate: data.birthDate,
    email: data.email,
    phone: data.phone,
  };
};

const roomResponseInterceptor = (data: any): Room => {
  return {
    id: data.id,
    number: data.number,
    type: data.type,
    status: data.status,
  };
};

export const createSessionRequestInterceptor = (flowType: 'CHECKIN' | 'CHECKOUT', language: string = 'en') => {
  return {
    kioskId: KIOSK_CONFIG.KIOSK_ID,
    flowType,
    language,
  };
};

export const attachReservationRequestInterceptor = (
  searchType: string,
  searchValue: string
) => {
  return {
    searchType,
    searchValue,
  };
};

export const identityImageRequestInterceptor = (
  imageBase64: string,
  mimeType: string
) => {
  return {
    imageBase64,
    mimeType,
  };
};

export const identityConfirmationRequestInterceptor = (
  termsAccepted: boolean,
  biometricConsentAccepted: boolean
) => {
  return {
    termsAccepted,
    biometricConsentAccepted,
  };
};

export const addOnSelectionRequestInterceptor = (selectedCodes: string[]) => {
  return {
    selectedCodes,
  };
};

export const completeCheckinRequestInterceptor = (
  paymentMethod: string,
  biometricsAccepted: boolean,
  documentStatus: string = 'APPROVED',
  biometryStatus?: string | null
) => {
  return {
    paymentMethod,
    keyType: 'DIGITAL',
    documentStatus,
    biometryStatus: biometryStatus ?? (biometricsAccepted ? 'APPROVED' : 'SKIPPED'),
  };
};
