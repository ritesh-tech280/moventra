const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function riderApi<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window === "undefined" ? null : localStorage.getItem("moventra_token");
  const response = await fetch(`${API}/rider${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "The request could not be completed.");
  return body;
}
