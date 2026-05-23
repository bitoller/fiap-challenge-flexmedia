import {
  AdminSession,
  AuditEvent,
  CreateReservationPayload,
  DashboardResult,
  DeviceStatus,
  HotelProfile,
  HotelSummary,
  ReservationSummary,
} from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";

class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function toApiError(error: unknown) {
  if (error instanceof ApiError) {
    return error;
  }
  return new ApiError("Network request failed.", 0, "NETWORK_ERROR");
}

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
  }).catch((error) => {
    throw toApiError(error);
  });

  if (!response.ok) {
    const raw = await response.text();
    const contentType = response.headers.get("content-type") || "";
    const looksLikeHtml = contentType.includes("text/html") || raw.trimStart().startsWith("<");

    if (response.status === 401 && path.includes("/admin/auth/login")) {
      throw new ApiError("Invalid username or password.", response.status, "INVALID_CREDENTIALS");
    }

    if (response.status === 401) {
      throw new ApiError("Unauthorized.", response.status, "UNAUTHORIZED");
    }

    if (looksLikeHtml || response.status >= 500) {
      throw new ApiError("The admin service is temporarily unavailable.", response.status, "SERVICE_UNAVAILABLE");
    }

    try {
      const parsed = JSON.parse(raw) as { message?: string; error?: string; code?: string };
      throw new ApiError(parsed.message || parsed.error || `HTTP ${response.status}`, response.status, parsed.code);
    } catch {
      throw new ApiError(raw || `HTTP ${response.status}`, response.status, "UNKNOWN_ERROR");
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const raw = await response.text();
  if (!raw.trim()) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return raw as T;
  }

  return JSON.parse(raw) as T;
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
    return request<DeviceStatus>(`/admin/devices?hotelId=${hotelId}`);
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

export function isUnauthorizedError(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}

export function isNetworkError(error: unknown) {
  return error instanceof ApiError && error.code === "NETWORK_ERROR";
}

export { ApiError };
