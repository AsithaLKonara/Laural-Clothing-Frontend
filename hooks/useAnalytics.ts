import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';

export const useBusinessOverview = (period: string, branch: string) => {
  return useQuery({
    queryKey: ['analytics', 'overview', period, branch],
    queryFn: () => analyticsService.getBusinessOverview(period, branch),
  });
};
