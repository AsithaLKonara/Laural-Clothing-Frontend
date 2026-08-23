"use client";

import { create } from "zustand";
import authService, { UserProfile, RegisterPayload, LoginPayload, AuthResponse } from "@/services/auth.service";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: UserProfile) => void;
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

const USER_KEY = "laural_user";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user: UserProfile) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  login: async (payload: LoginPayload) => {
    set({ isLoading: true });
    try {
      const data = await authService.login(payload);
      get().setAuth(data.user);
      return data;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true });
    try {
      const data = await authService.register(payload);
      get().setAuth(data.user);
      return data;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem(USER_KEY);
      }

      set({
        user: null,
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
      const userJson = localStorage.getItem(USER_KEY);

      let cachedUser: UserProfile | null = null;
      if (userJson) {
        try {
          cachedUser = JSON.parse(userJson);
        } catch {
          // Ignore
        }
      }

      if (cachedUser) {
        set({
          user: cachedUser,
          isAuthenticated: true,
          isLoading: false,
        });
      }

      // Silently refresh profile in background using HttpOnly cookies
      try {
        const freshUser = await authService.getMe();
        if (freshUser) {
          localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
          set({ user: freshUser, isAuthenticated: true, isLoading: false });
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          try {
            const refreshed = await authService.refresh();
            get().setAuth(refreshed.user);
          } catch {
            get().logout();
          }
        }
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
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
