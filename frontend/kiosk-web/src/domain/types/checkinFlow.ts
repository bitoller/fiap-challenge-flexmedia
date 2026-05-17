export type CheckinSearchType = "CPF" | "RESERVATION_CODE" | "QR_TOKEN";

export type CheckinMethod = "cpf" | "reservation-code" | "qr-code";

export type CheckinBottomNavKey = "home" | "assistant" | "emergency";

export type CheckinFlowStep =
  | "identification"
  | "confirmation"
  | "identity-verification"
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

export interface CheckinFlowError {
  code: string;
  message: string;
}
