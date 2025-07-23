// src/components/Trainer/TrainingMaterials.js
import React, { useState } from 'react';
import { FaPlus, FaSave } from 'react-icons/fa';
import FileUpload from '../Common/FileUpload';

const TrainingMaterials = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    description: '',
    course: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const courses = [
    { id: 1, title: 'React Fundamentals' },
    { id: 2, title: 'Advanced JavaScript' },
    { id: 3, title: 'Node.js Backend Development' }
  ];

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadError('');
    if (!newMaterial.name) {
      setNewMaterial(prev => ({ ...prev, name: file.name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setUploadError('Please select a file');
      return;
    }

    if (!newMaterial.name || !newMaterial.course) {
      setUploadError('Name and course are required');
      return;
    }

    // You can replace this with your API submission logic
    console.log('Uploaded Material:', {
      ...newMaterial,
      size: formatFileSize(selectedFile.size),
      date: new Date().toISOString().split('T')[0]
    });

    // Reset
    setNewMaterial({ name: '', description: '', course: '' });
    setSelectedFile(null);
    setShowUpload(false);
    setUploadError('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Training Materials</h1>
        <button 
          onClick={() => setShowUpload(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Add Material
        </button>
      </div>

      {showUpload && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload New Material</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">File *</label>
                <FileUpload onFileSelect={handleFileSelect} />
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newMaterial.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Material name"
                />
              </div>

              <div>
                <label htmlFor="course" className="block text-gray-700 text-sm font-medium mb-2">Course *</label>
                <select
                  id="course"
                  name="course"
                  value={newMaterial.course}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.title}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newMaterial.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Material description"
                ></textarea>
              </div>
            </div>

            {uploadError && (
              <div className="mb-4 text-red-600 text-sm">{uploadError}</div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowUpload(false);
                  setSelectedFile(null);
                  setUploadError('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <FaSave className="mr-2" /> Save Material
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TrainingMaterials;
