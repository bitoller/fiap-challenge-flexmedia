export type CheckinSearchType = "CPF" | "RESERVATION_CODE" | "QR_TOKEN";

export type CheckinMethod = "cpf" | "reservation-code" | "qr-code";

export type CheckinBottomNavKey = "home" | "assistant" | "emergency";

export type CheckinFlowStep =
  | "identification"
  | "confirmation"
  | "contact"
  | "terms"
  | "payment"
  | "success"
  | "recovery";

export type CheckinRecoveryCode =
  | "RESERVATION_NOT_FOUND"
  | "RESERVATION_NOT_ELIGIBLE"
  | "DOCUMENT_REJECTED"
  | "BIOMETRY_REJECTED"
  | "PAYMENT_DECLINED";

export type CheckinPaymentMethod = "CARD" | "PIX";

export interface GuestContactDraft {
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  email: string;
  phone: string;
}

export interface CheckinFlowError {
  code: string;
  message: string;
}
