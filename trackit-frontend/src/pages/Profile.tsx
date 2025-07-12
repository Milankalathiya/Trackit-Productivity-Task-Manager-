import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

interface ProfileFormData {
  username: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { state, updateUser } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      username: state.user?.username || '',
      email: state.user?.email || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>();

  const handleProfileUpdate = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      // TODO: Implement updateProfile in authService
      // const updatedUser = await authService.updateProfile(data);
      // updateUser(updatedUser);
      setProfileSuccess('Profile updated successfully!');
    } catch (error: any) {
      setProfileError(
        error.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (data: PasswordFormData) => {
    setIsUpdatingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    try {
      if (data.newPassword !== data.confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      // TODO: Implement updatePassword in authService
      setPasswordSuccess('Password updated successfully!');
      passwordForm.reset();
    } catch (error: any) {
      setPasswordError(
        error.response?.data?.message || 'Failed to update password'
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: { xs: 1, md: 3 } }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Profile Settings
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Manage your account information and preferences
      </Typography>
      <Paper sx={{ mb: 4, p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Profile Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                fullWidth
                {...profileForm.register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                })}
                error={!!profileForm.formState.errors.username}
                helperText={profileForm.formState.errors.username?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                {...profileForm.register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={!!profileForm.formState.errors.email}
                helperText={profileForm.formState.errors.email?.message}
              />
            </Grid>
          </Grid>
          {profileError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {profileError}
            </Alert>
          )}
          {profileSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {profileSuccess}
            </Alert>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? (
                <CircularProgress size={20} sx={{ mr: 1 }} />
              ) : null}
              Save Changes
            </Button>
          </Box>
        </form>
      </Paper>
      <Paper sx={{ mb: 4, p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Change Password
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                {...passwordForm.register('currentPassword', {
                  required: 'Current password is required',
                })}
                error={!!passwordForm.formState.errors.currentPassword}
                helperText={
                  passwordForm.formState.errors.currentPassword?.message
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                {...passwordForm.register('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                error={!!passwordForm.formState.errors.newPassword}
                helperText={passwordForm.formState.errors.newPassword?.message}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                {...passwordForm.register('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (value) =>
                    value === passwordForm.watch('newPassword') ||
                    'Passwords do not match',
                })}
                error={!!passwordForm.formState.errors.confirmPassword}
                helperText={
                  passwordForm.formState.errors.confirmPassword?.message
                }
              />
            </Grid>
          </Grid>
          {passwordError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {passwordError}
            </Alert>
          )}
          {passwordSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {passwordSuccess}
            </Alert>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? (
                <CircularProgress size={20} sx={{ mr: 1 }} />
              ) : null}
              Update Password
            </Button>
          </Box>
        </form>
      </Paper>
      <Card sx={{ p: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Account Statistics
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                  0
                </Typography>
                <Typography color="text.secondary">Total Tasks</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="success.main" fontWeight={700}>
                  0
                </Typography>
                <Typography color="text.secondary">Active Habits</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography
                  variant="h4"
                  color="secondary.main"
                  fontWeight={700}
                >
                  0
                </Typography>
                <Typography color="text.secondary">Days Active</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
