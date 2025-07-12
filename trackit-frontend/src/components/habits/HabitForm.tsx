import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import type { Habit } from '../../types';

interface HabitFormData {
  name: string;
  description?: string;
  frequency: string;
}

interface HabitFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: HabitFormData) => Promise<void>;
  habit?: Habit;
  loading?: boolean;
}

const HabitForm: React.FC<HabitFormProps> = ({
  open,
  onClose,
  onSubmit,
  habit,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HabitFormData>({
    defaultValues: {
      name: habit?.name || '',
      description: habit?.description || '',
      frequency: habit?.frequency || 'DAILY',
    },
  });

  const handleFormSubmit = async (data: HabitFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {habit ? 'Edit Habit' : 'Create New Habit'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{ mt: 2 }}
        >
          <TextField
            {...register('name', { required: 'Habit name is required' })}
            fullWidth
            label="Habit Name"
            variant="outlined"
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            {...register('description')}
            fullWidth
            label="Description"
            variant="outlined"
            margin="normal"
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Frequency</InputLabel>
            <Select
              {...register('frequency')}
              label="Frequency"
              defaultValue="DAILY"
            >
              <MenuItem value="DAILY">Daily</MenuItem>
              <MenuItem value="WEEKLY">Weekly</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : habit ? 'Update Habit' : 'Create Habit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HabitForm;
