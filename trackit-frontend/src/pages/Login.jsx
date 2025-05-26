import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loginStatus, setLoginStatus] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      window.history.pushState(null, '', window.location.href);
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginStatus(null);
    setErrors({}); // Clear previous errors

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Handle different response types
      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Parse the successful response
      const result = await response.json();

      // Store authentication data
      if (result.token) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('tokenType', result.tokenType || 'Bearer');
        localStorage.setItem('userId', result.userId?.toString() || '');
        localStorage.setItem('username', result.username || '');
        localStorage.setItem('isAuthenticated', 'true');
      }

      setLoginStatus('success');

      setTimeout(() => {
        setLoginStatus(null);
        setIsLoading(false);
        window.history.pushState(null, '', window.location.href);
        navigate('/dashboard', { replace: true });
      }, 1500);

    } catch (error) {
      console.error('Login error:', error);
      setLoginStatus('error');
      setErrors({
        general: error.message || 'Login failed. Please try again.',
      });
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .input-focus:focus {
          border-color: ${isDarkMode ? '#60a5fa' : '#3b82f6'} !important;
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'} !important;
          transform: scale(1.02);
        }

        .button-hover:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        }

        .toggle-hover:hover {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} !important;
          transform: scale(1.1);
        }

        ::placeholder {
          color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
        }

        @media (max-width: 640px) {
          .login-card {
            margin: 1rem !important;
            max-width: calc(100vw - 2rem) !important;
          }

          .login-container {
            padding: 0.5rem !important;
          }

          .toggle-button {
            top: 1rem !important;
            right: 1rem !important;
          }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: isDarkMode
          ? 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e293b 100%)'
          : 'linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #8b5cf6 100%)',
        transition: 'all 0.5s ease',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1
      }} className="login-container">

        {/* Animated background blobs */}
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'}}>
          <div style={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '16rem',
            height: '16rem',
            borderRadius: '50%',
            background: isDarkMode ? '#3b82f6' : '#60a5fa',
            opacity: 0.2,
            filter: 'blur(60px)',
            animation: 'pulse 4s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '25%',
            right: '25%',
            width: '16rem',
            height: '16rem',
            borderRadius: '50%',
            background: isDarkMode ? '#8b5cf6' : '#a78bfa',
            opacity: 0.2,
            filter: 'blur(60px)',
            animation: 'pulse 4s ease-in-out infinite',
            animationDelay: '1s'
          }} />
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            padding: '0.75rem',
            borderRadius: '50%',
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
            color: isDarkMode ? 'white' : 'black',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '1.25rem',
            zIndex: 20
          }}
          className="toggle-hover toggle-button"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Login card */}
        <div style={{
          width: '100%',
          maxWidth: '28rem',
          background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}`,
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.3s ease',
          zIndex: 10,
          position: 'relative'
        }} className="login-card">

          <div style={{padding: '2rem', paddingBottom: '1.5rem'}}>
            {/* Header */}
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                background: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                color: isDarkMode ? '#60a5fa' : '#3b82f6',
                marginBottom: '1rem'
              }}>
                <LogIn size={32} />
              </div>
              <h1 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                color: isDarkMode ? 'white' : '#111827',
                margin: '0 0 0.5rem 0'
              }}>Welcome Back</h1>
              <p style={{
                color: isDarkMode ? '#d1d5db' : '#4b5563',
                margin: 0
              }}>Sign in to your account</p>
            </div>

            {/* Success alert */}
            {loginStatus === 'success' && (
              <div style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.875rem',
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#22c55e'
              }}>
                <CheckCircle size={20} />
                <span>Login successful! Redirecting...</span>
              </div>
            )}

            {/* Error alert */}
            {errors.general && (
              <div style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.875rem',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444'
              }}>
                <AlertCircle size={20} />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Username input */}
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: isDarkMode ? 'white' : '#374151'
              }}>Username</label>
              <div style={{position: 'relative'}}>
                <div style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  zIndex: 1
                }}>
                  <User size={20} />
                </div>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '1rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderRadius: '0.5rem',
                    background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
                    border: `1px solid ${errors.username ? '#ef4444' : (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)')}`,
                    color: isDarkMode ? 'white' : '#111827',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  className="input-focus"
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem'
                }}>{errors.username}</p>
              )}
            </div>

            {/* Password input */}
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: isDarkMode ? 'white' : '#374151'
              }}>Password</label>
              <div style={{position: 'relative'}}>
                <div style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  zIndex: 1
                }}>
                  <Lock size={20} />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '3rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderRadius: '0.5rem',
                    background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
                    border: `1px solid ${errors.password ? '#ef4444' : (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)')}`,
                    color: isDarkMode ? 'white' : '#111827',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  className="input-focus"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem'
                }}>{errors.password}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                background: isLoading ? '#6b7280' : 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              className="button-hover"
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div style={{
            padding: '1.5rem 2rem',
            borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            textAlign: 'center'
          }}>
            <div>
              <a href="#" style={{
                fontSize: '0.875rem',
                color: isDarkMode ? '#60a5fa' : '#3b82f6',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}>
                Forgot your password?
              </a>
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              marginTop: '1rem'
            }}>
              Don't have an account?{' '}
              <Link to="/register" style={{
                fontSize: '0.875rem',
                color: isDarkMode ? '#60a5fa' : '#3b82f6',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;