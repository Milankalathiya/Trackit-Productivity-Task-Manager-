import type { Task, TaskAnalytics, TaskRequest } from '../types';
import api from './api';

class TaskService {
  // Get all tasks
  async getAllTasks(): Promise<Task[]> {
    const response = await api.get('/tasks');
    return response.data;
  }

  // Get today's tasks
  async getTodayTasks(): Promise<Task[]> {
    const response = await api.get('/tasks/today');
    return response.data;
  }

  // Get overdue tasks
  async getOverdueTasks(): Promise<Task[]> {
    const response = await api.get('/tasks/overdue');
    return response.data;
  }

  // Get upcoming tasks
  async getUpcomingTasks(days: number = 7): Promise<Task[]> {
    const response = await api.get(`/tasks/upcoming?days=${days}`);
    return response.data;
  }

  // Get tasks by category
  async getTasksByCategory(category: string): Promise<Task[]> {
    const response = await api.get(
      `/tasks/category/${encodeURIComponent(category)}`
    );
    return response.data;
  }

  // Get tasks by priority
  async getTasksByPriority(priority: string): Promise<Task[]> {
    const response = await api.get(`/tasks/priority/${priority}`);
    return response.data;
  }

  // Get task history
  async getTaskHistory(startDate: string, endDate: string): Promise<Task[]> {
    const response = await api.get('/tasks/history', {
      params: { start: startDate, end: endDate },
    });
    return response.data;
  }

  // Get task by ID
  async getTaskById(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  }

  // Create new task
  async createTask(taskData: TaskRequest): Promise<Task> {
    const response = await api.post('/tasks', taskData);
    return response.data;
  }

  // Update task
  async updateTask(id: number, taskData: Partial<TaskRequest>): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  }

  // Mark task as complete
  async markTaskComplete(id: number): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/complete`);
    return response.data;
  }

  // Mark task as incomplete
  async markTaskIncomplete(id: number): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/incomplete`);
    return response.data;
  }

  // Archive task
  async archiveTask(id: number): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/archive`);
    return response.data;
  }

  // Delete task
  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }

  // Get task analytics
  async getTaskAnalytics(): Promise<TaskAnalytics> {
    const response = await api.get('/tasks/analytics');
    const data = response.data;
    return {
      totalTasks: data.totalTasks || 0,
      completedTasks: data.completedTasks || 0,
      overdueTasks: data.overdueTasks || 0,
      todayTasks: data.todayTasks || 0,
      completionRate: data.completionRate || 0,
      tasksByPriority: data.tasksByPriority || {},
      tasksByCategory: data.tasksByCategory || {},
    };
  }

  // Get task categories
  async getTaskCategories(): Promise<string[]> {
    const response = await api.get('/tasks/categories');
    return response.data;
  }
}

export const taskService = new TaskService();
