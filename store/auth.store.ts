"use client";

import { create } from "zustand";
import authService, { UserProfile, RegisterPayload, LoginPayload, AuthResponse } from "@/services/auth.service";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: UserProfile, token: string, refreshToken: string) => void;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;

  // RBAC Helpers
  hasPermission: (permissionCode: string) => boolean;
  hasRole: (roleName: string) => boolean;
  isAdmin: () => boolean;
  isPublicUser: () => boolean;
}

const TOKEN_KEY = "laural_access_token";
const REFRESH_TOKEN_KEY = "laural_refresh_token";
const USER_KEY = "laural_user";

function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user: UserProfile, token: string, refreshToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      // Set cookie for middleware route protection
      setCookie("laural_token", token, 7);
      const primaryRole = user.roles?.[0] || "PUBLIC_USER";
      setCookie("laural_role", primaryRole, 7);
    }

    set({
      user,
      token,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  login: async (payload: LoginPayload) => {
    set({ isLoading: true });
    try {
      const data = await authService.login(payload);
      get().setAuth(data.user, data.accessToken, data.refreshToken);
      return data;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true });
    try {
      const data = await authService.register(payload);
      get().setAuth(data.user, data.accessToken, data.refreshToken);
      return data;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    const rfToken = get().refreshToken || (typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null);
    try {
      if (rfToken) {
        await authService.logout(rfToken);
      }
    } catch {
      // Ignore
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        deleteCookie("laural_token");
        deleteCookie("laural_role");
      }

      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  initAuth: async () => {
    if (typeof window === "undefined") {
      set({ isLoading: false });
      return;
    }

    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const rfToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const userJson = localStorage.getItem(USER_KEY);

      if (!token) {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }

      let cachedUser: UserProfile | null = null;
      if (userJson) {
        try {
          cachedUser = JSON.parse(userJson);
        } catch {
          // Ignore
        }
      }

      set({
        token,
        refreshToken: rfToken,
        user: cachedUser,
        isAuthenticated: true,
        isLoading: false,
      });

      // Silently refresh profile in background
      try {
        const freshUser = await authService.getMe();
        if (freshUser) {
          localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
          const primaryRole = freshUser.roles?.[0] || "PUBLIC_USER";
          setCookie("laural_role", primaryRole, 7);
          set({ user: freshUser });
        }
      } catch (err: any) {
        if (err.response?.status === 401 && rfToken) {
          try {
            const refreshed = await authService.refresh(rfToken);
            get().setAuth(refreshed.user, refreshed.accessToken, rfToken);
          } catch {
            get().logout();
          }
        }
      }
    } catch {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  hasPermission: (permissionCode: string) => {
    const { user } = get();
    if (!user) return false;

    // Super Admin has all permissions
    const isSuper = user.roles?.some(
      (r) => r.toUpperCase() === "SUPER_ADMIN" || r.toLowerCase() === "super admin"
    );
    if (isSuper) return true;

    return user.permissions?.includes(permissionCode) ?? false;
  },

  hasRole: (roleName: string) => {
    const { user } = get();
    if (!user || !user.roles) return false;

    return user.roles.some((r) => r.toLowerCase() === roleName.toLowerCase());
  },

  isAdmin: () => {
    const { user } = get();
    if (!user || !user.roles) return false;

    const nonAdminRoles = new Set(["PUBLIC_USER", "public user", "CUSTOMER", "customer"]);
    return user.roles.some((r) => !nonAdminRoles.has(r));
  },

  isPublicUser: () => {
    const { user } = get();
    if (!user || !user.roles) return true;
    return user.roles.length === 1 && (user.roles[0] === "PUBLIC_USER" || user.roles[0] === "Public User");
  },
}));
