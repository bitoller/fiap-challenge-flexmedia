export type CheckinSearchType = "CPF" | "RESERVATION_CODE";

export type CheckinMethod = "cpf" | "reservation-code" | "qr-code" | "card";

export type CheckinBottomNavKey = "home" | "assistant" | "emergency";

export interface CheckinFlowError {
  code: string;
  message: string;
}
