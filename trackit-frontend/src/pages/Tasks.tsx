import AddIcon from '@mui/icons-material/Add';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
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
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import { useTasks } from '../hooks/useTasks';
import { taskService } from '../services/taskService';
import type { Task, TaskRequest } from '../types';
import { refetchDashboard } from './Dashboard';

const Tasks: React.FC = () => {
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    refetch,
  } = useTasks();
  const [tab, setTab] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [taskStreak, setTaskStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const streak = await taskService.getTaskStreak();
        setTaskStreak(streak);
      } catch {
        setTaskStreak(0);
      }
    };
    fetchStreak();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const filteredTasks = tasks.filter((task) => {
    if (tab === 0) return true;
    if (tab === 1)
      return (
        !task.completed &&
        new Date(task.dueDate).toDateString() === new Date().toDateString()
      );
    if (tab === 2)
      return !task.completed && new Date(task.dueDate) < new Date();
    if (tab === 3) return task.completed;
    return true;
  });

  const handleOpenDialog = (task?: Task) => {
    setEditingTask(task || null);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingTask(null);
  };

  const handleSubmit = async (data: TaskRequest) => {
    setSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        setSnackbar('Task updated successfully!');
        await refetch();
      } else {
        await createTask(data);
        setSnackbar('Task created successfully!');
        await refetch();
      }
      handleCloseDialog();
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    await toggleTaskComplete(taskId);
    setSnackbar('Task completed!');
    await refetch();
    if (refetchDashboard) refetchDashboard();
  };

  const handleDelete = async (taskId: number) => {
    await deleteTask(taskId);
    setSnackbar('Task deleted successfully!');
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Tasks
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Task
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
              justifyContent: 'center',
            }}
          >
            <LocalFireDepartmentIcon
              sx={{ color: 'black', fontSize: 24, mr: 0.5 }}
            />
            <span style={{ color: 'black' }}>{taskStreak}</span>
          </Box>
        </Box>
      </Box>
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="All" />
        <Tab label="Today" />
        <Tab label="Overdue" />
        <Tab label="Completed" />
      </Tabs>
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
      ) : filteredTasks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tasks found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            You have no tasks in this category.
          </Typography>
        </Box>
      ) : (
        <Grid
          container
          spacing={3}
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{ mt: 2, mb: 2, px: { xs: 1, md: 2 }, width: '100%' }}
        >
          {filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={task.id}>
              <TaskCard
                task={task}
                onEdit={handleOpenDialog}
                onDelete={handleDelete}
                onToggleComplete={(taskId) =>
                  handleToggleComplete(tasks.find((t) => t.id === taskId)!.id)
                }
                onToggleExpand={undefined}
                expanded={false}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <TaskForm
            task={editingTask || undefined}
            onSubmit={handleSubmit}
            open={showDialog}
            onClose={handleCloseDialog}
            loading={submitting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
    </Box>
  );
};

export default Tasks;
