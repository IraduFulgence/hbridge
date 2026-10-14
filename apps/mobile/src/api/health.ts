import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import type { ApiResponse } from '@hbridge/shared';

interface HealthResponse {
  status: string;
  service: string;
  env: string;
  database: {
    status: string;
    userCount: number;
  };
  timestamp: string;
  uptime: number;
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<HealthResponse>>('/health');
      return response.data;
    },
    retry: 1,
    staleTime: 10_000,
  });
}