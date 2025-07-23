import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';

function AdminCourses() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [trainerId, setTrainerId] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalCourses, setTotalCourses] = useState(0);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailed_description: '',
    bio: '',
    price: '',
    thumbnail: null,
    course_overview: '',
    what_you_learn: '',
    requirements: '',
    duration: '',
    level: 'beginner',
    course_highlights: '',
    course_content: '',
    is_active: true
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});

  // Toast notification function
  const showToast = (message, type = 'info') => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching data...');

        // Fetch trainers from API
        try {
          const trainersResponse = await fetch('https://hydersoft.com/api/admin/trainer/trainers', {
            headers: { Accept: 'application/json' },
          });

          if (trainersResponse.ok) {
            const trainersData = await trainersResponse.json();
            console.log('Trainers fetched:', trainersData);
            setTrainers(trainersData || []);
          } else {
            console.warn('Failed to fetch trainers');
            setTrainers([]);
          }
        } catch (trainerError) {
          console.warn('Error fetching trainers:', trainerError);
          setTrainers([]);
        }

        // Fetch courses from API
        try {
          const coursesResponse = await fetch('https://hydersoft.com/api/courses/getcourse');

          if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json();
            console.log('Courses fetched:', coursesData);
            setCourses(coursesData || []);
            setTotalCourses((coursesData || []).length);
          } else {
            console.warn('Failed to fetch courses, showing empty state');
            setCourses([]);
            setTotalCourses(0);
          }
        } catch (courseError) {
          console.warn('Error fetching courses:', courseError);
          setCourses([]);
          setTotalCourses(0);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        // Don't set error state, just show empty state
        setCourses([]);
        setTotalCourses(0);
        setTrainers([]);
        showToast('Unable to load data. You can still add courses.', 'warning');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Comprehensive validation function for ALL fields
  const validateForm = () => {
    const errors = {};

    // Title validation
    if (!formData.title || !formData.title.trim()) {
      errors.title = 'Title is required';
    }

    // Description validation
    if (!formData.description || !formData.description.trim()) {
      errors.description = 'Description is required';
    }

    // Detailed description validation
    if (!formData.detailed_description || !formData.detailed_description.trim()) {
      errors.detailed_description = 'Detailed description is required';
    }

    // Bio validation
    if (!formData.bio || !formData.bio.trim()) {
      errors.bio = 'Trainer bio is required';
    }

    // Price validation
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Price is required and must be greater than 0';
    }

    // Course overview validation
    if (!formData.course_overview || !formData.course_overview.trim()) {
      errors.course_overview = 'Course overview is required';
    }

    // What you learn validation
    if (!formData.what_you_learn || !formData.what_you_learn.trim()) {
      errors.what_you_learn = 'What you will learn is required';
    }

    // Requirements validation
    if (!formData.requirements || !formData.requirements.trim()) {
      errors.requirements = 'Requirements are required';
    }

    // Duration validation
    if (!formData.duration || !formData.duration.trim()) {
      errors.duration = 'Duration is required';
    }

    // Course highlights validation
    if (!formData.course_highlights || !formData.course_highlights.trim()) {
      errors.course_highlights = 'Course highlights are required';
    }

    // Level validation
    if (!formData.level || !['beginner', 'intermediate', 'advanced'].includes(formData.level)) {
      errors.level = 'Level is required';
    }

    if (!formData.course_content || !formData.course_content.trim()) {
      errors.course_content = 'Course content are required';
    }

    // Trainer validation
    if (!trainerId) {
      errors.trainerId = 'Trainer selection is required';
    }

    // Thumbnail validation (required for new courses)
    if (!editingCourseId && !formData.thumbnail) {
      errors.thumbnail = 'Thumbnail is required';
    }

    return errors;
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.trainer?.trainer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate filtered courses
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleEdit = (course) => {
    console.log('Editing course:', course);
    setEditingCourseId(course.course_id);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      detailed_description: course.detailed_description || '',
      bio: course.bio || '',
      price: course.price || '',
      thumbnail: null,
      course_overview: course.course_overview || '',
      what_you_learn: course.what_you_learn || '',
      requirements: course.requirements || '',
      duration: course.duration || '',
      level: course.level || 'beginner',
      course_highlights: course.course_highlights || '',
      course_content: course.course_content || '',
      is_active: course.is_active !== undefined ? course.is_active : true
    });
    setTrainerId(course.trainer?.trainer_id || '');
    setValidationErrors({});
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const res = await fetch(`https://hydersoft.com/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast('Course deleted successfully.', 'success');
        const updatedCourses = courses.filter((c) => c.course_id !== courseId);
        setCourses(updatedCourses);
        setTotalCourses(updatedCourses.length);
      } else {
        const error = await res.json();
        showToast(error.message || 'Failed to delete course', 'error');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Something went wrong while deleting.', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (name === 'thumbnail') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTrainerChange = (e) => {
    setTrainerId(e.target.value);
    if (validationErrors.trainerId) {
      setValidationErrors(prev => ({ ...prev, trainerId: '' }));
    }
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
      setValidationErrors(errors);
      showToast('Please fill in all required fields marked with *', 'error');
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();

    // Append every field to FormData — force empty string if field is undefined/null
    data.append('title', formData.title || '');
    data.append('description', formData.description || '');
    data.append('detailed_description', formData.detailed_description || '');
    data.append('bio', formData.bio || '');
    data.append('price', formData.price || '');
    data.append('course_overview', formData.course_overview || '');
    data.append('what_you_learn', formData.what_you_learn || '');
    data.append('requirements', formData.requirements || '');
    data.append('duration', formData.duration || '');
    data.append('level', formData.level || 'beginner');
    data.append('course_highlights', formData.course_highlights || '');
    data.append('course_content', formData.course_content || '');
    data.append('is_active', formData.is_active ? '1' : '0');
    data.append('trainer_id', parseInt(trainerId, 10));

    // Only append thumbnail if selected
    if (formData.thumbnail) {
      data.append('thumbnail', formData.thumbnail);
    }

    let url = 'https://hydersoft.com/api/courses/uploadcourse';
    let method = 'POST';

    if (editingCourseId) {
      data.append('_method', 'PUT');
      url = `https://hydersoft.com/api/courses/${editingCourseId}`;
    }

    try {
      const response = await fetch(url, {
        method,
        body: data,
        headers: {
          Accept: 'application/json',
        },
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          showToast(error.message || 'Upload failed', 'error');
        } else {
          showToast('Server returned an unexpected response.', 'error');
        }
        return;
      }

      await response.json();

      // Refresh courses
      const coursesResponse = await fetch('https://hydersoft.com/api/courses/getcourse');
      const coursesData = await coursesResponse.json();
      setCourses(coursesData);
      setTotalCourses(coursesData.length);

      showToast(editingCourseId ? 'Course updated successfully!' : 'Course uploaded successfully!', 'success');

      // Reset form
      setShowForm(false);
      setEditingCourseId(null);
      setFormData({
        title: '',
        description: '',
        detailed_description: '',
        bio: '',
        price: '',
        thumbnail: null,
        course_overview: '',
        what_you_learn: '',
        requirements: '',
        duration: '',
        level: 'beginner',
        course_highlights: '',
        course_content: '',
        is_active: true
      });
      setTrainerId('');
      setValidationErrors({});

    } catch (err) {
      console.error('Upload error:', err);
      showToast('Something went wrong: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleAddNew = () => {
    setEditingCourseId(null);
    setFormData({
      title: '',
      description: '',
      detailed_description: '',
      bio: '',
      price: '',
      thumbnail: null,
      course_overview: '',
      what_you_learn: '',
      requirements: '',
      duration: '',
      level: 'beginner',
      course_highlights: '',
      course_content: '',
      is_active: true
    });
    setTrainerId('');
    setValidationErrors({});
    setShowForm(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading courses...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Courses ({totalCourses})</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> Add Course
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow p-4 md:p-6 lg:p-8">
        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-2 md:px-4 py-3 font-medium text-gray-900 text-sm md:text-base">ID</th>
                <th className="text-left px-2 md:px-4 py-3 font-medium text-gray-900 text-sm md:text-base">Title</th>
                <th className="text-left px-2 md:px-4 py-3 font-medium text-gray-900 text-sm md:text-base hidden lg:table-cell">Trainer</th>
                <th className="text-left px-2 md:px-4 py-3 font-medium text-gray-900 text-sm md:text-base">Price</th>
                <th className="text-left px-2 md:px-4 py-3 font-medium text-gray-900 text-sm md:text-base hidden lg:table-cell">Level</th>
                <th className="text-left px-2 md:px-4 py-3 font-medium text-gray-900 text-sm md:text-base">Active</th>
                <th className="text-left px-2 md:px-4 py-3 font-medium text-gray-900 text-sm md:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCourses.length > 0 ? (
                paginatedCourses.map((course) => (
                  <tr key={course.course_id} className="border-b hover:bg-gray-50">
                    <td className="px-2 md:px-4 py-3 text-gray-900 text-sm md:text-base">{course.course_id}</td>
                    <td className="px-2 md:px-4 py-3 text-gray-900 text-sm md:text-base">
                      <div>
                        <div>{course.title}</div>
                        <div className="lg:hidden text-xs text-gray-500 mt-1">
                          {course.trainer?.trainer_name || 'N/A'} • {course.level}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-3 text-gray-600 text-sm md:text-base hidden lg:table-cell">{course.trainer?.trainer_name || 'N/A'}</td>
                    <td className="px-2 md:px-4 py-3 text-gray-900 text-sm md:text-base font-medium">${course.price}</td>
                    <td className="px-2 md:px-4 py-3 text-gray-600 capitalize text-sm md:text-base hidden lg:table-cell">{course.level}</td>
                    <td className="px-2 md:px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {course.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-3">
                      <div className="flex gap-1 md:gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit course"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(course.course_id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete course"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="text-4xl md:text-6xl mb-4">📚</div>
                      <h3 className="text-lg font-medium mb-2">No courses found</h3>
                      <p className="text-sm mb-4 max-w-md">
                        {searchTerm
                          ? `No courses match "${searchTerm}". Try a different search term.`
                          : 'Get started by adding your first course.'
                        }
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={handleAddNew}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus size={16} /> Add Your First Course
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden">
          {paginatedCourses.length > 0 ? (
            <div className="space-y-4">
              {paginatedCourses.map((course) => (
                <div key={course.course_id} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-500">ID: {course.course_id}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-blue-600 hover:text-blue-800 p-2 bg-white rounded-lg shadow-sm"
                        title="Edit course"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(course.course_id)}
                        className="text-red-600 hover:text-red-800 p-2 bg-white rounded-lg shadow-sm"
                        title="Delete course"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Trainer</p>
                      <p className="text-sm text-gray-900">{course.trainer?.trainer_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Price</p>
                      <p className="text-sm font-medium text-gray-900">${course.price}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Level</p>
                      <p className="text-sm text-gray-900 capitalize">{course.level}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {course.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium mb-2">No courses found</h3>
              <p className="text-sm mb-4 text-center px-4">
                {searchTerm
                  ? `No courses match "${searchTerm}". Try a different search term.`
                  : 'Get started by adding your first course.'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} /> Add Your First Course
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pagination would go here if needed */}
      {filteredCourses.length > perPage && (
        <div className="mt-6 flex justify-center">
          <div className="text-sm text-gray-600">
            Showing {Math.min(filteredCourses.length, perPage)} of {filteredCourses.length} courses
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh] relative mx-4">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowForm(false);
                setEditingCourseId(null);
                setValidationErrors({});
              }}
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {editingCourseId ? 'Edit Course' : 'Add New Course'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter course title"
                  required
                />
                {validationErrors.title && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter course description"
                  required
                  rows="3"
                />
                {validationErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="detailed_description"
                  value={formData.detailed_description}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.detailed_description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter detailed course description"
                  required
                  rows="4"
                />
                {validationErrors.detailed_description && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.detailed_description}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Course OverView <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="course_overview"
                  value={formData.course_overview}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.course_overview ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter detailed course description"
                  required
                  rows="4"
                />
                {validationErrors.course_overview && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.course_overview}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  what_you_learn <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="what_you_learn"
                  value={formData.what_you_learn}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.what_you_learn ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter detailed course description"
                  required
                  rows="4"
                />
                {validationErrors.what_you_learn && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.what_you_learn}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.requirements ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter detailed course description"
                  required
                  rows="4"
                />
                {validationErrors.requirements && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.requirements}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Course Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="course_content"
                  value={formData.course_content}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.course_content ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter detailed course description"
                  required
                  rows="4"
                />
                {validationErrors.course_content && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.course_content}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Course Highlights<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="course_highlights"
                  value={formData.course_highlights}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.course_highlights ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter detailed course description"
                  required
                  rows="4"
                />
                {validationErrors.course_highlights && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.course_highlights}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Trainer Bio<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.bio ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter detailed course description"
                  required
                  rows="4"
                />
                {validationErrors.bio && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.bio}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                  />
                  {validationErrors.price && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.duration ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="e.g., 4 weeks, 10 hours"
                    required
                  />
                  {validationErrors.duration && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.duration}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.level ? 'border-red-500' : 'border-gray-300'
                      }`}
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {validationErrors.level && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.level}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Trainer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={trainerId}
                    onChange={handleTrainerChange}
                    className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.trainerId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    required
                  >
                    <option value="">Select Trainer</option>
                    {trainers.map(trainer => (
                      <option key={trainer.trainer_id} value={trainer.trainer_id}>
                        {trainer.trainer_name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.trainerId && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.trainerId}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Thumbnail <span className="text-red-500">*</span>
                  {editingCourseId && (
                    <span className="text-gray-500 text-sm"> (leave empty to keep current)</span>
                  )}
                </label>
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.thumbnail ? 'border-red-500' : 'border-gray-300'
                    }`}
                  required={!editingCourseId}
                  accept="image/*"
                />
                {validationErrors.thumbnail && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.thumbnail}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="rounded focus:ring-2 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Course is Active
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCourseId(null);
                    setValidationErrors({});
                  }}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:bg-gray-400 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : (editingCourseId ? 'Update Course' : 'Submit Course')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCourses;