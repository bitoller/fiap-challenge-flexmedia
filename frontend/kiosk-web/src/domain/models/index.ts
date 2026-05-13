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

export * from "./hotel";
