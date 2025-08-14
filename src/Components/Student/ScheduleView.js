import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { getStudentUser, isStudentAuthenticated } from '../../auth/authUtils';

function ScheduleView() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [classes, setClasses] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Get student data from localStorage
  const getStudentHeaders = () => {
    const studentUser = getStudentUser();
    if (!studentUser || !studentUser.id) {
      throw new Error('Student not found in localStorage');
    }
    
    return {
      'X-Student-ID': studentUser.id.toString(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  };

  // ✅ FIXED: Helper function to get course info from enrollment data
  const getCourseInfo = (enrollment) => {
    if (enrollment.course && enrollment.course.course_id) {
      return {
        id: enrollment.course.course_id,
        name: enrollment.course.title || 'Unknown Course'
      };
    } else if (enrollment.course_id) {
      return {
        id: enrollment.course_id,
        name: enrollment.course_name || enrollment.title || 'Unknown Course'
      };
    }
    return { id: null, name: 'Unknown Course' };
  };

  // Fetch enrolled courses
  const fetchMyCourses = async () => {
    try {
      console.log('=== FETCH MY COURSES DEBUG ===');
      const headers = getStudentHeaders();
      console.log('Request headers:', headers);
      
      const response = await fetch('https://hydersoft.com/api/enrolledstudent/my-courses', {
        headers
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.status === 401) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      if (data.success) {
        setCourses(data.data);
        console.log('Courses set:', data.data);
        
        // ✅ FIXED: Set first course using correct data structure
        if (data.data.length > 0) {
          const firstCourse = getCourseInfo(data.data[0]);
          console.log('Setting first course:', firstCourse);
          if (firstCourse.id) {
            setSelectedCourse(firstCourse.id.toString());
          }
        }
      } else {
        setError(data.error || 'Failed to fetch courses');
      }
    } catch (err) {
      setError('Network error while fetching courses: ' + err.message);
      console.error('Error fetching courses:', err);
    }
  };

  // Fetch classes for selected course
  const fetchCourseClasses = async (courseId) => {
    if (!courseId) return;

    console.log('=== FETCH CLASSES DEBUG ===');
    console.log('Course ID:', courseId);
    
    setRefreshing(true);
    try {
      const headers = getStudentHeaders();
      
      const response = await fetch(`https://hydersoft.com/api/enrolledstudent/course/${courseId}/classes`, {
        headers
      });

      console.log('Classes response status:', response.status);
      const data = await response.json();
      console.log('Classes response data:', data);

      if (response.status === 401) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      if (response.status === 403) {
        setError('Access denied. Please make sure you are enrolled in this course.');
        return;
      }

      if (data.success) {
        setClasses({
          upcoming: data.data.upcoming_classes || [],
          past: data.data.past_classes || []
        });
        setError('');
        console.log('Classes set:', data.data);
      } else {
        setError(data.error || 'Failed to fetch classes');
        setClasses({ upcoming: [], past: [] });
      }
    } catch (err) {
      setError('Network error while fetching classes: ' + err.message);
      setClasses({ upcoming: [], past: [] });
      console.error('Error fetching classes:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      if (!isStudentAuthenticated()) {
        setError('Please log in as a student to access your courses');
        setLoading(false);
        return;
      }

      setLoading(true);
      await fetchMyCourses();
      setLoading(false);
    };
    
    initializeData();
  }, []);

  // Fetch classes when course selection changes
  useEffect(() => {
    if (selectedCourse) {
      console.log('Selected course changed to:', selectedCourse);
      fetchCourseClasses(selectedCourse);
    }
  }, [selectedCourse]);

  // ✅ FIXED: Course selection handler
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    console.log('Course selection changed:', courseId);
    setSelectedCourse(courseId);
    setClasses({ upcoming: [], past: [] }); // Clear previous classes
  };

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  // Check if class is starting soon (within 30 minutes)
  const isClassStartingSoon = (scheduleDate) => {
    const now = new Date();
    const classTime = new Date(scheduleDate);
    const timeDiff = classTime.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff <= 30 * 60 * 1000;
  };

  // Handle join class
  const handleJoinClass = (zoomLink) => {
    if (zoomLink) {
      window.open(zoomLink, '_blank');
    } else {
      setError('Zoom link not available for this class');
    }
  };

  // Refresh classes
  const handleRefresh = () => {
    if (selectedCourse) {
      fetchCourseClasses(selectedCourse);
    }
  };

  // Show authentication error if not logged in
  if (!isStudentAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in as a student to access your class schedule.</p>
          <button 
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => window.location.href = '/login'}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Loading your class schedule...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            <Calendar className="text-blue-500 w-8 h-8" />
            My Class Schedule
          </h1>
          
          {/* Welcome Message */}
          {getStudentUser() && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                Welcome back, <span className="font-semibold">{getStudentUser().username || getStudentUser().email_id}</span>!
              </p>
            </div>
          )}
          
          {/* ✅ FIXED: Course Selector */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <label htmlFor="course-select" className="font-semibold text-gray-700">
              Select Course:
            </label>
            <div className="flex items-center gap-3">
              <select 
                id="course-select"
                value={selectedCourse} 
                onChange={handleCourseChange}
                disabled={courses.length === 0}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500 min-w-60"
              >
                <option value="">Choose a course...</option>
                {courses.map(enrollment => {
                  const courseInfo = getCourseInfo(enrollment);
                  return (
                    <option key={courseInfo.id || enrollment.enrollment_id} value={courseInfo.id}>
                      {courseInfo.name}
                    </option>
                  );
                })}
              </select>
              
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                onClick={handleRefresh}
                disabled={!selectedCourse || refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          
       
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* No Courses Message */}
        {courses.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Enrolled Courses</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Purchase a course to see your class schedule.
            </p>
          </div>
        )}

        {/* Classes Display */}
        {selectedCourse && (
          <div className="space-y-8">
            
            {/* Upcoming Classes */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                <Clock className="text-blue-500 w-6 h-6" />
                Upcoming Classes ({classes.upcoming.length})
              </h2>
              
              {classes.upcoming.length === 0 ? (
                <div className="text-center py-8 text-gray-500 italic">
                  <p>No upcoming classes scheduled for this course.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {classes.upcoming.map(classItem => {
                    const { date, time } = formatDateTime(classItem.schedule_date);
                    const startingSoon = isClassStartingSoon(classItem.schedule_date);
                    
                    return (
                      <div 
                        key={classItem.class_id} 
                        className={`relative border-2 border-gray-200 rounded-lg p-5 transition-all duration-300 hover:shadow-md ${
                          startingSoon 
                            ? 'border-l-4 border-l-red-500 bg-red-50 animate-pulse' 
                            : 'border-l-4 border-l-green-500 bg-white'
                        }`}
                      >
                        {startingSoon && (
                          <div className="absolute -top-2 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                            Starting Soon!
                          </div>
                        )}
                        
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-800 text-lg pr-2">{classItem.title}</h3>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                            Upcoming
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>{date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{time} ({classItem.duration} min)</span>
                          </div>
                        </div>
                        
                        {classItem.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {classItem.description}
                          </p>
                        )}
                        
                        <button 
                          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-all ${
                            startingSoon 
                              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-md transform hover:-translate-y-0.5'
                          }`}
                          onClick={() => handleJoinClass(classItem.zoom_link)}
                        >
                          <Video className="w-4 h-4" />
                          {startingSoon ? 'Join Now' : 'Join Class'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Past Classes */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                <Calendar className="text-blue-500 w-6 h-6" />
                Past Classes ({classes.past.length})
              </h2>
              
              {classes.past.length === 0 ? (
                <div className="text-center py-8 text-gray-500 italic">
                  <p>No past classes for this course.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {classes.past.map(classItem => {
                    const { date, time } = formatDateTime(classItem.schedule_date);
                    
                    return (
                      <div 
                        key={classItem.class_id} 
                        className="border-2 border-gray-200 border-l-4 border-l-gray-400 rounded-lg p-5 bg-gray-50 opacity-90"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-700 text-lg pr-2">{classItem.title}</h3>
                          <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                            Completed
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{time} ({classItem.duration} min)</span>
                          </div>
                        </div>
                        
                        {classItem.description && (
                          <p className="text-gray-500 text-sm line-clamp-3">
                            {classItem.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScheduleView;

