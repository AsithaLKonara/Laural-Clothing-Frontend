import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/report.service';

export const REPORT_KEYS = {
  all: ['reports'] as const,
  sales: (start?: string, end?: string) => ['reports', 'sales', start?.split('T')[0], end?.split('T')[0]] as const,
  branches: (start?: string, end?: string) => ['reports', 'branches', start?.split('T')[0], end?.split('T')[0]] as const,
  payments: (start?: string, end?: string) => ['reports', 'payments', start?.split('T')[0], end?.split('T')[0]] as const,
  inventory: ['reports', 'inventory'] as const,
  customers: (start?: string, end?: string) => ['reports', 'customers', start?.split('T')[0], end?.split('T')[0]] as const,
  pos: (start?: string, end?: string) => ['reports', 'pos', start?.split('T')[0], end?.split('T')[0]] as const,
  promotions: (start?: string, end?: string) => ['reports', 'promotions', start?.split('T')[0], end?.split('T')[0]] as const,
};

export function useSalesReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: REPORT_KEYS.sales(startDate, endDate),
    queryFn: () => reportService.getSalesReport(startDate, endDate),
    staleTime: 15000,
  });
}

export function useBranchReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: REPORT_KEYS.branches(startDate, endDate),
    queryFn: () => reportService.getBranchReport(startDate, endDate),
    staleTime: 15000,
  });
}

export function usePaymentReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: REPORT_KEYS.payments(startDate, endDate),
    queryFn: () => reportService.getPaymentReport(startDate, endDate),
    staleTime: 15000,
  });
}

export function useInventoryValuationReport() {
  return useQuery({
    queryKey: REPORT_KEYS.inventory,
    queryFn: () => reportService.getInventoryValuationReport(),
    staleTime: 15000,
  });
}

export function useCustomerReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: REPORT_KEYS.customers(startDate, endDate),
    queryFn: () => reportService.getCustomerReport(startDate, endDate),
    staleTime: 15000,
  });
}

export function usePosReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: REPORT_KEYS.pos(startDate, endDate),
    queryFn: () => reportService.getPosReport(startDate, endDate),
    staleTime: 15000,
  });
}

export function usePromotionsReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: REPORT_KEYS.promotions(startDate, endDate),
    queryFn: () => reportService.getPromotionsReport(startDate, endDate),
    staleTime: 15000,
  });
}
