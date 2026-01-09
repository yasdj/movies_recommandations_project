// src/app/api/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const RECO_BASE_URL =
  process.env.NEXT_PUBLIC_RECO_URL ?? "http://localhost:8000";

type ApiErrorShape = {
  error?: unknown;
  message?: unknown;
};

function isApiErrorShape(x: unknown): x is ApiErrorShape {
  return typeof x === "object" && x !== null;
}

function extractErrorMessage(data: unknown): string {
  if (typeof data === "string") return data;

  if (isApiErrorShape(data)) {
    const err = data.error;
    const msg = data.message;

    if (typeof err === "string" && err.trim()) return err;
    if (typeof msg === "string" && msg.trim()) return msg;
  }

  return "Request failed";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";

  const data: unknown = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "");

  if (!res.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return data as T;
}

export function get<T = unknown>(path: string): Promise<T> {
  return request<T>(path, { method: "GET" });
}

export function post<T = unknown>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function patch<T = unknown>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "PATCH",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function del<T = unknown>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "DELETE",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export type LoginResponse = { id: string; username: string; email?: string };

export function login(username: string, password: string) {
  return post<LoginResponse>("/api/user/login", { username, password });
}

export function logout() {
  return post<{ message: string }>("/api/user/logout");
}

export async function getRecommendation<T>(
  url: string,
  data: unknown,
  config: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${RECO_BASE_URL}${url}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(config.headers || {}),
    },
    body: JSON.stringify(data),
    ...config,
  });

  const contentType = res.headers.get("content-type") || "";

  const responseData: unknown = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "");

  if (!res.ok) {
    throw new Error(extractErrorMessage(responseData));
  }

  return responseData as T;
}
