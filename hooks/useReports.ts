import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/report.service';

export const REPORT_KEYS = {
  all: ['reports'] as const,
  sales: (start?: string, end?: string) => ['reports', 'sales', start, end] as const,
  branches: (start?: string, end?: string) => ['reports', 'branches', start, end] as const,
  payments: (start?: string, end?: string) => ['reports', 'payments', start, end] as const,
  inventory: ['reports', 'inventory'] as const,
};

export function useSalesReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: REPORT_KEYS.sales(startDate, endDate),
    queryFn: () => reportService.getSalesReport(startDate, endDate),
  });
}

export function useBranchReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: REPORT_KEYS.branches(startDate, endDate),
    queryFn: () => reportService.getBranchReport(startDate, endDate),
  });
}

export function usePaymentReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: REPORT_KEYS.payments(startDate, endDate),
    queryFn: () => reportService.getPaymentReport(startDate, endDate),
  });
}

export function useInventoryValuationReport() {
  return useQuery({
    queryKey: REPORT_KEYS.inventory,
    queryFn: () => reportService.getInventoryValuationReport(),
  });
}
