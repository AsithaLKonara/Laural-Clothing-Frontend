import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface CartState {
  isDrawerOpen: boolean;
  sessionId: string | null;
  
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  
  // Gets or initializes the session ID
  initSession: () => string;
  clearSession: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isDrawerOpen: false,
      sessionId: null,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      initSession: () => {
        const { sessionId } = get();
        if (sessionId) return sessionId;
        
        const newSessionId = uuidv4();
        set({ sessionId: newSessionId });
        return newSessionId;
      },
      
      clearSession: () => set({ sessionId: null }),
    }),
    {
      name: 'laural-cart-session',
      partialize: (state) => ({ sessionId: state.sessionId }), // Only persist sessionId
    }
  )
);
