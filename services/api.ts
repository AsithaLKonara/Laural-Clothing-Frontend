import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let csrfToken: string | null = null;
let isFetchingCsrf = false;
let csrfSubscribers: ((token: string) => void)[] = [];

function onCsrfFetched(token: string) {
  csrfSubscribers.forEach((callback) => callback(token));
  csrfSubscribers = [];
}

async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  
  if (isFetchingCsrf) {
    return new Promise<string>((resolve) => {
      csrfSubscribers.push(resolve);
    });
  }

  isFetchingCsrf = true;
  try {
    const res = await axios.get(`${api.defaults.baseURL}/auth/csrf`, { withCredentials: true });
    csrfToken = res.data?.data?.csrfToken;
    onCsrfFetched(csrfToken as string);
    return csrfToken;
  } catch (err) {
    console.error("Failed to fetch CSRF token", err);
    isFetchingCsrf = false;
    return null;
  } finally {
    isFetchingCsrf = false;
  }
}

// Request interceptor to attach CSRF token to state-changing requests
api.interceptors.request.use(
  async (config) => {
    const method = config.method?.toUpperCase();
    if (method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const token = await getCsrfToken();
      if (token) {
        config.headers['x-csrf-token'] = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Format error message to use backend's structured message/error if available
    if (error.response?.data) {
      const data = error.response.data;
      const msg = data.message || data.error || error.message;
      error.message = typeof msg === 'object' ? JSON.stringify(msg) : String(msg);
    } else if (error.request) {
      error.message = "Network error. Please check your connection.";
    }

    if (error.response?.status === 401 && typeof window !== "undefined") {
      // If 401 on an authenticated request (and not already on login)
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/admin") || currentPath.startsWith("/pos") || currentPath.startsWith("/account")) {
        // Clear stored user state
        localStorage.removeItem("laural_user");
        document.cookie = "laural_token=; path=/; max-age=0;";
        document.cookie = "laural_role=; path=/; max-age=0;";
      }
    }
    
    // If CSRF token is invalid, clear it so it gets refetched next time
    if (error.response?.status === 403 && (error.message.includes("CSRF") || error.response?.data?.error?.includes("CSRF"))) {
      csrfToken = null;
    }

    return Promise.reject(error);
  }
);

export default api;
