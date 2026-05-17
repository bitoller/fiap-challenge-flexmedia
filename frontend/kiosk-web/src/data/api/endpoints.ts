const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export const API_ENDPOINTS = {
  HEALTH: '/health',

  CHECKIN_SESSIONS: '/checkin-sessions',
  CHECKIN_SESSION_RESERVATION: (sessionId: number | string) =>
    `/checkin-sessions/${sessionId}/reservation`,
  CHECKIN_SESSION_GUEST_CONFIRMATION: (sessionId: number | string) =>
    `/checkin-sessions/${sessionId}/guest-confirmation`,
  CHECKIN_SESSION_CONSENTS: (sessionId: number | string) =>
    `/checkin-sessions/${sessionId}/consents`,
  COMPLETE_CHECKIN: (sessionId: number | string) =>
    `/checkin-sessions/${sessionId}/complete-checkin`,

  SEARCH_RESERVATIONS: '/reservations/search',

  CHECKOUT_LOOKUP: '/stays/lookup',
  CHECKOUT: (stayId: number | string) => `/stays/${stayId}/checkout`,

  ADMIN_HOTELS: '/admin/hotels',
  ADMIN_HOTEL_PROFILE: (hotelId: number | string) => `/admin/hotels/${hotelId}`,
  ADMIN_DASHBOARD: '/admin/dashboard',

  PUBLIC_HOTEL_PROFILE: (hotelId: number | string) => `/hotels/${hotelId}`,
} as const;

export const buildUrl = (path: string): string => {
  return `${API_BASE}${path}`;
};

export default API_ENDPOINTS;
