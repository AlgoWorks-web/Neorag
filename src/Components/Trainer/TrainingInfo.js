// src/components/Trainer/TrainingInfo.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TrainingInfo = () => {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [duration, setDuration] = useState('');
  const [zoomLink, setZoomLink] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [courseId, setCourseId] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  // Fix: Extract trainerId properly from localStorage
  const getTrainerId = () => {
    const trainerUser = localStorage.getItem('trainerUser');
    if (trainerUser) {
      try {
        const parsed = JSON.parse(trainerUser);
        return parsed.trainer_id || parsed.id;
      } catch (e) {
        return trainerUser; // If it's already a string/number
      }
    }
    return null;
  };

  const trainerId = getTrainerId();

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('Fetching courses...');
        const response = await axios.get('https://hydersoft.com/api/courses/getcourse', {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log('Courses fetched:', response.data);
        setCourses(Array.isArray(response.data) ? response.data : (response.data.data || []));
      } catch (error) {
        console.error('Error fetching courses:', error);
        setMessage(`Failed to fetch courses: ${error.response?.data?.message || error.message || 'Server connection failed'}`);
      }
    };
    
    fetchCourses();
  }, []);

  // Fetch classes when courseId changes or on component mount
  useEffect(() => {
    if (courseId) {
      fetchClasses();
    } else if (trainerId) {
      fetchAllClasses();
    }
  }, [courseId, trainerId]);

  // Fetch classes for specific course
  const fetchClasses = async () => {
    if (!courseId) return;

    setLoading(true);
    setMessage(''); // Clear previous messages
    
    try {
      console.log(`Fetching classes for course: ${courseId}`);
      
      // Use the working endpoint from Postman
      const endpoint = `https://hydersoft.com/api/trainer/courses/${courseId}/class`;
      console.log(`Using endpoint: ${endpoint}`);
      
      const response = await axios.get(endpoint, {
        timeout: 15000, // 15 second timeout
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Add any auth headers if required
          ...(localStorage.getItem('authToken') && {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          })
        },
        withCredentials: false // Try without credentials first
      });
      
      console.log(`Success with endpoint: ${endpoint}`, response.data);
      const data = response.data;
      setClasses(Array.isArray(data) ? data : (data.data ? data.data : []));
      
    } catch (error) {
      console.error('Error fetching classes:', error);
      
      // Try fallback endpoints if the main one fails
      try {
        console.log('Trying fallback endpoints...');
        const fallbackEndpoints = [
          `https://hydersoft.com/api/trainer/${courseId}/class`,
          `https://hydersoft.com/api/courses/${courseId}/classes`,
          `https://hydersoft.com/api/class?course_id=${courseId}`
        ];

        let fallbackSuccess = false;
        for (const fallbackEndpoint of fallbackEndpoints) {
          try {
            console.log(`Trying fallback: ${fallbackEndpoint}`);
            const fallbackResponse = await axios.get(fallbackEndpoint, {
              timeout: 15000,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              withCredentials: false
            });
            console.log(`Fallback success: ${fallbackEndpoint}`, fallbackResponse.data);
            const fallbackData = fallbackResponse.data;
            setClasses(Array.isArray(fallbackData) ? fallbackData : (fallbackData.data ? fallbackData.data : []));
            fallbackSuccess = true;
            break;
          } catch (fallbackErr) {
            console.log(`Fallback failed: ${fallbackEndpoint}`, fallbackErr.message);
            continue;
          }
        }
        
        if (!fallbackSuccess) {
          throw error; // Use original error if all fallbacks fail
        }
      } catch (finalError) {
        setClasses([]);
        if (finalError.code === 'ERR_NETWORK') {
          setMessage('Network error: Unable to connect to server. Please check your internet connection.');
        } else if (finalError.response?.status === 404) {
          setMessage('No classes found for this course.');
        } else if (finalError.response?.status === 403) {
          setMessage('Access denied. Please check your permissions.');
        } else {
          setMessage(`Failed to fetch classes: ${finalError.response?.data?.message || finalError.message || 'Unknown error'}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Fix: Use the correct API endpoint pattern for fetching all classes for trainer
  const fetchAllClasses = async () => {
    if (!trainerId) {
      setMessage('Trainer ID not found. Please log in again.');
      return;
    }

    setLoading(true);
    setMessage(''); // Clear previous messages
    
    try {
      console.log(`Fetching all classes for trainer: ${trainerId}`);
      
      // Since we know the pattern works with courseId, let's try different approaches
      let response = null;
      let classesData = [];

      // Method 1: If we have courses, fetch classes for each course
      if (courses.length > 0) {
        console.log('Fetching classes for each course...');
        const allClassPromises = courses.map(course => 
          axios.get(`https://hydersoft.com/api/trainer/${course.course_id}/class`, {
            timeout: 15000,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            withCredentials: false
          }).catch(err => {
            console.log(`Failed to fetch classes for course ${course.course_id}:`, err.message);
            return { data: [] }; // Return empty array on error
          })
        );

        const allResponses = await Promise.all(allClassPromises);
        classesData = allResponses.reduce((acc, response) => {
          const data = response.data;
          const classes = Array.isArray(data) ? data : (data.data ? data.data : []);
          return [...acc, ...classes];
        }, []);

        console.log('All classes from courses:', classesData);
      } else {
        // Method 2: Try direct trainer endpoints
        const trainerEndpoints = [
          `https://hydersoft.com/api/trainer/${trainerId}/classes`,
          `https://hydersoft.com/api/trainer/classes?trainer_id=${trainerId}`,
          `https://hydersoft.com/api/classes?trainer_id=${trainerId}`
        ];

        let trainerSuccess = false;
        for (const endpoint of trainerEndpoints) {
          try {
            console.log(`Trying trainer endpoint: ${endpoint}`);
            response = await axios.get(endpoint, {
              timeout: 15000,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              withCredentials: false
            });
            console.log(`Success with trainer endpoint: ${endpoint}`, response.data);
            const data = response.data;
            classesData = Array.isArray(data) ? data : (data.data ? data.data : []);
            trainerSuccess = true;
            break;
          } catch (err) {
            console.log(`Failed with trainer endpoint: ${endpoint}`, err.message);
            continue;
          }
        }

        // if (!trainerSuccess) {
        //   throw new Error('All trainer endpoints failed');
        // }
      }

      // Filter by trainer_id if we got mixed results
      if (classesData.length > 0 && classesData[0].trainer_id) {
        classesData = classesData.filter(cls => 
          cls.trainer_id == trainerId || cls.trainer_id === trainerId
        );
      }

      setClasses(classesData);
      
    } catch (error) {
      console.error('Error fetching all classes:', error);
      setClasses([]);
      
      if (error.code === 'ERR_NETWORK') {
        setMessage('Network error: Unable to connect to server. Please check your internet connection.');
      } else if (error.response?.status === 404) {
        setMessage('No classes found for this trainer.');
      } else if (error.response?.status === 403) {
        setMessage('Access denied. Please check your permissions.');
      } else {
        setMessage(`Failed to fetch classes: ${error.response?.data?.message || error.message || 'Server connection failed. Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !courseId || !scheduleDate || !duration || !zoomLink) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const classData = {
      course_id: courseId,
      title,
      description,
      schedule_date: scheduleDate,
      duration,
      zoom_link: zoomLink,
      is_active: isActive,
      trainer_id: trainerId
    };

    setSubmitting(true);
    setMessage('');
    
    try {
      let response;
      if (editingClass) {
        // Try the working endpoint pattern for updates
        const updateEndpoints = [
          `https://hydersoft.com/api/trainer/courses/${courseId}/class/${editingClass.class_id}`,
          `https://hydersoft.com/api/trainer/updateclass/${editingClass.class_id}`,
          // `https://hydersoft.com/api/class/${editingClass.class_id}`,
          // `https://hydersoft.com/api/classes/${editingClass.class_id}`
        ];
        
        let updateSuccess = false;
        for (const endpoint of updateEndpoints) {
          try {
            console.log(`Trying update endpoint: ${endpoint}`);
            response = await axios.put(endpoint, classData, {
              timeout: 15000,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              withCredentials: false
            });
            console.log(`Update success with: ${endpoint}`);
            updateSuccess = true;
            break;
          } catch (err) {
            console.log(`Update failed with endpoint: ${endpoint}`, err.message);
            continue;
          }
        }
        
        if (!updateSuccess) {
          throw new Error('All update endpoints failed');
        }
        
        setSuccess('✅ Class updated successfully!');
      } else {
        // Try the working endpoint pattern for creation
        const createEndpoints = [
          `https://hydersoft.com/api/trainer/courses/${courseId}/class`,
          'https://hydersoft.com/api/trainer/sub',
          'https://hydersoft.com/api/class',
          'https://hydersoft.com/api/classes'
        ];
        
        let createSuccess = false;
        for (const endpoint of createEndpoints) {
          try {
            console.log(`Trying create endpoint: ${endpoint}`);
            response = await axios.post(endpoint, classData, {
              timeout: 15000,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              withCredentials: false
            });
            console.log(`Create success with: ${endpoint}`);
            createSuccess = true;
            break;
          } catch (err) {
            console.log(`Create failed with endpoint: ${endpoint}`, err.message);
            continue;
          }
        }
        
        if (!createSuccess) {
          throw new Error('All create endpoints failed');
        }
        
        setSuccess('✅ Class created successfully!');
      }

      setTimeout(() => setSuccess(''), 4000);

      // Reset form
      setTitle('');
      setDescription('');
      setScheduleDate('');
      setDuration('');
      setZoomLink('');
      setIsActive(true);
      setEditingClass(null);
      setShowModal(false);

      // Refresh classes
      if (courseId) {
        fetchClasses();
      } else {
        fetchAllClasses();
      }
    } catch (error) {
      setSuccess('');
      
      let errorMessage;
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: Unable to connect to server. Please check your internet connection.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (error.response?.status === 422) {
        errorMessage = `Validation error: ${error.response.data.message || 'Please check your input data.'}`;
      } else {
        errorMessage = error?.response?.data?.message || error.message || (editingClass ? 'Update failed' : 'Creation failed');
      }
      
      setMessage(`Error: ${errorMessage}`);
      console.error(editingClass ? 'Update error:' : 'Creation error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      // Try multiple delete endpoints
      const deleteEndpoints = [
        `https://hydersoft.com/api/trainer/class/${classId}`,
        // `https://hydersoft.com/api/class/${classId}`,
        // `https://hydersoft.com/api/classes/${classId}`
      ];
      
      let deleteSuccess = false;
      for (const endpoint of deleteEndpoints) {
        try {
          await axios.delete(endpoint, {
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          deleteSuccess = true;
          break;
        } catch (err) {
          console.log(`Delete failed with endpoint: ${endpoint}`, err.message);
          continue;
        }
      }
      
      if (!deleteSuccess) {
        throw new Error('All delete endpoints failed');
      }
      
      if (courseId) {
        fetchClasses();
      } else {
        fetchAllClasses();
      }
      setSuccess('✅ Class deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting class:', error);
      setMessage(`Failed to delete class: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const handleEdit = (classToEdit) => {
    setEditingClass(classToEdit);
    setTitle(classToEdit.title);
    setDescription(classToEdit.description || '');
    setScheduleDate(classToEdit.schedule_date);
    setDuration(classToEdit.duration);
    setZoomLink(classToEdit.zoom_link);
    setIsActive(classToEdit.is_active);
    setCourseId(classToEdit.course_id);
    setShowModal(true);
    setMessage('');
    setSuccess('');
  };

  const handleCourseChange = (selectedCourseId) => {
    setCourseId(selectedCourseId);
    setMessage(''); // Clear any previous error messages
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingClass(null);
    setTitle('');
    setDescription('');
    setScheduleDate('');
    setDuration('');
    setZoomLink('');
    setIsActive(true);
    setMessage('');
    setSuccess('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.course_id === courseId);
    return course ? course.title : `Course ${courseId}`;
  };

  // Add error display for trainer ID issues
  if (!trainerId) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> Trainer information not found. Please log in again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full">
      {/* Debug Information
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-100 border rounded text-xs">
          <strong>Debug Info:</strong><br/>
          Trainer ID: {trainerId}<br/>
          Course ID: {courseId}<br/>
          Classes Count: {classes.length}<br/>
          Loading: {loading ? 'Yes' : 'No'}
        </div>
      )} */}

      {/* Course Selection */}
      <div className="mb-4 sm:mb-6">
        <label className="block mb-2 font-medium text-sm sm:text-base">Filter course:</label>
        <select
          className="w-full sm:max-w-md border px-3 py-2 rounded text-sm sm:text-base"
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
        <h2 className="text-lg sm:text-xl font-semibold lg:hidden">Training Classes</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
        >
          Add New Class
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 text-green-700 bg-green-100 border border-green-300 px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base">
          {success}
        </div>
      )}

      {/* Error Message */}
      {message && (
        <div className="mb-4 text-red-700 bg-red-100 border border-red-300 px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base">
          {message}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-4 text-blue-700 bg-blue-100 border border-blue-300 px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base">
          Loading classes...
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border text-sm font-medium">Course</th>
              <th className="px-4 py-3 border text-sm font-medium">Title</th>
              <th className="px-4 py-3 border text-sm font-medium">Date</th>
              <th className="px-4 py-3 border text-sm font-medium">Duration</th>
              <th className="px-4 py-3 border text-sm font-medium">Zoom Link</th>
              <th className="px-4 py-3 border text-sm font-medium">Active</th>
              <th className="px-4 py-3 border text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(classes) && classes.length > 0 ? (
              classes.map(classItem => (
                <tr key={classItem.class_id} className="hover:bg-gray-50">
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
                    <span className={`px-2 py-1 rounded text-xs ${classItem.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {classItem.is_active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 border text-center">
                    <span
                      onClick={() => handleEdit(classItem)}
                      className="cursor-pointer text-blue-600 hover:text-blue-800 mr-2"
                      title="Edit class"
                    >
                      <FaEdit />
                    </span>
                    <span
                      onClick={() => handleDelete(classItem.class_id)}
                      className="cursor-pointer text-red-600 hover:text-red-800"
                      title="Delete class"
                    >
                      <FaTrash />
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  {courseId ? 'No classes found for this course.' : 'No classes found.'}
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
              <div key={classItem.class_id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-base text-gray-900 flex-1 mr-2">{classItem.title}</h3>
                  <div className="flex space-x-2 flex-shrink-0">
                    <span
                      onClick={() => handleEdit(classItem)}
                      className="cursor-pointer text-blue-600 hover:text-blue-800 text-lg"
                      title="Edit class"
                    >
                      <FaEdit />
                    </span>
                    <span
                      onClick={() => handleDelete(classItem.class_id)}
                      className="cursor-pointer text-red-600 hover:text-red-800 text-lg"
                      title="Delete class"
                    >
                      <FaTrash />
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
                    <span className={`px-2 py-1 rounded text-xs font-medium ${classItem.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
            {courseId ? 'No classes found for this course.' : 'No classes found.'}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {editingClass ? 'Edit Class' : 'Create New Class'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Course *</label>
                <select
                  className="w-full border px-3 py-2 rounded text-sm sm:text-base"
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
                  className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter class title"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Description</label>
                <textarea
                  className="w-full border px-3 py-2 rounded text-sm sm:text-base h-20 sm:h-24"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter class description..."
                ></textarea>
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Schedule Date *</label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                  value={scheduleDate}
                  onChange={e => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Duration (minutes) *</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded text-sm sm:text-base"
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
                  className="w-full border px-3 py-2 rounded text-sm sm:text-base"
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

              {message && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="w-full sm:w-auto bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
                  disabled={submitting}
                >
                  {submitting ? (editingClass ? 'Updating...' : 'Creating...') : (editingClass ? 'Update Class' : 'Create Class')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingInfo;