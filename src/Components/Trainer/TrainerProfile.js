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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
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
            </div>
            
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="trainer_name" className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    id="trainer_name"
                    name="trainer_name"
                    value={formData.trainer_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="phone_number" className="block text-gray-700 text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="expertise" className="block text-gray-700 text-sm font-medium mb-1">Expertise</label>
                  <input
                    type="text"
                    id="expertise"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="bio" className="block text-gray-700 text-sm font-medium mb-1">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center">
            <img
              src={avatar ? URL.createObjectURL(avatar) : '/default-avatar.png'}
              alt=""
              className="w-48 h-48 object-cover rounded-full border-2 border-gray-300 mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">{formData.trainer_name || 'N/A'}</h2>
            <p className="text-gray-600">{formData.email || 'N/A'}</p>
          </div>
          <div className="md:col-span-2">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
              <p className="text-gray-700">{formData.bio || 'No bio available'}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                <p className="text-gray-900">{formData.phone_number || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Location</h4>
                <p className="text-gray-900">{formData.location || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500">Expertise</h4>
                <p className="text-gray-900">{formData.expertise || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerProfile;
