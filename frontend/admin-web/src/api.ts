import {
  AdminSession,
  AuditEvent,
  CreateReservationPayload,
  DashboardResult,
  HotelProfile,
  HotelSummary,
  ReservationSummary,
} from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";

function authHeaders() {
  const token = localStorage.getItem("admin-token");
  return token;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers ?? {});
  headers.set("Content-Type", "application/json");

  const token = authHeaders();
  if (token) {
    headers.set("X-Admin-Token", token);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const raw = await response.text();
    try {
      const parsed = JSON.parse(raw) as { message?: string; error?: string; code?: string };
      throw new Error(parsed.message || parsed.error || `HTTP ${response.status}`);
    } catch {
      throw new Error(raw || `HTTP ${response.status}`);
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const adminApi = {
  login(username: string, password: string) {
    return request<AdminSession>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  listHotels() {
    return request<HotelSummary[]>("/admin/hotels");
  },
  getHotel(hotelId: number) {
    return request<HotelProfile>(`/admin/hotels/${hotelId}`);
  },
  updateBranding(hotelId: number, branding: HotelProfile["branding"]) {
    return request<HotelProfile>(`/admin/hotels/${hotelId}/branding`, {
      method: "PUT",
      body: JSON.stringify(branding),
    });
  },
  updateContent(hotelId: number, content: HotelProfile["content"]) {
    return request<HotelProfile>(`/admin/hotels/${hotelId}/content`, {
      method: "PUT",
      body: JSON.stringify(content),
    });
  },
  getDashboard(hotelId: number) {
    return request<DashboardResult>(`/admin/dashboard?hotelId=${hotelId}`);
  },
  getDevices(hotelId: number) {
    return request<{ devices: Array<Record<string, unknown>> }>(`/admin/devices?hotelId=${hotelId}`);
  },
  getAudit(hotelId: number) {
    return request<AuditEvent[]>(`/admin/audit?hotelId=${hotelId}`);
  },
  listReservations(hotelId: number) {
    return request<ReservationSummary[]>(`/reservations/hotels/${hotelId}`);
  },
  createReservation(hotelId: number, payload: CreateReservationPayload) {
    return request<ReservationSummary>(`/reservations/hotels/${hotelId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  deleteReservation(hotelId: number, reservationId: number) {
    return request<void>(`/reservations/hotels/${hotelId}/${reservationId}`, {
      method: "DELETE",
    });
  },
};
