import { CompleteCheckinResponse, CheckoutCharge, CheckoutResponse, CheckoutStayPreview, Guest, Reservation, Room, Session, SessionReservation } from "../../domain/models";

/**
 * API Response Interceptors
 * Transform API responses to domain models
 */

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

const checkoutChargeResponseInterceptor = (data: any): CheckoutCharge => {
  return {
    code: data.code,
    description: data.description,
    amount: data.amount,
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

/**
 * Request Interceptors
 * Transform domain models to API requests
 */

export const createSessionRequestInterceptor = (flowType: 'CHECKIN' | 'CHECKOUT', language: string = 'en') => {
  return {
    kioskId: 1,
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

export const guestConfirmationRequestInterceptor = (
  guestId: number,
  fullName: string,
  documentType: string,
  documentNumber: string,
  birthDate: string,
  email: string,
  phone: string
) => {
  return {
    guestId,
    fullName,
    documentType,
    documentNumber,
    birthDate,
    email,
    phone,
  };
};

export const registrationConsentRequestInterceptor = (
  biometricsAccepted: boolean
) => {
  return {
    items: [
      { type: 'PRIVACY_POLICY', accepted: true, version: '2026.05' },
      { type: 'HOSTING_TERMS', accepted: true, version: '2026.05' },
      { type: 'BIOMETRY', accepted: biometricsAccepted, version: '2026.05' },
    ],
  };
};

export const completeCheckinRequestInterceptor = (
  paymentMethod: string,
  biometricsAccepted: boolean
) => {
  return {
    paymentMethod,
    keyType: 'DIGITAL',
    documentStatus: 'APPROVED',
    biometryStatus: biometricsAccepted ? 'APPROVED' : 'SKIPPED',
  };
};
