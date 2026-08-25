import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (Optional - keeping if needed later, currently passthrough)
api.interceptors.request.use(
  (config) => {
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
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // If 401 on an authenticated request (and not already on login)
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/admin") || currentPath.startsWith("/pos") || currentPath.startsWith("/account")) {
        // Clear stored user state
        localStorage.removeItem("laural_user");
        document.cookie = "laural_token=; path=/; max-age=0;";
        document.cookie = "laural_role=; path=/; max-age=0;";
        
        // Optional redirect if session completely invalid
        // window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
