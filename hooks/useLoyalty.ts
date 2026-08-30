import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export interface LoyaltyMember {
  customer: string;
  phone: string;
  points: string;
  tier: string;
  lastActivity: string;
}

export interface LoyaltyKpi {
  totalMembers: string;
  pointsIssued: string;
  pointsRedeemed: string;
  outstandingLiability: string;
}

const fetchLoyaltyMembers = async (params?: { search?: string; page?: number; limit?: number }): Promise<{ data: LoyaltyMember[]; meta: any }> => {
  try {
    const response = await api.get("/loyalty/members", { params });
    return response.data;
  } catch (error) {
    return { data: [], meta: {} };
  }
};

const fetchLoyaltyKpis = async (): Promise<{ data: LoyaltyKpi }> => {
  try {
    const response = await api.get("/loyalty/kpis");
    return response.data;
  } catch (error) {
    return { 
      data: { 
        totalMembers: "0", 
        pointsIssued: "0", 
        pointsRedeemed: "0", 
        outstandingLiability: "Rs. 0" 
      } 
    };
  }
};

export function useLoyaltyMembers(params?: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["loyalty-members", params],
    queryFn: () => fetchLoyaltyMembers(params),
  });
}

export function useLoyaltyKpis() {
  return useQuery({
    queryKey: ["loyalty-kpis"],
    queryFn: fetchLoyaltyKpis,
  });
}

export function useLoyaltyProfile() {
  return useQuery({
    queryKey: ["loyaltyProfile"],
    queryFn: async () => {
      const response = await api.get('/loyalty/me');
      return response.data;
    }
  });
}
