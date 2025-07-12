import AddIcon from '@mui/icons-material/Add';
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
import React, { useState } from 'react';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import { useTasks } from '../hooks/useTasks';
import type { Task, TaskRequest } from '../types';

const Tasks: React.FC = () => {
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  } = useTasks();
  const [tab, setTab] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);

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
      } else {
        await createTask(data);
        setSnackbar('Task created successfully!');
      }
      handleCloseDialog();
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    await toggleTaskComplete(task.id);
    setSnackbar(task.completed ? 'Task marked incomplete' : 'Task completed!');
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Task
        </Button>
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
        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} md={6} key={task.id}>
              <TaskCard
                task={task}
                onEdit={handleOpenDialog}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
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
