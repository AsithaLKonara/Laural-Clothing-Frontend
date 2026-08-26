import { useQuery } from '@tanstack/react-query';
import { auditService } from '../services/audit.service';

export function useAuditLogs(params?: { search?: string; action?: string; timeframe?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['auditLogs', params],
    queryFn: () => auditService.getLogs(params),
  });
}
