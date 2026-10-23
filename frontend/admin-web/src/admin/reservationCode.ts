export const RESERVATION_CODE_PATTERN = /^RSV-\d{4}-\d{4}$/;

export function formatReservationCodeInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (!digits) {
    return "";
  }

  if (digits.length <= 4) {
    return `RSV-${digits}`;
  }

  return `RSV-${digits.slice(0, 4)}-${digits.slice(4)}`;
}

export function isValidReservationCode(value: string) {
  return RESERVATION_CODE_PATTERN.test(value.trim());
}
