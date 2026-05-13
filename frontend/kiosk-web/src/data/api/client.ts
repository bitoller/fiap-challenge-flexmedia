import { ApiError, TimeoutError } from "../../domain/errors";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestConfig extends Omit<RequestInit, "body"> {
  body?: unknown;
  timeout?: number;
}

const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT_MS ?? "10000");
const CORRELATION_STORAGE_KEY = "kiosk-correlation-id";

function createCorrelationId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getCorrelationId(): string {
  try {
    const stored = sessionStorage.getItem(CORRELATION_STORAGE_KEY);
    if (stored) {
      return stored;
    }

    const generated = createCorrelationId();
    sessionStorage.setItem(CORRELATION_STORAGE_KEY, generated);
    return generated;
  } catch {
    return createCorrelationId();
  }
}

function serializeBody(body: unknown): BodyInit | undefined {
  if (body == null) {
    return undefined;
  }

  if (
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer
  ) {
    return body;
  }

  return JSON.stringify(body);
}

function toHeaders(headers: HeadersInit | undefined): Headers {
  const normalized = new Headers(headers ?? {});

  if (!normalized.has("Content-Type")) {
    normalized.set("Content-Type", "application/json");
  }

  normalized.set("X-Correlation-Id", getCorrelationId());
  return normalized;
}

async function parseErrorResponse(response: Response): Promise<never> {
  let errorBody: { code?: string; message?: string; details?: Record<string, unknown> } | null = null;

  try {
    errorBody = await response.json();
  } catch {
    errorBody = null;
  }

  throw new ApiError(
    errorBody?.code ?? `HTTP_${response.status}`,
    errorBody?.message ?? (response.statusText || "Nao foi possivel concluir a operacao."),
    errorBody?.details
  );
}

export async function apiRequest<T>(url: string, config: ApiRequestConfig = {}): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, headers, body, ...requestInit } = config;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...requestInit,
      body: serializeBody(body),
      headers: toHeaders(headers),
      signal: controller.signal,
    });

    if (!response.ok) {
      await parseErrorResponse(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    return (await response.text()) as T;
  } catch (error) {
    if (error instanceof TimeoutError) {
      throw error;
    }

    if (controller.signal.aborted || (error instanceof DOMException && error.name === "AbortError")) {
      throw new TimeoutError(`Request timeout after ${timeout}ms`, timeout);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      "NETWORK_ERROR",
      error instanceof Error ? error.message : "Nao foi possivel concluir a operacao."
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export const apiGet = <T,>(url: string, config?: ApiRequestConfig): Promise<T> =>
  apiRequest<T>(url, { ...config, method: "GET" });

export const apiPost = <T,>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<T> =>
  apiRequest<T>(url, { ...config, method: "POST", body });

export const apiPut = <T,>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<T> =>
  apiRequest<T>(url, { ...config, method: "PUT", body });

export const apiPatch = <T,>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<T> =>
  apiRequest<T>(url, { ...config, method: "PATCH", body });

export const apiDelete = <T,>(url: string, config?: ApiRequestConfig): Promise<T> =>
  apiRequest<T>(url, { ...config, method: "DELETE" });

export type { HttpMethod };
