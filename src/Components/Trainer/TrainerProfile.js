import React, { useState } from 'react';
import FileUpload from '../Common/FileUpload';

const TrainerProfile = () => {
  const [formData, setFormData] = useState({
    trainer_name: '',
    email: '',
    bio: '',
    location: '',
    phone_number: '',
    expertise: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file) => {
    setAvatar(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

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

      {isEditing ? (
        /* Edit Form */
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1 order-1 lg:order-none">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Profile Picture</label>
                <FileUpload 
                  onFileSelect={handleFileSelect} 
                  accept="image/*"
                  label="Upload profile picture"
                />
                {avatar && (
                  <p className="mt-2 text-sm text-gray-600">Selected: {avatar.name}</p>
                )}
              </div>
              
              {/* Preview on mobile */}
              <div className="lg:hidden flex justify-center mb-4">
                <img
                  src={avatar ? URL.createObjectURL(avatar) : '/default-avatar.png'}
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
                    <label htmlFor="trainer_name" className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
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
                  <label htmlFor="expertise" className="block text-gray-700 text-sm font-medium mb-1">Expertise</label>
                  <input
                    type="text"
                    id="expertise"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    placeholder="e.g., Web Development, Data Science, Mobile Apps"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 focus:border-blue-500 text-sm sm:text-base"
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
                  onClick={() => setIsEditing(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm sm:text-base transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base transition-colors"
                >
                  Save Changes
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
                src={avatar ? URL.createObjectURL(avatar) : '/default-avatar.png'}
                alt="Profile"
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-cover rounded-full border-2 border-gray-300 mb-3 sm:mb-4"
              />
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {formData.trainer_name || 'Your Name'}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 break-all">
                  {formData.email || 'your.email@example.com'}
                </p>
              </div>
            </div>
            
            {/* Quick Info Cards on Mobile */}
            <div className="lg:hidden w-full space-y-3 mb-6">
              {formData.phone_number && (
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</h4>
                  <p className="text-sm text-gray-900 mt-1">{formData.phone_number}</p>
                </div>
              )}
              {formData.location && (
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</h4>
                  <p className="text-sm text-gray-900 mt-1">{formData.location}</p>
                </div>
              )}
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
            
            {/* Details Grid - Hidden on Mobile (shown in cards above) */}
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