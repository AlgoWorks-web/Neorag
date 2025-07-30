import React, { useState, useEffect } from 'react';

const TrainerProfile = ({ trainerId }) => {
  const [formData, setFormData] = useState({
    trainer_name: '',
    email: '',
    bio: '',
    location: '',
    phone_number: '',
    expertise: '',
    profile_pic: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  // Fetch trainer details on component mount
  useEffect(() => {
    fetchTrainerDetails();
  }, [trainerId]);

  const fetchTrainerDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get trainer ID and ensure it's a simple number/string
      let id = trainerId || localStorage.getItem('trainerUser') || '1';
      
      // If id is stored as JSON object, parse it and extract the ID
      if (typeof id === 'string' && id.startsWith('{')) {
        try {
          const parsed = JSON.parse(id);
          id = parsed.id || parsed.trainer_id || '1';
        } catch (e) {
          console.warn('Failed to parse stored trainer ID, using fallback');
          id = '1';
        }
      }
      
      console.log('Fetching trainer with ID:', id);
      
      const response = await fetch(`https://hydersoft.com/api/admin/trainer/trainers/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch trainer details: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Trainer data:', data);
      
      // Handle different response structures
      const trainer = data.trainer || data;
      const user = trainer.user || {};
      
      setFormData({
        trainer_name: trainer.trainer_name || '',
        email: user.email_id || trainer.email || '',
        bio: trainer.bio || '',
        location: trainer.location || '',
        phone_number: trainer.phone_number || '',
        expertise: trainer.expertise || '',
        profile_pic: trainer.profile_pic || '',
      });
      
    } catch (err) {
      console.error('Error fetching trainer details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      setError('');
      
      // Get trainer ID and ensure it's a simple number/string
      let id = trainerId || localStorage.getItem('trainerUser');
      
      // If id is stored as JSON object, parse it and extract the ID
      if (typeof id === 'string' && id.startsWith('{')) {
        try {
          const parsed = JSON.parse(id);
          id = parsed.id || parsed.trainer_id;
        } catch (e) {
          console.warn('Failed to parse stored trainer ID');
          throw new Error('Invalid trainer ID format');
        }
      }
      
      if (!id) {
        throw new Error('Trainer ID not found');
      }
      
      console.log('Updating trainer with ID:', id);
      
      const formDataToSend = new FormData();
      formDataToSend.append('trainer_name', formData.trainer_name);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('expertise', formData.expertise);
      
      if (avatar) {
        formDataToSend.append('profile_pic', avatar);
      }
      
      // Use POST method with proper headers
      const response = await fetch(`https://hydersoft.com/api/admin/trainer/trainers/${id}`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json',
          // Don't set Content-Type for FormData
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Update failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Update result:', result);
      
      // Refresh data after successful update
      await fetchTrainerDetails();
      setIsEditing(false);
      setAvatar(null);
      
      // Show success message
      alert('Profile updated successfully!');
      
    } catch (err) {
      console.error('Error updating trainer:', err);
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getProfileImageUrl = () => {
    if (avatar) {
      return URL.createObjectURL(avatar);
    }
    if (formData.profile_pic) {
      return formData.profile_pic;
    }
    return '/api/placeholder/200/200'; // Placeholder image
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 max-w-full">
        <div className="animate-pulse">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <div className="h-8 bg-gray-300 rounded w-48 mb-4 sm:mb-0"></div>
            <div className="h-10 bg-gray-300 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex justify-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gray-300 rounded-full"></div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 max-w-full">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Profile</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTrainerDetails}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Profile Settings</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm sm:text-base transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Error message during editing */}
      {error && isEditing && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {isEditing ? (
        /* Edit Form */
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1 order-1 lg:order-none">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {avatar && (
                  <p className="mt-2 text-sm text-gray-600">Selected: {avatar.name}</p>
                )}
              </div>
              
              {/* Preview */}
              <div className="flex justify-center mb-4">
                <img
                  src={getProfileImageUrl()}
                  alt="Profile preview"
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border-2 border-gray-300"
                />
              </div>
            </div>
            
            {/* Form Fields Section */}
            <div className="lg:col-span-2 order-2 lg:order-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-4 space-y-3 sm:space-y-0">
                  <div>
                    <label htmlFor="trainer_name" className="block text-gray-700 text-sm font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      id="trainer_name"
                      name="trainer_name"
                      value={formData.trainer_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 focus:border-blue-500 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm sm:text-base"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
                
                <div className="sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-4 space-y-3 sm:space-y-0">
                  <div>
                    <label htmlFor="phone_number" className="block text-gray-700 text-sm font-medium mb-1">Phone</label>
                    <input
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-1">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="expertise" className="block text-gray-700 text-sm font-medium mb-1">Expertise *</label>
                  <input
                    type="text"
                    id="expertise"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    placeholder="e.g., Web Development, Data Science, Mobile Apps"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 focus:border-blue-500 text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="bio" className="block text-gray-700 text-sm font-medium mb-1">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 focus:border-blue-500 text-sm sm:text-base resize-vertical"
                  ></textarea>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setAvatar(null);
                    setError('');
                    fetchTrainerDetails(); // Reset form data
                  }}
                  disabled={updating}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm sm:text-base transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Profile Picture and Basic Info */}
          <div className="lg:col-span-1 flex flex-col items-center text-center lg:text-left lg:items-start">
            <div className="flex flex-col items-center mb-4">
              <img
                src={getProfileImageUrl()}
                alt="Profile"
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-cover rounded-full border-2 border-gray-300 mb-3 sm:mb-4"
              />
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {formData.trainer_name || 'Not provided'}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 break-all">
                  {formData.email || 'No email'}
                </p>
              </div>
            </div>
            
            {/* Quick Info Cards on Mobile */}
            <div className="lg:hidden w-full space-y-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</h4>
                <p className="text-sm text-gray-900 mt-1">{formData.phone_number || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</h4>
                <p className="text-sm text-gray-900 mt-1">{formData.location || 'Not provided'}</p>
              </div>
            </div>
          </div>
          
          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">About</h3>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {formData.bio || 'No bio available. Click "Edit Profile" to add information about yourself.'}
                </p>
              </div>
            </div>
            
            {/* Details Grid - Hidden on Mobile */}
            <div className="hidden lg:block">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Details</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                  <p className="text-gray-900">{formData.phone_number || 'Not provided'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                  <p className="text-gray-900">{formData.location || 'Not provided'}</p>
                </div>
                <div className="xl:col-span-2 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Expertise</h4>
                  <p className="text-gray-900">{formData.expertise || 'Not specified'}</p>
                </div>
              </div>
            </div>
            
            {/* Expertise Section for Mobile */}
            <div className="lg:hidden">
              <h3 className="text-base font-medium text-gray-900 mb-2">Expertise</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-900">
                  {formData.expertise || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerProfile;