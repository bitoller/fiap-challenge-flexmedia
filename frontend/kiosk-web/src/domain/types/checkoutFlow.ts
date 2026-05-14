export type CheckoutFlowStep =
  | "identification"
  | "summary"
  | "reconciliation"
  | "payment"
  | "card"
  | "receipt"
  | "success"
  | "recovery";

export type CheckoutRecoveryCode =
  | "STAY_NOT_FOUND"
  | "STAY_ALREADY_CHECKED_OUT"
  | "PAYMENT_DECLINED"
  | "CHECKOUT_LOOKUP_FAILED";

export type CheckoutPaymentMethod = "CARD" | "PIX";

export interface CheckoutIdentificationDraft {
  roomNumber: string;
  documentNumber: string;
}
