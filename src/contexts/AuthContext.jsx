import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);
  
  const fetchCurrentUser = async () => {
    try {
      const user = await api.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error fetching current user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };
  
  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await api.login(email, password);
      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error('Login error:', err);
      setError('auth.loginError');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await api.register(userData);
      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error('Registration error:', err);
      setError('auth.registerError');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };
  
  // Forgot password function
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.forgotPassword(email);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('auth.forgotPasswordError');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password function
  const resetPassword = async (token, password) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.resetPassword(token, password);
    } catch (err) {
      console.error('Reset password error:', err);
      setError('auth.resetPasswordError');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update profile function
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await api.updateProfile(userData);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Update profile error:', err);
      setError('profile.updateError');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 