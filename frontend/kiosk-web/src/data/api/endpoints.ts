const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export const API_ENDPOINTS = {
  HEALTH: '/health',

  CHECKIN_SESSIONS: '/checkin-sessions',
  CHECKIN_SESSION_RESERVATION: (sessionId: number | string) =>
    `/checkin-sessions/${sessionId}/reservation`,
  CHECKIN_SESSION_IDENTITY_DOCUMENT: (sessionId: number | string) =>
    `/checkin-sessions/${sessionId}/identity/document`,
  CHECKIN_SESSION_IDENTITY_SELFIE: (sessionId: number | string) =>
    `/checkin-sessions/${sessionId}/identity/selfie`,
  CHECKIN_SESSION_IDENTITY_CONFIRM: (sessionId: number | string) =>
    `/checkin-sessions/${sessionId}/identity/confirm`,
  CHECKIN_SESSION_ADD_ONS: (sessionId: number | string) =>
    `/checkin-sessions/${sessionId}/add-ons`,
  COMPLETE_CHECKIN: (sessionId: number | string) =>
    `/checkin-sessions/${sessionId}/complete-checkin`,

  SEARCH_RESERVATIONS: '/reservations/search',

  CHECKOUT_LOOKUP: '/stays/lookup',
  CHECKOUT: (stayId: number | string) => `/stays/${stayId}/checkout`,

  ADMIN_HOTELS: '/admin/hotels',
  ADMIN_HOTEL_PROFILE: (hotelId: number | string) => `/admin/hotels/${hotelId}`,
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_AUDIT_EVENTS: '/admin/audit-events',

  PUBLIC_HOTEL_PROFILE: (hotelId: number | string) => `/hotels/${hotelId}`,
} as const;

export const buildUrl = (path: string): string => {
  return `${API_BASE}${path}`;
};

export default API_ENDPOINTS;
