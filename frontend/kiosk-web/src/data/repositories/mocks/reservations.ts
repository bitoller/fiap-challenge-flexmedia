import { Reservation, Guest, Room } from "../../../domain/models";

// Scenario 1: Successful check-in
export const MOCK_RESERVATION_SUCCESS: Reservation = {
  id: 1,
  code: 'RSV-2026-0001',
  status: 'CONFIRMED',
  hotelName: 'LUXE GRAND HOTEL',
  arrivalDate: '2026-05-12',
  departureDate: '2026-05-15',
  totalAmount: 2400.00,
  currency: 'BRL',
  eligible: true,
  eligibilityReasons: [],
  guest: {
    id: 1,
    fullName: 'John Smith',
    documentType: 'PASSPORT',
    maskedDocument: '****1234',
    birthDate: '1990-05-15',
    email: 'john.smith@example.com',
    phone: '+1-555-0123',
  },
  room: {
    id: 101,
    number: '501',
    type: 'Suite Deluxe',
    status: 'READY',
  },
};

// Scenario 2: Reservation not found
export const MOCK_RESERVATION_NOT_FOUND = {
  error: true,
  code: 'RESERVATION_NOT_FOUND',
  message: 'The reservation code was not found in the system',
};

// Scenario 3: Invalid document
export const MOCK_RESERVATION_INVALID_DOCUMENT: Reservation = {
  ...MOCK_RESERVATION_SUCCESS,
  id: 3,
  code: 'RSV-2026-0003',
  eligible: false,
  eligibilityReasons: ['INVALID_DOCUMENT_TYPE', 'DOCUMENT_MISMATCH'],
  guest: {
    ...MOCK_RESERVATION_SUCCESS.guest,
    documentType: 'INVALID_TYPE',
  },
};

// Scenario 4: Payment declined
export const MOCK_PAYMENT_DECLINED = {
  error: true,
  code: 'PAYMENT_DECLINED',
  message: 'Payment method was declined. Please try another payment method.',
  retryable: true,
};

// Scenario 5: Multiple reservations for search list
export const MOCK_RESERVATIONS_LIST: Reservation[] = [
  MOCK_RESERVATION_SUCCESS,
  {
    ...MOCK_RESERVATION_SUCCESS,
    id: 2,
    code: 'RSV-2026-0002',
    guest: {
      ...MOCK_RESERVATION_SUCCESS.guest,
      fullName: 'Maria Silva',
      email: 'maria.silva@example.com',
    },
    room: {
      ...MOCK_RESERVATION_SUCCESS.room,
      number: '302',
      type: 'Standard Room',
    },
    totalAmount: 1200.00,
    departureDate: '2026-05-14',
  },
  {
    ...MOCK_RESERVATION_SUCCESS,
    id: 4,
    code: 'RSV-2026-0004',
    guest: {
      ...MOCK_RESERVATION_SUCCESS.guest,
      fullName: 'Carlos Rodriguez',
      documentType: 'PASSPORT',
      maskedDocument: '****5678',
      email: 'carlos.rodriguez@example.com',
      birthDate: '1985-10-22',
    },
    room: {
      ...MOCK_RESERVATION_SUCCESS.room,
      number: '405',
      type: 'Suite Premium',
    },
    totalAmount: 3500.00,
    departureDate: '2026-05-20',
  },
];

// Session mock
export const MOCK_SESSION = {
  sessionId: 12345,
  status: 'ACTIVE',
  expiresAt: new Date(Date.now() + 15 * 60000).toISOString(),
  correlationId: 'mock-correlation-id-12345',
};

// Complete checkin response mock
export const MOCK_COMPLETE_CHECKIN_RESPONSE = {
  sessionId: 12345,
  status: 'COMPLETED',
  stayId: 98765,
  roomNumber: '501',
  totalPaid: 2400.00,
  key: {
    keyId: 54321,
    type: 'DIGITAL',
    status: 'ACTIVE',
    value: 'KEY_ABC123DEF456',
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60000).toISOString(),
  },
};

// Checkout response mock
export const MOCK_CHECKOUT_RESPONSE = {
  stayId: 98765,
  status: 'COMPLETED',
  totalPaid: 2400.00,
  receiptCode: 'RCP-2026-0001',
};
