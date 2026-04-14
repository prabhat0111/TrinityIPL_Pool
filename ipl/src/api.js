/**
 * Centralized API helper for Trinity IPL Pool
 * ─────────────────────────────────────────────
 * - Automatically attaches the Bearer token
 * - Sends credentials: "include" so cookies travel with every request
 * - If the server returns a refreshed token, updates localStorage
 * - On 401 → clears storage and redirects to login
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Core fetch wrapper. Every API call goes through here.
 */
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Default to JSON content-type for non-form requests
  if (options.body && !(options.body instanceof URLSearchParams) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",   // Always send cookies
  });

  // ── Handle 401 (session expired / invalid) ──────────────────────────────
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Only redirect if we're not already on the login page
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
    throw new Error("Session expired");
  }

  // ── Try to capture a refreshed token from the response ──────────────────
  const data = await res.json();

  if (data.access_token) {
    localStorage.setItem("token", data.access_token);
  }

  if (!res.ok) {
    const error = new Error(data.detail || "Request failed");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}


/**
 * Verify the current session on page load.
 * Returns the user object if valid, or null (and redirects) if expired.
 */
export async function verifySession() {
  try {
    const data = await apiFetch("/verify");
    return data.user;
  } catch {
    return null;
  }
}


/**
 * Logout: hit the server to clear the cookie, then clear local state.
 */
export async function logout() {
  try {
    await apiFetch("/logout", { method: "POST" });
  } catch {
    // ignore — we're clearing client state anyway
  }
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/";
}
