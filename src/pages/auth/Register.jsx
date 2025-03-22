import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";  

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'buyer',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} field with value:`, value);  // Debugging

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  // Validate Form Inputs
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.address.trim()) errors.address = "Address is required";

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup button clicked");

    console.log("Form data before validation:", formData);

    setErrorMessage("");

    const errors = validateForm();
    console.log("Validation errors:", errors);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    console.log("All inputs are valid. Proceeding with Firebase signup...");

    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("User created successfully:", userCredential.user);

      // Redirect based on role
      setTimeout(() => {
        if (formData.role === 'farmer') {
          navigate('/farmer');
        } else if (formData.role === 'buyer') {
          navigate('/buyer');
        } else if (formData.role === 'admin') {
          navigate('/admin');
        }
      }, 2000);
    } catch (error) {
      console.error("Error signing up:", error.code, error.message);
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t('auth.signUp')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
            {t('auth.signIn')}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Input */}
            <InputField
              id="name"
              label="Name"
              icon={<FaUser />}
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
            />

            {/* Email Input */}
            <InputField
              id="email"
              label="Email"
              icon={<FaEnvelope />}
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
            />

            {/* Password Input */}
            <InputField
              id="password"
              label="Password"
              icon={<FaLock />}
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
            />

            {/* Confirm Password Input */}
            <InputField
              id="confirmPassword"
              label="Confirm Password"
              icon={<FaLock />}
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
            />

            {/* Phone Input */}
            <InputField
              id="phone"
              label="Phone"
              icon={<FaPhone />}
              type="text"
              value={formData.phone}
              onChange={handleChange}
              error={formErrors.phone}
            />

            {/* Address Input */}
            <InputField
              id="address"
              label="Address"
              icon={<FaMapMarkerAlt />}
              type="text"
              value={formData.address}
              onChange={handleChange}
              error={formErrors.address}
            />

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Input Field Component (Reusable)
const InputField = ({ id, label, icon, type, value, onChange, error }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-3 py-2 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
      />
    </div>
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
  </div>
);

export default Register;
