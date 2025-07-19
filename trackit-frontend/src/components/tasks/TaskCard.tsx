import {
  Category,
  CheckCircle,
  Delete,
  Edit,
  PlayArrow,
  PriorityHigh,
  Schedule,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import type { Task } from '../../types';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onToggleComplete: (taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <PriorityHigh fontSize="small" />;
      default:
        return null;
    }
  };

  // Status dropdown state
  const [status, setStatus] = useState<TaskStatus>(
    task.completed ? 'DONE' : (task.status as TaskStatus) || 'TODO'
  );

  useEffect(() => {
    setStatus(task.completed ? 'DONE' : (task.status as TaskStatus) || 'TODO');
  }, [task.completed, task.status]);

  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus);
    // Call the appropriate function based on status
    if (newStatus === 'DONE') {
      onToggleComplete(task.id);
    }
    // You can add more logic for other statuses if needed
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return '#FF9800'; // Orange
      case 'IN_PROGRESS':
        return '#2196F3'; // Blue
      case 'DONE':
        return '#4CAF50'; // Green
      default:
        return '#757575'; // Gray
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return <Schedule fontSize="small" />;
      case 'IN_PROGRESS':
        return <PlayArrow fontSize="small" />;
      case 'DONE':
        return <CheckCircle fontSize="small" />;
      default:
        return <Schedule fontSize="small" />;
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return 'To-Do';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'DONE':
        return 'Done';
      default:
        return 'To-Do';
    }
  };

  const handleDropdownChange = (event: SelectChangeEvent<TaskStatus>) => {
    handleStatusChange(event.target.value as TaskStatus);
  };

  return (
    <Card
      sx={{
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        border: 'none',
        minWidth: 280,
        maxWidth: 370,
        width: '100%',
        p: 0,
        m: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 8 },
      }}
    >
      <CardContent
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        {/* Top row: title, badges, edit/delete */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}
        >
          <Typography
            variant="h6"
            sx={{
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'text.secondary' : 'text.primary',
              fontWeight: 700,
              flexGrow: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {task.title}
          </Typography>
          <Chip
            label={task.priority}
            sx={{
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.85em',
              px: 1.5,
              backgroundColor:
                task.priority === 'HIGH'
                  ? '#ff4d4f'
                  : task.priority === 'MEDIUM'
                  ? '#faad14'
                  : task.priority === 'LOW'
                  ? '#52c41a'
                  : '#e0e0e0',
              color: '#fff',
              ml: 1,
            }}
            size="small"
            icon={getPriorityIcon(task.priority)}
          />
          {task.category && (
            <Chip
              label={task.category}
              variant="outlined"
              size="small"
              icon={<Category fontSize="small" />}
              sx={{
                borderRadius: '12px',
                fontWeight: 500,
                fontSize: '0.85em',
                px: 1.2,
                ml: 1,
              }}
            />
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            <Tooltip title="Edit Task">
              <IconButton
                size="small"
                onClick={() => onEdit(task)}
                disabled={task.completed}
                sx={{ borderRadius: '8px' }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Task">
              <IconButton
                size="small"
                onClick={() => onDelete(task.id)}
                color="error"
                sx={{ borderRadius: '8px' }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {/* Description */}
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textDecoration: task.completed ? 'line-through' : 'none',
              mb: 1,
            }}
          >
            {task.description}
          </Typography>
        )}
        {/* Date and repeat */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 1,
            width: '100%',
          }}
        >
          <Schedule fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {format(new Date(task.dueDate), 'MMM dd, yyyy HH:mm')}
          </Typography>
          {task.repeatType !== 'NONE' && (
            <Chip
              label={task.repeatType}
              size="small"
              variant="outlined"
              sx={{
                borderRadius: '10px',
                fontSize: '0.8em',
                ml: 1,
                alignSelf: 'center',
              }}
            />
          )}
        </Box>
        {/* Status dropdown at bottom */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            mt: 2,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={status}
              onChange={handleDropdownChange}
              disabled={task.completed}
              displayEmpty
              sx={{
                borderRadius: '999px',
                background: '#f5f5f5',
                fontWeight: 600,
                px: 1.5,
                py: 0.5,
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 0.5,
                  borderRadius: '999px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: getStatusColor(status),
                  borderRadius: '999px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: getStatusColor(status),
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: getStatusColor(status),
                },
              }}
              renderValue={(value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(value)}
                  <Typography
                    variant="body2"
                    sx={{
                      color: getStatusColor(value),
                      fontWeight: 600,
                    }}
                  >
                    {getStatusLabel(value)}
                  </Typography>
                </Box>
              )}
            >
              <MenuItem value="TODO">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule fontSize="small" sx={{ color: '#FF9800' }} />
                  <Typography
                    variant="body2"
                    sx={{ color: '#FF9800', fontWeight: 600 }}
                  >
                    To-Do
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="IN_PROGRESS">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PlayArrow fontSize="small" sx={{ color: '#2196F3' }} />
                  <Typography
                    variant="body2"
                    sx={{ color: '#2196F3', fontWeight: 600 }}
                  >
                    In Progress
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="DONE">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle fontSize="small" sx={{ color: '#4CAF50' }} />
                  <Typography
                    variant="body2"
                    sx={{ color: '#4CAF50', fontWeight: 600 }}
                  >
                    Done
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
