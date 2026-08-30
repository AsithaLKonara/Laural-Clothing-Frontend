import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to read a cookie value by name (browser-only)
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : undefined;
}

const STATE_MUTATING_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

// Request interceptor: attach CSRF token to all state-changing requests
api.interceptors.request.use(
  (config) => {
    const method = (config.method || "").toUpperCase();

    if (STATE_MUTATING_METHODS.includes(method)) {
      const csrfToken = getCookie("laural_csrf");
      if (csrfToken) {
        config.headers["x-csrf-token"] = csrfToken;
      }
      // Note: if no CSRF cookie yet, CsrfInitializer in providers.tsx
      // will have already triggered the GET /auth/csrf to set it.
      // On the very first request before that completes, it may be absent —
      // the response interceptor handles the retry below.
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle 401s and CSRF retry on 403
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // CSRF token missing/stale — fetch a fresh one and retry ONCE
    if (
      error.response?.status === 403 &&
      error.response?.data?.error?.includes("CSRF") &&
      !originalRequest._csrfRetry
    ) {
      originalRequest._csrfRetry = true;
      try {
        // This GET will cause the backend to set a fresh laural_csrf cookie
        await api.get("/auth/csrf");
        // Re-attach the new token and retry
        const freshToken = getCookie("laural_csrf");
        if (freshToken) {
          originalRequest.headers["x-csrf-token"] = freshToken;
        }
        return api(originalRequest);
      } catch {
        // If CSRF fetch also fails, fall through to normal error handling
      }
    }

    // 401 — session expired or token invalid
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const isProtectedRoute =
        currentPath.startsWith("/admin") ||
        currentPath.startsWith("/pos") ||
        currentPath.startsWith("/branch-admin") ||
        currentPath.startsWith("/account");

      if (isProtectedRoute) {
        // Clear all stored auth state
        try { localStorage.removeItem("laural_user"); } catch { /* noop */ }
        // Clear legacy cookies if any
        document.cookie = "laural_token=; path=/; max-age=0; SameSite=Lax";
        document.cookie = "laural_role=; path=/; max-age=0; SameSite=Lax";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

