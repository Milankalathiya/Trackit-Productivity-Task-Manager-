import TaskIcon from '@mui/icons-material/Assignment';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HabitIcon from '@mui/icons-material/Loop';
import PendingIcon from '@mui/icons-material/Schedule';
import AnalyticsIcon from '@mui/icons-material/TrendingUp';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { analyticsService } from '../services/analyticsService';
import { habitService } from '../services/habitService';
import { taskService } from '../services/taskService';
import type { Habit, Task } from '../types';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  totalHabits: number;
  completedHabits: number;
  completionRate: number;
}

export let refetchDashboard: (() => void) | null = null;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    totalHabits: 0,
    completedHabits: 0,
    completionRate: 0,
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [recentHabits, setRecentHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [barChartData, setBarChartData] = useState<
    { name: string; tasks: number; habits: number }[]
  >([]);
  const [totalStreak, setTotalStreak] = useState(0);
  const [pieCounts, setPieCounts] = useState({
    completed: 0,
    pending: 0,
    overdue: 0,
  });
  const { user } = useAuth();

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Load task analytics
      const taskAnalytics = await taskService.getTaskAnalytics();
      const todayTasks = await taskService.getTodayTasks();
      const overdueTasks = await taskService.getOverdueTasks();
      // Load habit data
      const habits = await habitService.getAllHabits();
      setStats({
        totalTasks: taskAnalytics.totalTasks || 0,
        completedTasks: taskAnalytics.completedTasks || 0,
        pendingTasks: todayTasks.length,
        overdueTasks: overdueTasks.length,
        totalHabits: habits.length,
        completedHabits: habits.filter((h: Habit) => h.streak > 0).length,
        completionRate: taskAnalytics.completionRate || 0,
      });
      setRecentTasks(todayTasks.slice(0, 5));
      setRecentHabits(habits.slice(0, 5));
    } catch {
      setError('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    loadWeeklyChartData();
    refetchDashboard = loadDashboardData;
    return () => {
      refetchDashboard = null;
    };
  }, [loadDashboardData]);

  useEffect(() => {
    // Fetch both streaks and sum them
    const fetchStreaks = async () => {
      try {
        const [habit, task] = await Promise.all([
          habitService.getHabitStreak(),
          taskService.getTaskStreak(),
        ]);
        setTotalStreak(habit + task);
      } catch {
        setTotalStreak(0);
      }
    };
    fetchStreaks();
  }, []);

  // Update the pie chart logic to match the user's definition:
  // - Pending: due today and not completed
  // - Overdue: due before today and not completed
  // - Completed: completed tasks
  //
  useEffect(() => {
    const fetchPieData = async () => {
      try {
        const allTasks = await taskService.getAllTasks();
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        let completed = 0,
          overdue = 0,
          pending = 0;
        allTasks.forEach((task) => {
          const due = new Date(task.dueDate);
          const dueDay = new Date(
            due.getFullYear(),
            due.getMonth(),
            due.getDate()
          );
          if (task.completed) completed++;
          else if (dueDay < today) overdue++;
          else if (dueDay.getTime() === today.getTime()) pending++;
          // else: future tasks, not counted
        });
        setPieCounts({ completed, pending, overdue });
      } catch {
        setPieCounts({ completed: 0, pending: 0, overdue: 0 });
      }
    };
    fetchPieData();
  }, []);

  const loadWeeklyChartData = async () => {
    try {
      // Fetch last 7 days of task completion and habit consistency
      const [taskData, habitData] = await Promise.all([
        analyticsService.getTaskCompletion(7),
        analyticsService.getHabitConsistency(7),
      ]);
      // Merge data by date
      const dates = Array.from(
        new Set([
          ...taskData.map((d: { date: string }) => d.date),
          ...habitData.map((d: { date: string }) => d.date),
        ])
      ).sort();
      const merged = dates.map((date) => ({
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        tasks:
          taskData.find((d: { date: string }) => d.date === date)?.completed ||
          0,
        habits:
          habitData.find((d: { date: string }) => d.date === date)?.logged || 0,
      }));
      setBarChartData(merged);
    } catch {
      setBarChartData([]);
    }
  };

  const pieChartData = [
    { name: 'Completed', value: pieCounts.completed, color: '#4caf50' },
    { name: 'Pending', value: pieCounts.pending, color: '#ff9800' },
    { name: 'Overdue', value: pieCounts.overdue, color: '#f44336' },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, md: 3 } }}>
      {/* Welcome Section */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome back, {user?.username}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your productivity overview for{' '}
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            border: '2px solid black',
            borderRadius: '20px',
            px: 2,
            py: 0.5,
            bgcolor: 'background.paper',
            fontWeight: 600,
            fontSize: 18,
            gap: 1,
            minWidth: 60,
            justifyContent: 'center',
          }}
        >
          <LocalFireDepartmentIcon
            sx={{ color: 'black', fontSize: 24, mr: 0.5 }}
          />
          <span style={{ color: 'black' }}>{totalStreak}</span>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <CardContent sx={{ color: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TaskIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Tasks</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.totalTasks}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {stats.completedTasks} completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            }}
          >
            <CardContent sx={{ color: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HabitIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Habits</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.totalHabits}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {stats.completedHabits} active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            }}
          >
            <CardContent sx={{ color: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AnalyticsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Completion Rate</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {Math.round(stats.completionRate)}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                of tasks completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            }}
          >
            <CardContent sx={{ color: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PendingIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Overdue</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.overdueTasks}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                tasks overdue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Task Status
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Activity
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#2196F3" name="Tasks" />
                <Bar dataKey="habits" fill="#FF9800" name="Habits" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Tasks & Habits */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Tasks
            </Typography>
            {recentTasks.length === 0 ? (
              <Typography color="text.secondary">No recent tasks.</Typography>
            ) : (
              recentTasks.map((task) => (
                <Box
                  key={task.id}
                  sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                >
                  <Chip
                    label={task.priority}
                    color={
                      task.priority === 'HIGH'
                        ? 'error'
                        : task.priority === 'MEDIUM'
                        ? 'warning'
                        : 'success'
                    }
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Typography sx={{ flexGrow: 1 }}>{task.title}</Typography>
                  <Typography color="text.secondary" variant="caption">
                    {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Habits
            </Typography>
            {recentHabits.length === 0 ? (
              <Typography color="text.secondary">No recent habits.</Typography>
            ) : (
              recentHabits.map((habit) => (
                <Box
                  key={habit.id}
                  sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1,
                      bgcolor: 'primary.main',
                    }}
                  >
                    {habit.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography sx={{ flexGrow: 1 }}>{habit.name}</Typography>
                  <Chip label={habit.frequency} size="small" />
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
