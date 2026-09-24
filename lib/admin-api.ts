const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export function adminToken() { return typeof window === "undefined" ? null : localStorage.getItem("moventra-admin-token"); }
export async function adminApi<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = adminToken();
  const response = await fetch(`${API}/admin${path}`, { ...options, cache: "no-store", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
  const body = await response.json().catch(() => ({}));
  if ((response.status === 401 || response.status === 403) && typeof window !== "undefined" && !path.startsWith("/login")) { localStorage.removeItem("moventra-admin-token"); window.location.assign("/admin/login"); }
  if (!response.ok) throw new Error(body.message || "The request could not be completed.");
  return body;
}
