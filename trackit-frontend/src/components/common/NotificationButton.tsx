import React from 'react';
import { IconButton, Box } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const NotificationButton: React.FC = () => (
  <Box
    sx={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      zIndex: 2000,
    }}
  >
    <IconButton
      sx={{
        backgroundColor: '#0d47a1', // much darker blue
        color: 'white',
        width: 64,
        height: 64,
        borderRadius: '50%',
        boxShadow: 3,
        '&:hover': {
          backgroundColor: '#1565c0', // slightly lighter on hover
        },
      }}
      size="large"
    >
      <NotificationsNoneIcon sx={{ fontSize: 36, color: 'white' }} />
    </IconButton>
  </Box>
);

export default NotificationButton; 