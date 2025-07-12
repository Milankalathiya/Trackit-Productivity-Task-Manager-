import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { habitService } from '../services/habitService';
import type { Habit } from '../types';

interface HabitFormData {
  name: string;
  description?: string;
  frequency: string;
}

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await habitService.getAllHabits();
      setHabits(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch habits';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createHabit = useCallback(async (habitData: HabitFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newHabit = await habitService.createHabit(habitData);
      setHabits((prev) => [newHabit, ...prev]);
      toast.success('Habit created successfully!');
      return newHabit;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create habit';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateHabit = useCallback(
    async (id: number, habitData: Partial<HabitFormData>) => {
      setLoading(true);
      setError(null);
      try {
        const updatedHabit = await habitService.updateHabit(id, habitData);
        setHabits((prev) =>
          prev.map((habit) => (habit.id === id ? updatedHabit : habit))
        );
        toast.success('Habit updated successfully!');
        return updatedHabit;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update habit';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteHabit = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await habitService.deleteHabit(id);
      setHabits((prev) => prev.filter((habit) => habit.id !== id));
      toast.success('Habit deleted successfully!');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete habit';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logHabit = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const loggedHabit = await habitService.logHabit(id);
      setHabits((prev) =>
        prev.map((habit) => (habit.id === id ? loggedHabit : habit))
      );
      toast.success('Habit logged successfully!');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to log habit';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return {
    habits,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    logHabit,
    refetch: fetchHabits,
  };
};
