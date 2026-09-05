import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: ToastMessage[];
  show: (message: string, type?: ToastType, duration?: number) => string;
  update: (id: string, message: string, type?: ToastType) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }, duration);
    }
    return id;
  },
  update: (id, message, type) => {
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, message, type: type || t.type } : t))
    }));
  },
  remove: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));

export const toast = {
  success: (message: string, duration?: number) => useToastStore.getState().show(message, 'success', duration),
  error: (message: string, duration?: number) => useToastStore.getState().show(message, 'error', duration),
  info: (message: string, duration?: number) => useToastStore.getState().show(message, 'info', duration),
  warning: (message: string, duration?: number) => useToastStore.getState().show(message, 'warning', duration),
  loading: (message: string) => useToastStore.getState().show(message, 'info', 0), // 0 means it won't auto-dismiss
  update: (id: string, message: string, type?: ToastType) => useToastStore.getState().update(id, message, type),
  dismiss: (id: string) => useToastStore.getState().remove(id),
};
