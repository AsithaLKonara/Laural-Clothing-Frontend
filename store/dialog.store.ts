import { create } from 'zustand';

export type DialogType = 'alert' | 'confirm';

interface GlobalDialogState {
  isOpen: boolean;
  type: DialogType;
  title: string;
  message: string;
  resolvePromise: ((value: boolean) => void) | null;
  open: (options: { type: DialogType; title: string; message: string }) => Promise<boolean>;
  close: (result: boolean) => void;
}

export const useGlobalDialog = create<GlobalDialogState>((set, get) => ({
  isOpen: false,
  type: 'alert',
  title: '',
  message: '',
  resolvePromise: null,
  
  open: ({ type, title, message }) => {
    return new Promise((resolve) => {
      set({ isOpen: true, type, title, message, resolvePromise: resolve });
    });
  },
  
  close: (result: boolean) => {
    const { resolvePromise } = get();
    if (resolvePromise) resolvePromise(result);
    set({ isOpen: false, resolvePromise: null });
  },
}));

export const globalDialog = {
  alert: (message: string, title: string = "Notice") => 
    useGlobalDialog.getState().open({ type: 'alert', title, message }),
    
  confirm: (message: string, title: string = "Please Confirm") => 
    useGlobalDialog.getState().open({ type: 'confirm', title, message }),
};
