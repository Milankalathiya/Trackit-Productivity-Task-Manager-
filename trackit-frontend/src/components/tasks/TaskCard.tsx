import {
  Category,
  CheckCircle,
  Delete,
  Edit,
  ExpandLess,
  ExpandMore,
  PriorityHigh,
  Schedule,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onToggleComplete: (taskId: number) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const statusOptions = [
  { value: 'TODO', label: 'To-Do', sx: { bgcolor: '#e0e0e0', color: 'black', border: '1.5px solid #bdbdbd' } },
  { value: 'IN_PROGRESS', label: 'In Progress', sx: { bgcolor: '#e3f2fd', color: '#1976d2', border: '1.5px solid #1976d2' } },
  { value: 'DONE', label: 'Done', sx: { bgcolor: '#e8f5e9', color: '#388e3c', border: '1.5px solid #388e3c' } },
];

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  expanded = false,
  onToggleExpand,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <PriorityHigh fontSize="small" />;
      default:
        return null;
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  // Status dropdown state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [status, setStatus] = useState(task.completed ? 'DONE' : (task.status || 'TODO'));

  useEffect(() => {
    setStatus(task.completed ? 'DONE' : (task.status || 'TODO'));
  }, [task.completed, task.status]);
  const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleStatusClose = () => {
    setAnchorEl(null);
  };
  const handleStatusChange = (option: string) => {
    setStatus(option);
    setAnchorEl(null);
    // Optionally, call a prop to update status in backend
    if (option === 'DONE') onToggleComplete(task.id);
    // You can add more logic for other statuses if needed
  };

  return (
    <Card
      sx={{
        mb: 2,
        border: isOverdue ? '2px solid #f44336' : '1px solid #e0e0e0',
        backgroundColor: 'white',
        boxShadow: 2,
        borderRadius: 3,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 6 },
        minHeight: 220,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Remove status dropdown from here */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'text.secondary' : 'text.primary',
                  flexGrow: 1,
                }}
              >
                {task.title}
              </Typography>

              <Chip
                label={task.priority}
                color={getPriorityColor(task.priority)}
                size="small"
                icon={getPriorityIcon(task.priority)}
              />

              {task.category && (
                <Chip
                  label={task.category}
                  variant="outlined"
                  size="small"
                  icon={<Category fontSize="small" />}
                />
              )}
            </Box>

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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Schedule fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(task.dueDate), 'MMM dd, yyyy HH:mm')}
                </Typography>
              </Box>

              {task.repeatType !== 'NONE' && (
                <Chip label={task.repeatType} size="small" variant="outlined" />
              )}
            </Box>

            <Collapse in={expanded}>
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                  {task.estimatedHours && (
                    <Typography variant="body2" color="text.secondary">
                      Estimated: {task.estimatedHours}h
                    </Typography>
                  )}
                  {task.actualHours && (
                    <Typography variant="body2" color="text.secondary">
                      Actual: {task.actualHours}h
                    </Typography>
                  )}
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                </Typography>
              </Box>
            </Collapse>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {onToggleExpand && (
              <IconButton size="small" onClick={onToggleExpand}>
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}

            <Tooltip title="Edit Task">
              <IconButton
                size="small"
                onClick={() => onEdit(task)}
                disabled={task.completed}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Task">
              <IconButton
                size="small"
                onClick={() => onDelete(task.id)}
                color="error"
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {/* Status Dropdown at bottom-right */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Chip
            label={statusOptions.find(opt => opt.value === status)?.label || 'To-Do'}
            onClick={handleStatusClick}
            sx={{
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 16,
              px: 2,
              py: 0.5,
              borderRadius: '6px',
              minWidth: 140,
              ...statusOptions.find(opt => opt.value === status)?.sx,
            }}
          />
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleStatusClose} MenuListProps={{ sx: { p: 0 } }}>
            {statusOptions.map((opt) => (
              <MenuItem key={opt.value} onClick={() => handleStatusChange(opt.value)} sx={{ p: 0, mb: 0, minWidth: 140, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Chip label={opt.label} sx={{ ...opt.sx, fontWeight: 600, fontSize: 16, px: 2, py: 0.5, borderRadius: '6px', minWidth: 140, width: '100%', border: 'none' }} />
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
