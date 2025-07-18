import type { Habit, HabitLog } from '../types';
import api from './api';

export interface CreateHabitRequest {
  name: string;
  description?: string;
  frequency: 'DAILY' | 'WEEKLY';
}

export const habitService = {
  async getAllHabits(): Promise<Habit[]> {
    const response = await api.get('/habits');
    // The backend now returns HabitWithStreakDTO, which matches the updated Habit type
    return response.data;
  },

  async createHabit(habitData: CreateHabitRequest): Promise<Habit> {
    const response = await api.post('/habits', habitData);
    return response.data;
  },

  async updateHabit(
    id: number,
    habitData: Partial<CreateHabitRequest>
  ): Promise<Habit> {
    const response = await api.put(`/habits/${id}`, habitData);
    return response.data;
  },

  async deleteHabit(id: number): Promise<void> {
    await api.delete(`/habits/${id}`);
  },

  async logHabit(id: number): Promise<Habit> {
    const response = await api.post(`/habits/${id}/log`);
    return response.data;
  },

  async getHabitLogs(id: number): Promise<HabitLog[]> {
    const response = await api.get(`/habits/${id}/logs`);
    return response.data;
  },

  async getWeeklyProgress(id: number): Promise<number[]> {
    const response = await api.get(`/habits/${id}/weekly-progress`);
    return response.data;
  },

  async getHabitStreak(): Promise<number> {
    const habits = await habitService.getAllHabits();
    // Return the highest streak among all habits
    return habits.length > 0 ? Math.max(...habits.map((h: any) => h.streak || 0)) : 0;
  },
};
