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
    const response = await api.get(`/analytics/task-completion?days=${days}`);
    const data = response.data;
    const completionByDay = data.completionByDay || {};
    const total = data.totalTasks || 0;
    return Object.entries(completionByDay).map(([date, completed]: any) => ({
      date,
      completed,
      total,
    }));
  },

  async getHabitConsistency(
    days: number = 7
  ): Promise<{ date: string; logged: number; total: number }[]> {
    const response = await api.get(`/analytics/habit-consistency?days=${days}`);
    const data = response.data;
    const consistencyByDay = data.consistencyByDay || {};
    const total = data.totalDays || 0;
    return Object.entries(consistencyByDay).map(([date, logged]: any) => ({
      date,
      logged,
      total,
    }));
  },

  getBestWorstDays: async (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);
    const start = startDate.toISOString().slice(0, 10);
    const end = endDate.toISOString().slice(0, 10);
    const { data } = await api.get(`/analytics/best-worst-days?startDate=${start}&endDate=${end}`);
    return data;
  },
};
