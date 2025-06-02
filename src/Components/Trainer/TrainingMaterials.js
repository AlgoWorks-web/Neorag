// src/components/Trainer/TrainingMaterials.js
import React, { useState } from 'react';
import { FaFilePdf, FaFileWord, FaFilePowerpoint, FaFileExcel, FaDownload, FaTrash, FaPlus, FaSave } from 'react-icons/fa';
import FileUpload from '../Common/FileUpload';

const TrainingMaterials = () => {
  const [materials, setMaterials] = useState([
    { id: 1, name: 'React Cheat Sheet.pdf', type: 'pdf', size: '2.4 MB', date: '2023-05-12', course: 'React Fundamentals', description: 'Quick reference guide for React concepts' },
    { id: 2, name: 'JavaScript Basics.docx', type: 'word', size: '1.2 MB', date: '2023-05-10', course: 'Advanced JavaScript', description: 'Introduction to JavaScript fundamentals' },
    { id: 3, name: 'Node.js Presentation.pptx', type: 'ppt', size: '3.8 MB', date: '2023-05-05', course: 'Node.js Backend Development', description: 'Getting started with Node.js' },
    { id: 4, name: 'Course Outline.xlsx', type: 'excel', size: '0.8 MB', date: '2023-05-01', course: 'React Fundamentals', description: 'Detailed course schedule' },
  ]);
  
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

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="text-red-600 text-xl" />;
      case 'word': return <FaFileWord className="text-blue-600 text-xl" />;
      case 'ppt': return <FaFilePowerpoint className="text-orange-500 text-xl" />;
      case 'excel': return <FaFileExcel className="text-green-600 text-xl" />;
      default: return <FaFileWord className="text-gray-500 text-xl" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
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

    const extension = selectedFile.name.split('.').pop().toLowerCase();
    let fileType = 'other';
    if (['pdf'].includes(extension)) fileType = 'pdf';
    else if (['doc', 'docx'].includes(extension)) fileType = 'word';
    else if (['ppt', 'pptx'].includes(extension)) fileType = 'ppt';
    else if (['xls', 'xlsx'].includes(extension)) fileType = 'excel';

    const newMaterialEntry = {
      id: materials.length + 1,
      name: newMaterial.name,
      type: fileType,
      size: formatFileSize(selectedFile.size),
      date: new Date().toISOString().split('T')[0],
      course: newMaterial.course,
      description: newMaterial.description
    };

    setMaterials([...materials, newMaterialEntry]);
    setNewMaterial({ name: '', description: '', course: '' });
    setSelectedFile(null);
    setShowUpload(false);
    setUploadError('');
  };

  const handleDelete = (id) => {
    setMaterials(materials.filter(material => material.id !== id));
  };

  const handleDownload = (material) => {
    alert(`Downloading ${material.name}...`);
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materials.map((material) => (
              <tr key={material.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getFileIcon(material.type)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{material.name}</div>
                      <div className="text-sm text-gray-500">{material.type.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">{material.description}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{material.course}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {material.size}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {material.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDownload(material)}
                    className="text-blue-600 hover:text-blue-900 mx-2"
                    title="Download"
                  >
                    <FaDownload />
                  </button>
                  <button
                    onClick={() => handleDelete(material.id)}
                    className="text-red-600 hover:text-red-900 mx-2"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {materials.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No training materials found</p>
            <button 
              onClick={() => setShowUpload(true)}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Add your first material
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingMaterials;