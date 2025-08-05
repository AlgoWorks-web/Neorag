import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaSpinner } from 'react-icons/fa';
import { getAuthToken, getTrainerHeaders } from '../../auth/authUtils';

function ChangePassword() {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setMessage('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required';
    }
    
    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'New password must be at least 8 characters';
    }
    
    if (!formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Password confirmation is required';
    } else if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formErrors = validateForm();
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }
  
  setLoading(true);
  setMessage('');
  setErrors({});
  
  try {
    // ✅ Use your utility function
    const token = getAuthToken();
    
    if (!token) {
      setMessage('Authentication token not found. Please login again.');
      setMessageType('error');
      setLoading(false);
      return;
    }
    
    const response = await fetch('https://hydersoft.com/api/trainer/change-password', {
      method: 'POST',
      headers: getTrainerHeaders(), // ✅ Use your helper function
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        setMessage('Session expired. Please login again.');
        setMessageType('error');
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      setMessage(data.message);
      setMessageType('success');
      setFormData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    } else {
      setMessage(data.message || 'Failed to change password');
      setMessageType('error');
      
      if (data.errors) {
        setErrors(data.errors);
      }
    }
  } catch (error) {
    console.error('Error changing password:', error);
    setMessage('Network error. Please try again.');
    setMessageType('error');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <FaLock className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Change Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Update your account password
          </p>
        </div>

        {/* Alert Messages */}
        {message && (
          <div className={`rounded-md p-4 ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex">
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  messageType === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="current_password"
                  name="current_password"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.current_password}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full px-3 py-3 pr-10 border ${
                    errors.current_password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.current_password && (
                <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new_password"
                  name="new_password"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.new_password}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full px-3 py-3 pr-10 border ${
                    errors.new_password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter new password (min 8 characters)"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.new_password && (
                <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="new_password_confirmation"
                  name="new_password_confirmation"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.new_password_confirmation}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full px-3 py-3 pr-10 border ${
                    errors.new_password_confirmation ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.new_password_confirmation && (
                <p className="mt-1 text-sm text-red-600">{errors.new_password_confirmation}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              } transition duration-150 ease-in-out`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Changing Password...
                </>
              ) : (
                <>
                  <FaLock className="h-5 w-5 mr-2" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Minimum 8 characters long</li>
            <li>• Must match confirmation password</li>
            <li>• Should be different from current password</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
