import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (phone: string) => {
      const response = await axios.post(`${API_URL}/otp/send`, { phone });
      return response.data;
    }
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      const response = await axios.post(`${API_URL}/otp/verify`, { phone, otp });
      return response.data;
    }
  });
};
