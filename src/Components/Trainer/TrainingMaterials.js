// src/components/Trainer/TrainingMaterials.js
import React, { useState, useEffect } from 'react';
import { FaPlus, FaSave, FaSpinner, FaEdit, FaTrash } from 'react-icons/fa';
import FileUpload from '../Common/FileUpload';

const TrainingMaterials = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    course_id: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('');
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const API_BASE_URL = 'https://hydersoft.com/api';

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // After courses load, select first course and fetch materials
  useEffect(() => {
    if (courses.length > 0) {
      const firstCourseId = courses[0].course_id;
      setSelectedCourseFilter(firstCourseId);
      fetchMaterials(firstCourseId);
    }
  }, [courses]);

  // Fetch all courses
  const fetchCourses = async () => {
    setCoursesLoading(true);
    setUploadError('');
    try {
      const response = await fetch(`${API_BASE_URL}/courses/getcourse`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(Array.isArray(data) ? data : data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setUploadError('Failed to load courses. Please try again.');
    } finally {
      setCoursesLoading(false);
    }
  };

  // Fetch materials for a specific course
  const fetchMaterials = async (courseId) => {
    if (!courseId) {
      setMaterials([]);
      return;
    }
    setMaterialsLoading(true);
    setUploadError('');
    try {
      const response = await fetch(`${API_BASE_URL}/trainer/courses/${courseId}/materials`);
      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }
      const data = await response.json();
      let materialsData = data.materials || data;
      if (!Array.isArray(materialsData)) {
        materialsData = [];
      }
      // Map course_name to materials for display
      materialsData = materialsData.map(m => ({
        ...m,
        course_name: getCourseTitle(m.course_id)
      }));
      setMaterials(materialsData);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setUploadError('Failed to load materials. Please try again.');
      setMaterials([]);
    } finally {
      setMaterialsLoading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Format date
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  // Get course title
  const getCourseTitle = (courseId) => {
    const course = courses.find(c => c.course_id == courseId);
    return course ? (course.course_name || course.title || course.name) : 'Unknown Course';
  };

  // Handle course filter change
  const handleCourseFilterChange = (courseId) => {
    setSelectedCourseFilter(courseId);
    if (courseId) {
      fetchMaterials(courseId);
    } else {
      setMaterials([]);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial(prev => ({ ...prev, [name]: value }));
  };

  // Handle file selection and validation
  const handleFileSelect = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Please upload PDF, DOC, DOCX, PPT, or PPTX files only.');
      return;
    }
    if (file.size > 51200 * 1024) {
      setUploadError('File size exceeds 50MB limit.');
      return;
    }
    setSelectedFile(file);
    setUploadError('');
    // Auto fill title if empty
    if (!newMaterial.title) {
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      setNewMaterial(prev => ({ ...prev, title: fileName }));
    }
  };

  // Handle form submit (upload or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadError('');
    if (!editingMaterial && !selectedFile) {
      setUploadError('Please select a file');
      setLoading(false);
      return;
    }
    if (!newMaterial.title || !newMaterial.course_id) {
      setUploadError('Title and course are required');
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      if (selectedFile) formData.append('file', selectedFile);
      formData.append('title', newMaterial.title);
      formData.append('description', newMaterial.description || '');
      formData.append('course_id', newMaterial.course_id);

      const url = editingMaterial
        ? `${API_BASE_URL}/trainer/materials/${editingMaterial.material_id}`
        : `${API_BASE_URL}/trainer/materials`;
      // Your backend update uses POST for update
      const method = 'POST';

      const response = await fetch(url, { method, body: formData });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `${editingMaterial ? 'Update' : 'Upload'} failed`);
      }
      alert(`Material ${editingMaterial ? 'updated' : 'uploaded'} successfully!`);

      resetForm();
      fetchMaterials(newMaterial.course_id);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload material. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit action
  const handleEdit = async (materialId) => {
    if (!materialId) {
      alert('Invalid material selected for editing.');
      return;
    }
    try {
      // Use the parameter materialId correctly
      const response = await fetch(`${API_BASE_URL}/trainer/materials/${materialId}`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to fetch material details');
      }
      const data = await response.json();
      const material = data.material || data;

      // Set the full material object in state
      setEditingMaterial(material);

      // Initialize the form state with material data
      setNewMaterial({
        title: material.title,
        description: material.description || '',
        course_id: material.course_id,
      });

      setSelectedFile(null);
      setShowEdit(true);
      setUploadError('');
    } catch (error) {
      console.error('Error fetching material details:', error);
      alert('Failed to load material details for editing.');
    }
  };


  // Handle delete action
  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      return;
    }
    if (!materialId) {
      alert('Invalid material selected for deletion.');
      return;
    }
    try {
      setDeleteLoading(materialId);
      const response = await fetch(`${API_BASE_URL}/trainer/materials/${materialId}`, { method: 'DELETE' });

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = { message: await response.text() };
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Delete failed');
      }

      alert('Material deleted successfully!');
      fetchMaterials(selectedCourseFilter);
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.message || 'Failed to delete material. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewMaterial({ title: '', description: '', course_id: '' });
    setSelectedFile(null);
    setShowUpload(false);
    setShowEdit(false);
    setEditingMaterial(null);
    setUploadError('');
  };

  // Cancel form
  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header and Add button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Training Materials</h1>
        <button
          onClick={() => setShowUpload(true)}
          disabled={coursesLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Add Material
        </button>
      </div>

      {/* Loading courses */}
      {coursesLoading && (
        <div className="text-center py-4">
          <FaSpinner className="animate-spin inline-block mr-2" /> Loading courses...
        </div>
      )}

      {/* Upload/edit form modal */}
      {(showUpload || showEdit) && !coursesLoading && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">{editingMaterial ? 'Edit Material' : 'Upload New Material'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  File {!editingMaterial && '*'} <span className="text-xs text-gray-500">(PDF, DOC, DOCX, PPT, PPTX - Max 50MB)</span>
                </label>
                <FileUpload onFileSelect={handleFileSelect} />
                {selectedFile && <p className="mt-2 text-sm text-gray-600">Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})</p>}
                {editingMaterial && !selectedFile && <p className="mt-2 text-sm text-gray-500">Leave empty to keep current file</p>}
              </div>

              <div>
                <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">Title *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={newMaterial.title}
                  onChange={handleChange}
                  required
                  placeholder="Material title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="course_id" className="block text-gray-700 text-sm font-medium mb-2">Course *</label>
                <select
                  id="course_id"
                  name="course_id"
                  value={newMaterial.course_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name || course.title}
                    </option>
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
                  rows={3}
                  placeholder="Material description (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {uploadError && (
              <div className="mb-4 p-3 text-red-600 text-sm bg-red-50 border border-red-200 rounded-md">{uploadError}</div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    {editingMaterial ? 'Updating...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    {editingMaterial ? 'Update Material' : 'Save Material'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Materials List with course filter */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Materials List</h2>
          <div className="flex items-center space-x-2">
            <label htmlFor="courseFilter" className="text-sm font-medium text-gray-700">Filter by Course:</label>
            <select
              id="courseFilter"
              value={selectedCourseFilter}
              onChange={(e) => handleCourseFilterChange(e.target.value)}
              disabled={coursesLoading}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_name || course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {materialsLoading ? (
          <div className="text-center py-8">
            <FaSpinner className="animate-spin inline-block mr-2" /> Loading materials...
          </div>
        ) : materials.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {selectedCourseFilter
              ? 'No materials found for the selected course.'
              : 'Please select a course to view materials.'
            }
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materials.map(material => (
                  <tr key={material.material_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{material.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.course_name || getCourseTitle(material.course_id)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{material.description || 'No description'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(material.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${material.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {material.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 items-center">
                        {/* Removed Download button */}
                        <button
                          onClick={() => handleEdit(material.material_id)}
                          title="Edit"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(material.material_id)}
                          title="Delete"
                          disabled={deleteLoading === material.material_id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleteLoading === material.material_id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingMaterials;
