import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

function Login() {
  const { t } = useTranslation();
  const { login, error } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'buyer', // Default role
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // For demo purposes, let's handle admin login specially
      if (formData.role === 'admin' && formData.email === 'admin@example.com' && formData.password === 'admin123') {
        // Create a mock admin user
        const adminUser = {
          id: 'admin_1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        
        // Generate a fake token
        const token = 'fake_token_admin_' + Math.random().toString(36).substr(2, 16);
        
        // Store token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(adminUser));
        
        // Navigate to admin dashboard
        navigate('/admin');
        return;
      }
      
      // Regular login for farmer/buyer
      await login(formData.email, formData.password);
      
      // Get user from localStorage to determine role
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        
        // Redirect based on role
        if (user.role === 'farmer') {
          navigate('/farmer');
        } else if (user.role === 'buyer') {
          navigate('/buyer');
        } else if (user.role === 'admin') {
          navigate('/admin');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Error is handled by AuthContext and stored in error state
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t('auth.signIn')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
            {t('auth.createAccount')}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {t(error)}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth.email')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.password')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                {t('auth.role')}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              >
                <option value="farmer">{t('auth.farmer')}</option>
                <option value="buyer">{t('auth.buyer')}</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  {t('auth.rememberMe')}
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
              </motion.button>
            </div>
          </form>
          
          {/* Admin login hint */}
          {formData.role === 'admin' && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
              <p><strong>Admin Demo Credentials:</strong></p>
              <p>Email: admin@example.com</p>
              <p>Password: admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login; 