import React, { useState, useEffect } from 'react';

function TrainingInfo() {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [duration, setDuration] = useState('60');
  const [zoomLink, setZoomLink] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [courseId, setCourseId] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);

  // Get authentication token from localStorage
  const token = localStorage.getItem('authToken');
  const trainerUser = JSON.parse(localStorage.getItem('trainerUser') || '{}');

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

  // Fetch classes when courseId changes
  useEffect(() => {
    if (courseId && token) {
      fetchClasses();
    } else if (token) {
      fetchAllClasses();
    }
  }, [courseId, token]);

  // Fetch classes for specific course
  // Update the fetchClasses function
  const fetchClasses = async () => {
    if (!courseId || !checkAuth()) return;

    setLoading(true);
    try {
      // ✅ Use the new consistent route
      const response = await fetch(`https://hydersoft.com/api/trainer/courses/${courseId}/classes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch classes: HTTP ${response.status}`);
      }

      const data = await response.json();
      const classData = Array.isArray(data) ? data : [];
      setClasses(classData);

    } catch (error) {
      // console.error('Error fetching classes:', error);
      setClasses([]);
      setUploadMessage(error.message);
      setTimeout(() => setUploadMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Update the fetchAllClasses function
  const fetchAllClasses = async () => {
    if (!checkAuth()) return;

    setLoading(true);
    try {
      // ✅ Use the new route for all trainer classes
      const response = await fetch('https://hydersoft.com/api/trainer/classes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch classes: HTTP ${response.status}`);
      }

      const data = await response.json();
      const classData = Array.isArray(data) ? data : [];
      setClasses(classData);

    } catch (error) {
      // console.error('Error fetching all classes:', error);
      setClasses([]);
      setUploadMessage(error.message);
      setTimeout(() => setUploadMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkAuth()) return;

    if (!title || !courseId || !scheduleDate || !duration || !zoomLink) {
      setUploadMessage('Please fill in all required fields.');
      return;
    }

    const classData = {
      course_id: courseId,
      title,
      description,
      schedule_date: scheduleDate,
      duration: parseInt(duration),
      zoom_link: zoomLink,
      is_active: isActive
    };

    setSubmitting(true);
    setUploadMessage('');

    try {
      let response;

      if (editingClass) {
        // ✅ Use the new consistent update route
        response = await fetch(`https://hydersoft.com/api/trainer/classes/${editingClass.class_id || editingClass.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(classData)
        });
      } else {
        // ✅ Use the new consistent create route
        response = await fetch('https://hydersoft.com/api/trainer/classes', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(classData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setUploadSuccess(`✅ ${result.message}`);
        setUploadMessage('');
      } else {
        throw new Error(result.error || (editingClass ? 'Update failed' : 'Create failed'));
      }

      setTimeout(() => setUploadSuccess(''), 4000);

      resetForm();

      if (courseId) {
        fetchClasses();
      } else {
        fetchAllClasses();
      }

    } catch (error) {
      setUploadSuccess('');
      setUploadMessage(error.message || (editingClass ? 'Update failed' : 'Create failed'));
      console.error(editingClass ? 'Update error:' : 'Create error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Update the handleDelete function
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    if (!checkAuth()) return;

    setDeletingClass(id);
    try {
      // ✅ Use the new consistent delete route
      const response = await fetch(`https://hydersoft.com/api/trainer/classes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Delete failed: HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setUploadSuccess(`✅ ${result.message}`);
        setTimeout(() => setUploadSuccess(''), 3000);

        if (courseId) {
          fetchClasses();
        } else {
          fetchAllClasses();
        }
      } else {
        throw new Error(result.error || 'Delete failed');
      }

    } catch (error) {
      console.error('Error deleting class:', error);
      setUploadMessage(error.message);
      setTimeout(() => setUploadMessage(''), 3000);
    } finally {
      setDeletingClass(null);
    }
  };


  const handleEdit = (classToEdit) => {
    setEditingClass(classToEdit);
    setTitle(classToEdit.title);
    setDescription(classToEdit.description || '');
    setScheduleDate(classToEdit.schedule_date);
    setDuration(classToEdit.duration.toString());
    setZoomLink(classToEdit.zoom_link);
    setIsActive(classToEdit.is_active);
    setCourseId(classToEdit.course_id);
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
    setScheduleDate('');
    setDuration('60');
    setZoomLink('');
    setIsActive(true);
    setEditingClass(null);
    setShowModal(false);
  };

  const handleModalClose = () => {
    resetForm();
    setUploadMessage('');
    setUploadSuccess('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.course_id === courseId);
    return course ? course.title : `Course ${courseId}`;
  };

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Show login message if not authenticated
  if (!token) {
    return (
      <div className="p-6 max-w-full">
        <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p>Please log in as a trainer to access the class scheduler.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Class Schedule Management</h1>
        <p className="text-gray-600">Manage class schedules for your assigned courses</p>
        {trainerUser.name && (
          <p className="text-sm text-gray-500">Logged in as: {trainerUser.name}</p>
        )}
      </div>

      {/* Course Selection */}
      <div className="mb-4 sm:mb-6">
        <label className="block mb-2 font-medium text-sm sm:text-base">Filter by Course:</label>
        <select
          className="w-full sm:max-w-md border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          value={courseId}
          onChange={e => handleCourseChange(e.target.value)}
        >
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.course_id} value={course.course_id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Create Button */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold lg:hidden">Classes</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Schedule Class
        </button>
      </div>

      {/* Error Message */}
      {/* {uploadMessage && (
        <div className="mb-4 text-red-700 bg-red-100 border border-red-300 px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base">
          {uploadMessage}
        </div>
      )} */}

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
          Loading classes...
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Course</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Title</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Date</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Duration</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Zoom Link</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Active</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(classes) && classes.length > 0 ? (
              classes.map(classItem => (
                <tr key={classItem.class_id || classItem.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 border text-sm">{getCourseName(classItem.course_id)}</td>
                  <td className="px-4 py-3 border text-sm font-medium">{classItem.title}</td>
                  <td className="px-4 py-3 border text-sm">{formatDate(classItem.schedule_date)}</td>
                  <td className="px-4 py-3 border text-center text-sm">{classItem.duration} min</td>
                  <td className="px-4 py-3 border text-blue-600 underline text-sm">
                    {classItem.zoom_link ? (
                      <a href={classItem.zoom_link} target="_blank" rel="noreferrer" className="hover:text-blue-800">Join</a>
                    ) : (
                      <span className="text-gray-500">No link</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border text-center text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${classItem.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {classItem.is_active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 border text-center">
                    <span
                      onClick={() => handleEdit(classItem)}
                      className="cursor-pointer text-blue-600 hover:text-blue-800 mr-2 text-lg"
                      title="Edit class"
                    >
                      ✏️
                    </span>
                    <span
                      onClick={() => handleDelete(classItem.class_id || classItem.id)}
                      className={`cursor-pointer hover:text-red-800 text-lg ${deletingClass === (classItem.class_id || classItem.id)
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-600'
                        }`}
                      title={deletingClass === (classItem.class_id || classItem.id) ? "Deleting..." : "Delete class"}
                    >
                      {deletingClass === (classItem.class_id || classItem.id) ? '⏳' : '🗑️'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  {courseId ? 'No classes scheduled for this course.' : 'No classes scheduled.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {Array.isArray(classes) && classes.length > 0 ? (
          <div className="space-y-4">
            {classes.map(classItem => (
              <div key={classItem.class_id || classItem.id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-base text-gray-900 flex-1 mr-2">{classItem.title}</h3>
                  <div className="flex space-x-2 flex-shrink-0">
                    <span
                      onClick={() => handleEdit(classItem)}
                      className="cursor-pointer text-blue-600 hover:text-blue-800 text-lg"
                      title="Edit class"
                    >
                      ✏️
                    </span>
                    <span
                      onClick={() => handleDelete(classItem.class_id || classItem.id)}
                      className={`cursor-pointer hover:text-red-800 text-lg ${deletingClass === (classItem.class_id || classItem.id)
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-600'
                        }`}
                      title={deletingClass === (classItem.class_id || classItem.id) ? "Deleting..." : "Delete class"}
                    >
                      {deletingClass === (classItem.class_id || classItem.id) ? '⏳' : '🗑️'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course:</span>
                    <span className="font-medium">{getCourseName(classItem.course_id)}</span>
                  </div>

                  {classItem.description && (
                    <div>
                      <span className="text-gray-600">Description:</span>
                      <p className="text-gray-900 mt-1">{classItem.description}</p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(classItem.schedule_date)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{classItem.duration} minutes</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${classItem.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {classItem.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Zoom Link:</span>
                    {classItem.zoom_link ? (
                      <a
                        href={classItem.zoom_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline hover:text-blue-800 font-medium"
                      >
                        Join Meeting
                      </a>
                    ) : (
                      <span className="text-gray-500">No link</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            {courseId ? 'No classes scheduled for this course.' : 'No classes scheduled.'}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {editingClass ? 'Edit Class' : 'Schedule New Class'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block mb-1 font-medium text-sm sm:text-base">Class Title *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter class title"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Description</label>
                <textarea
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base h-20 sm:h-24 resize-vertical"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter class description..."
                ></textarea>
              </div>

              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Schedule Date *</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  value={scheduleDate}
                  onChange={e => setScheduleDate(e.target.value)}
                  min={getTodayDate()}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Duration (minutes) *</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  min="15"
                  max="480"
                  placeholder="e.g., 60"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Zoom Link *</label>
                <input
                  type="url"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  value={zoomLink}
                  onChange={e => setZoomLink(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm sm:text-base font-medium">
                  Class is Active
                </label>
              </div>

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
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={submitting || !title || !courseId || !scheduleDate || !duration || !zoomLink}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingClass ? 'Updating...' : 'Scheduling...'}
                    </span>
                  ) : (
                    editingClass ? 'Update Class' : 'Schedule Class'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainingInfo;
