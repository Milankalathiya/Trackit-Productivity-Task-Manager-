import api from './api';
import type { Analytics, ApiResponse } from '../types';

export const analyticsService = {
  async getAnalytics(startDate?: string, endDate?: string): Promise<Analytics> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    // FIX: use /summary endpoint
    const response = await api.get<ApiResponse<Analytics>>(
      `/analytics/summary?${params}`
    );
    return response.data.data;
  },

  async getTaskCompletion(
    days: number = 7
  ): Promise<{ date: string; completed: number; total: number }[]> {
    const response = await api.get<
      ApiResponse<{ date: string; completed: number; total: number }[]>
    >(`/analytics/task-completion?days=${days}`);
    return response.data.data;
  },

  async getHabitConsistency(
    days: number = 7
  ): Promise<{ date: string; logged: number; total: number }[]> {
    const response = await api.get<
      ApiResponse<{ date: string; logged: number; total: number }[]>
    >(`/analytics/habit-consistency?days=${days}`);
    return response.data.data;
  },
};
