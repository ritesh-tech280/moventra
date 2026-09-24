import type {
  DriverApiResponse,
  DriverAvailabilityResponse,
  DriverDashboardData,
  DriverProfile,
} from "@/types/driver";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const DRIVER_TOKEN_KEY = "moventra_driver_token";

export class DriverApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "DriverApiError";
    this.status = status;
  }
}

async function request<T>(token: string, path: string, init: RequestInit = {}) {
  let response: Response;
  try {
    response = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...init.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new DriverApiError("We couldn't reach the service. Check your connection and try again.", 0);
  }

  const body = (await response.json().catch(() => ({}))) as DriverApiResponse<T>;
  if (!response.ok) {
    throw new DriverApiError(body.message || "Something went wrong. Please try again.", response.status);
  }
  return body;
}

export async function getDriverDashboard(token: string): Promise<DriverDashboardData> {
  const result = await request<DriverDashboardData>(token, "/drivers/me");
  if (!result.driver) throw new DriverApiError("We couldn't load your driver profile.", 500);
  return {
    driver: result.driver,
    vehicle: result.vehicle ?? null,
    documents: result.documents ?? [],
  };
}

export async function updateDriverAvailability(
  token: string,
  online: boolean,
): Promise<DriverApiResponse<DriverAvailabilityResponse>> {
  return request<DriverAvailabilityResponse>(token, "/drivers/me/status", {
    method: "PATCH",
    body: JSON.stringify({ availability: online ? "online" : "offline" }),
  });
}

export async function driverLogin(email: string, password: string) {
  let response: Response;
  try {
    response = await fetch(`${API}/drivers/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    throw new DriverApiError("We couldn't reach the service. Check your connection and try again.", 0);
  }
  const result = (await response.json().catch(() => ({}))) as DriverApiResponse<never>;
  if (!response.ok || !result.token || !result.driver) {
    throw new DriverApiError(result.message || "Unable to sign in. Please check your details.", response.status);
  }
  return { token: result.token, driver: result.driver as DriverProfile };
}
