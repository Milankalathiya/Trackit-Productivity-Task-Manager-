import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { taskService } from '../services/taskService';
import type { Task, TaskRequest } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: TaskRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      toast.success('Task created successfully!');
      return newTask;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(
    async (id: number, taskData: Partial<TaskRequest>) => {
      setLoading(true);
      setError(null);
      try {
        const updatedTask = await taskService.updateTask(id, taskData);
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
        toast.success('Task updated successfully!');
        return updatedTask;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update task';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteTask = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTaskComplete = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        const updatedTask = task.completed
          ? await taskService.markTaskIncomplete(id)
          : await taskService.markTaskComplete(id);

        setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
        toast.success(
          updatedTask.completed ? 'Task completed!' : 'Task marked incomplete'
        );
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update task';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [tasks]
  );

  const archiveTask = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const archivedTask = await taskService.archiveTask(id);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? archivedTask : task))
      );
      toast.success('Task archived successfully!');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to archive task';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    archiveTask,
    refetch: fetchTasks,
  };
};
