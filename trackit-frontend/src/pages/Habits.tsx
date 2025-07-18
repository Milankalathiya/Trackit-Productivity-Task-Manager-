import AddIcon from '@mui/icons-material/Add';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import HabitCard from '../components/habits/HabitCard';
import HabitForm from '../components/habits/HabitForm';
import { useHabits } from '../hooks/useHabits';
import type { Habit } from '../types';
import { isToday } from 'date-fns';
import { habitService } from '../services/habitService';

type HabitFormData = {
  name: string;
  description?: string;
  frequency: string;
};

const Habits: React.FC = () => {
  const {
    habits,
    createHabit,
    updateHabit,
    deleteHabit,
    logHabit,
    loading,
    error,
  } = useHabits();
  const [showDialog, setShowDialog] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [habitStreak, setHabitStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const streak = await habitService.getHabitStreak();
        setHabitStreak(streak);
      } catch (e) {
        setHabitStreak(0);
      }
    };
    fetchStreak();
  }, []);

  const handleCreateHabit = async (data: HabitFormData) => {
    setSubmitting(true);
    try {
      await createHabit(data);
      setShowDialog(false);
      setEditingHabit(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateHabit = async (data: HabitFormData) => {
    if (!editingHabit) return;
    setSubmitting(true);
    try {
      await updateHabit(editingHabit.id, data);
      setShowDialog(false);
      setEditingHabit(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        'Are you sure you want to delete this habit? This will remove all associated logs.'
      )
    ) {
      await deleteHabit(id);
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingHabit(null);
  };

  const dailyHabits = habits.filter((habit) => habit.frequency === 'DAILY');
  const weeklyHabits = habits.filter((habit) => habit.frequency === 'WEEKLY');
  const maxStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak || 0)) : 0;

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Habits
          </Typography>
          <Typography color="text.secondary">
            Build better habits and track your progress
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowDialog(true)}
          >
            Add Habit
          </Button>
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
              justifyContent: 'center'
            }}
          >
            <LocalFireDepartmentIcon sx={{ color: 'black', fontSize: 24, mr: 0.5 }} />
            <span style={{ color: 'black' }}>{habitStreak}</span>
          </Box>
        </Box>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : habits.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No habits yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Start building better habits by creating your first one.
          </Typography>
        </Box>
      ) : (
        <Box>
          {dailyHabits.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Daily Habits
              </Typography>
              <Grid container spacing={2}>
                {dailyHabits.map((habit) => (
                  <Grid item xs={12} sm={6} md={4} key={habit.id}>
                    <HabitCard
                      habit={habit}
                      onLogHabit={logHabit}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isLoggedToday={habit.lastLogDate ? isToday(new Date(habit.lastLogDate)) : false}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          {weeklyHabits.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Weekly Habits
              </Typography>
              <Grid container spacing={2}>
                {weeklyHabits.map((habit) => (
                  <Grid item xs={12} sm={6} md={4} key={habit.id}>
                    <HabitCard
                      habit={habit}
                      onLogHabit={logHabit}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isLoggedToday={habit.lastLogDate ? isToday(new Date(habit.lastLogDate)) : false}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}

      {/* Habit Form Dialog */}
      <HabitForm
        open={showDialog}
        onClose={closeDialog}
        habit={editingHabit || undefined}
        onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
        loading={submitting}
      />
    </Box>
  );
};

export default Habits;
