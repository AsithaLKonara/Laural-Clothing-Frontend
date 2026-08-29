import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { useAuthStore } from '../store/auth.store';

export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (phone: string) => {
      const response = await api.post(`/otp/send`, { phone });
      return response.data;
    }
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      const response = await api.post(`/otp/verify`, { phone, otp });
      return response.data;
    }
  });
};
