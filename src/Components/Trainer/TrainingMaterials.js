import React, { useState, useEffect } from 'react';

function MaterialUploader() {
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(''); // New date state
  const [file, setFile] = useState(null);
  const [courseId, setCourseId] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingMaterial, setDeletingMaterial] = useState(null);

  // Get authentication token from localStorage
  const token = localStorage.getItem('authToken');
  const trainerUser = JSON.parse(localStorage.getItem('trainerUser') || '{}');

  // File validation function
  const validateFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid file (PDF, DOC, DOCX, PPT, PPTX)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 50MB';
    }

    return null;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Handle file selection with validation
  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      const error = validateFile(selectedFile);
      if (error) {
        setUploadMessage(error);
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setUploadMessage('');
      
      // Auto-fill title if empty
      if (!title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
        setTitle(fileName);
      }
    }
  };

  // Get file URL helper function
  const getFileUrl = (material) => {
    if (material.file_path) {
      return `https://hydersoft.com/storage/${material.file_path}`;
    }
    return null;
  };

  // Check authentication
  const checkAuth = () => {
    if (!token) {
      setUploadMessage('Please log in to access this feature');
      return false;
    }
    return true;
  };

  // Fetch courses with proper auth headers
  useEffect(() => {
    const fetchCourses = async () => {
      if (!checkAuth()) return;

      try {
        const response = await fetch('https://hydersoft.com/api/courses/trainer/my-courses', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: HTTP ${response.status}`);
        }
        
        const result = await response.json();
        const coursesData = result.data || result;
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        
      } catch (error) {
        console.error('Error fetching courses:', error);
        setUploadMessage(error.message);
        setTimeout(() => setUploadMessage(''), 5000);
      }
    };

    fetchCourses();
  }, [token]);

  // Fetch materials when courseId changes
  useEffect(() => {
    if (courseId && token) {
      fetchMaterials();
    } else {
      setMaterials([]);
    }
  }, [courseId, token]);

  // Fetch materials function
  const fetchMaterials = async () => {
    if (!courseId || !checkAuth()) return;

    setLoading(true);
    try {
      const response = await fetch(`https://hydersoft.com/api/trainer/courses/${courseId}/materials`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch materials: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const materialData = Array.isArray(data) ? data : [];
      setMaterials(materialData);
      
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMaterials([]);
      setUploadMessage(error.message);
      setTimeout(() => setUploadMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Upload with progress tracking
  const uploadWithProgress = (formData, url, method = 'POST') => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed: HTTP ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
      
      xhr.open(method, url);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  };

  // Enhanced upload handler
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!checkAuth()) return;

    if (!file && !editingMaterial) {
      setUploadMessage('Please select a file.');
      return;
    }

    if (!title || !courseId) {
      setUploadMessage('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('course_id', courseId);
    
    // Add date to form data
    if (date) {
      formData.append('date', date);
    }

    if (file) {
      formData.append('file', file);
    }

    setUploading(true);
    setUploadProgress(0);
    
    try {
      let result;
      
      if (editingMaterial) {
        // Update existing material
        result = await uploadWithProgress(
          formData, 
          `https://hydersoft.com/api/trainer/materials/${editingMaterial.material_id || editingMaterial.id}`,
          'POST'
        );
      } else {
        // Upload new material
        result = await uploadWithProgress(
          formData, 
          'https://hydersoft.com/api/trainer/materials',
          'POST'
        );
      }

      console.log('Upload/Update result:', result);

      // Handle backend response structure
      if (result.success) {
        setUploadSuccess(`✅ ${result.message}`);
        setUploadMessage('');
      } else {
        throw new Error(result.error || (editingMaterial ? 'Update failed' : 'Upload failed'));
      }
      
      setTimeout(() => setUploadSuccess(''), 4000);

      // Reset form
      resetForm();
      fetchMaterials();

    } catch (error) {
      setUploadSuccess('');
      setUploadMessage(error.message || (editingMaterial ? 'Update failed' : 'Upload failed'));
      console.error(editingMaterial ? 'Update error:' : 'Upload error:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    if (!checkAuth()) return;

    setDeletingMaterial(id);
    try {
      const response = await fetch(`https://hydersoft.com/api/trainer/materials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed: HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setUploadSuccess(`✅ ${result.message}`);
        setTimeout(() => setUploadSuccess(''), 3000);
        fetchMaterials();
      } else {
        throw new Error(result.error || 'Delete failed');
      }
      
    } catch (error) {
      console.error('Error deleting material:', error);
      setUploadMessage(error.message);
      setTimeout(() => setUploadMessage(''), 3000);
    } finally {
      setDeletingMaterial(null);
    }
  };

  const handleEdit = (materialToEdit) => {
    setEditingMaterial(materialToEdit);
    setTitle(materialToEdit.title);
    setDescription(materialToEdit.description || '');
    setDate(materialToEdit.date || ''); // Set date for editing
    setCourseId(materialToEdit.course_id);
    setFile(null);
    setShowModal(true);
    setUploadMessage('');
    setUploadSuccess('');
  };

  const handleCourseChange = (selectedCourseId) => {
    setCourseId(selectedCourseId);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate(''); // Reset date
    setFile(null);
    setEditingMaterial(null);
    setShowModal(false);
    setUploadProgress(0);
  };

  const handleModalClose = () => {
    resetForm();
    setUploadMessage('');
    setUploadSuccess('');
  };

  // Show login message if not authenticated
  if (!token) {
    return (
      <div className="p-6 max-w-full">
        <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p>Please log in as a trainer to access the material uploader.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Material Management</h1>
        <p className="text-gray-600">Manage materials for your assigned courses</p>
        {trainerUser.name && (
          <p className="text-sm text-gray-500">Logged in as: {trainerUser.name}</p>
        )}
      </div>

      {/* Course Selection */}
      <div className="mb-4 sm:mb-6">
        <label className="block mb-2 font-medium text-sm sm:text-base">Select Course to View Materials:</label>
        <select
          className="w-full sm:max-w-md border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          value={courseId}
          onChange={e => handleCourseChange(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.course_id} value={course.course_id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Button */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold lg:hidden">Materials</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Upload Material
        </button>
      </div>

      {/* Error Message */}
      {uploadMessage && (
        <div className="mb-4 text-red-700 bg-red-100 border border-red-300 px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base">
          {uploadMessage}
        </div>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <div className="mb-4 text-green-700 bg-green-100 border border-green-300 px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base">
          {uploadSuccess}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-4 text-blue-700 bg-blue-100 border border-blue-300 px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading materials...
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Course ID</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Title</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Description</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Date</th> {/* New Date Column */}
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">File</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!courseId ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">Please select a course to view materials.</td>
              </tr>
            ) : Array.isArray(materials) && materials.length > 0 ? (
              materials.map(material => (
                <tr key={material.material_id || material.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 border text-center text-sm">{material.course_id}</td>
                  <td className="px-4 py-3 border text-sm font-medium">{material.title}</td>
                  <td className="px-4 py-3 border text-sm max-w-xs truncate" title={material.description}>
                    {material.description || '-'}
                  </td>
                  <td className="px-4 py-3 border text-sm text-center">{formatDate(material.date)}</td> {/* Display Date */}
                  <td className="px-4 py-3 border text-blue-600 underline text-sm">
                    {getFileUrl(material) ? (
                      <a href={getFileUrl(material)} target="_blank" rel="noreferrer" className="hover:text-blue-800">Download</a>
                    ) : (
                      <span className="text-gray-500">No file</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border text-center">
                    <span
                      onClick={() => handleEdit(material)}
                      className="cursor-pointer text-blue-600 hover:text-blue-800 mr-2 text-lg"
                      title="Edit material"
                    >
                      ✏️
                    </span>
                    <span
                      onClick={() => handleDelete(material.material_id || material.id)}
                      className={`cursor-pointer hover:text-red-800 text-lg ${
                        deletingMaterial === (material.material_id || material.id) 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-red-600'
                      }`}
                      title={deletingMaterial === (material.material_id || material.id) ? "Deleting..." : "Delete material"}
                    >
                      {deletingMaterial === (material.material_id || material.id) ? '⏳' : '🗑️'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  {courseId ? 'No materials uploaded yet for this course.' : 'Select a course to view materials.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {!courseId ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            Please select a course to view materials.
          </div>
        ) : Array.isArray(materials) && materials.length > 0 ? (
          <div className="space-y-4">
            {materials.map(material => (
              <div key={material.material_id || material.id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-base text-gray-900 flex-1 mr-2">{material.title}</h3>
                  <div className="flex space-x-2 flex-shrink-0">
                    <span
                      onClick={() => handleEdit(material)}
                      className="cursor-pointer text-blue-600 hover:text-blue-800 text-lg"
                      title="Edit material"
                    >
                      ✏️
                    </span>
                    <span
                      onClick={() => handleDelete(material.material_id || material.id)}
                      className={`cursor-pointer hover:text-red-800 text-lg ${
                        deletingMaterial === (material.material_id || material.id) 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-red-600'
                      }`}
                      title={deletingMaterial === (material.material_id || material.id) ? "Deleting..." : "Delete material"}
                    >
                      {deletingMaterial === (material.material_id || material.id) ? '⏳' : '🗑️'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course ID:</span>
                    <span className="font-medium">{material.course_id}</span>
                  </div>
                  
                  {material.description && (
                    <div>
                      <span className="text-gray-600">Description:</span>
                      <p className="text-gray-900 mt-1">{material.description}</p>
                    </div>
                  )}

                  {/* Date in Mobile View */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(material.date)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">File:</span>
                    {getFileUrl(material) ? (
                      <a 
                        href={getFileUrl(material)} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-600 underline hover:text-blue-800 font-medium"
                      >
                        Download File
                      </a>
                    ) : (
                      <span className="text-gray-500">No file</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            {courseId ? 'No materials uploaded yet for this course.' : 'Select a course to view materials.'}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {editingMaterial ? 'Edit Material' : 'Upload Material'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Course *</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  value={courseId}
                  onChange={e => setCourseId(e.target.value)}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Title *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter material title"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Description</label>
                <textarea
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base h-20 sm:h-24 resize-vertical"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter material description..."
                ></textarea>
              </div>

              {/* New Date Field */}
              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Select the date for this material (optional)
                </p>
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">
                  {editingMaterial ? 'Upload New File (optional)' : 'Upload File *'}
                </label>
                <input
                  type="file"
                  className="w-full text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={e => handleFileChange(e.target.files[0])}
                  required={!editingMaterial}
                />
                {editingMaterial && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Leave empty to keep the current file
                  </p>
                )}
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX, PPT, PPTX (Max: 50MB)
                </p>
              </div>

              {/* Upload Progress */}
              {uploading && uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Upload Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {uploadMessage && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {uploadMessage}
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="w-full sm:w-auto bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors text-sm sm:text-base"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={uploading || !title || !courseId || (!file && !editingMaterial)}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingMaterial ? 'Updating...' : 'Uploading...'}
                    </span>
                  ) : (
                    editingMaterial ? 'Update' : 'Upload'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaterialUploader;
