import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentUser, isStudentAuthenticated, clearStudentAuth } from '../../auth/authUtils';

function StudentMyCourses() {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const navigate = useNavigate();

  // Authentication check with proper loading state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = isStudentAuthenticated();
        const student = getStudentUser();
        
        console.log('=== Auth Check ===');
        console.log('Authenticated:', isAuth);
        console.log('Student data:', student);
        
        if (!isAuth || !student || !student.id) {
          console.log('Not authenticated, redirecting...');
          clearStudentAuth();
          navigate('/login');
          return;
        }
        
        console.log('Authentication passed, student ID:', student.id);
        setAuthLoading(false);
        await fetchPurchasedCourses();
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthLoading(false);
        setError('Authentication error. Please log in again.');
      }
    };

    checkAuth();
  }, [navigate]);

  // Search filter effect
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses(purchasedCourses);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = purchasedCourses.filter(enrollment =>
        enrollment.course && (
          (enrollment.course.title || '').toLowerCase().includes(lowercasedQuery) ||
          (enrollment.course.description || '').toLowerCase().includes(lowercasedQuery)
        )
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, purchasedCourses]);

  // Updated fetch function with better error handling
  const fetchPurchasedCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const studentData = getStudentUser();

      if (!studentData || !studentData.id) {
        throw new Error('Student not authenticated - no student data found');
      }

      // Updated headers - make sure these match what your backend expects
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Student-ID': studentData.id.toString(),
        'X-Student-Email': studentData.email || '',
        'X-Auth-Type': 'student-session'
      };

      console.log('=== API Request Debug ===');
      console.log('Student ID:', studentData.id);
      console.log('Student Email:', studentData.email);
      console.log('Request URL:', 'https://hydersoft.com/api/enrolledstudent/my-courses');

      // Updated API endpoint - make sure this matches your backend route
      const response = await fetch('https://hydersoft.com/api/enrolledstudent/my-courses', {
        method: 'GET',
        headers: headers,
        mode: 'cors'
      });

      console.log('=== Response Debug ===');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Handle different response statuses
      if (response.status === 401) {
        console.log('401 Unauthorized - clearing auth and redirecting');
        clearStudentAuth();
        navigate('/login');
        return;
      }

      if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Bad request - please check your authentication');
      }

      if (response.status === 404) {
        throw new Error('API endpoint not found. Please check the server configuration.');
      }

      if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      console.log('=== API Response Debug ===');
      console.log('Full response:', data);

      if (data.success) {
        // Handle both array and object responses
        let coursesData = [];
        
        if (Array.isArray(data.data)) {
          coursesData = data.data;
        } else if (data.data && Array.isArray(data.data.courses)) {
          coursesData = data.data.courses;
        } else if (data.data) {
          coursesData = [data.data];
        }

        // Validate and filter enrollments with valid course data
        const validEnrollments = coursesData.filter((enrollment, index) => {
          if (!enrollment) {
            console.warn(`Enrollment ${index} is null/undefined`);
            return false;
          }

          if (!enrollment.course) {
            console.warn(`Enrollment ${index} missing course data:`, enrollment);
            return false;
          }
          
          if (!enrollment.course.title || !enrollment.course.course_id) {
            console.warn(`Enrollment ${index} has incomplete course data:`, enrollment.course);
            return false;
          }
          
          return true;
        });
        
        console.log('=== Data Validation Results ===');
        console.log('Raw courses data:', coursesData);
        console.log('Total enrollments received:', coursesData.length);
        console.log('Valid enrollments after filtering:', validEnrollments.length);
        
        setPurchasedCourses(validEnrollments);
        
        if (validEnrollments.length === 0 && coursesData.length > 0) {
          setError('Courses found but missing required details. Please contact support.');
        }
        
      } else {
        const errorMessage = data.message || 'Failed to fetch courses from server';
        console.log('API returned success:false:', errorMessage);
        
        if (errorMessage.toLowerCase().includes('no enrolled courses') || 
            errorMessage.toLowerCase().includes('not found')) {
          setPurchasedCourses([]);
        } else {
          throw new Error(errorMessage);
        }
      }

    } catch (err) {
      console.error('=== Fetch Error ===');
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      
      // Set user-friendly error messages
      let userMessage = '';
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        userMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (err.message.includes('NetworkError') || err.message.includes('CORS')) {
        userMessage = 'Network error. Please try again or contact support.';
      } else if (err.message.includes('401') || err.message.includes('authenticated')) {
        userMessage = 'Session expired. Redirecting to login...';
        setTimeout(() => {
          clearStudentAuth();
          navigate('/login');
        }, 2000);
      } else if (err.message.includes('500')) {
        userMessage = 'Server error. Please try again later.';
      } else if (err.message.includes('404')) {
        userMessage = 'Service not available. Please contact support.';
      } else {
        userMessage = err.message || 'An unexpected error occurred while loading your courses.';
      }
      
      setError(userMessage);

    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'enrolled':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const createPlaceholderImage = () => {
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#f3f4f6"/>
        <text x="150" y="100" font-family="Arial" font-size="16" fill="#6b7280" text-anchor="middle">
          No Image Available
        </text>
      </svg>
    `);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4 text-sm whitespace-pre-line">{error}</p>
          <div className="space-y-2">
            <button
              onClick={fetchPurchasedCourses}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                clearStudentAuth();
                navigate('/login');
              }}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStudent = getStudentUser();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchased Courses</h1>
          <p className="text-gray-600">
            Welcome back, {currentStudent?.name || currentStudent?.username || 'Student'}! Continue your learning journey.
          </p>
          
          {/* Debug info - remove in production */}
          {/* {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-100 rounded">
              <p>Student ID: {currentStudent?.id} | Email: {currentStudent?.email}</p>
              <p>Courses: {purchasedCourses.length} | Filtered: {filteredCourses.length}</p>
              <p>Auth: {isStudentAuthenticated() ? '✅' : '❌'} | User: {currentStudent ? '✅' : '❌'}</p>
            </div>
          )} */}
        </div>

        {purchasedCourses.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search your courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {purchasedCourses.length === 0 ? 'No purchased courses yet' : 'No matching courses'}
            </h3>
            <p className="text-gray-600 mb-6">
              {purchasedCourses.length === 0
                ? 'Start your learning journey by exploring our course catalog.'
                : 'Try a different search term.'}
            </p>
            {purchasedCourses.length === 0 && (
              <button
                onClick={() => navigate('/student/courses')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Browse Courses
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((enrollment) => {
              const course = enrollment.course;
              
              if (!course) {
                console.warn('Enrollment without course data:', enrollment);
                return null;
              }

              return (
                <div key={enrollment.enrollment_id || `course-${course.course_id}`} 
                     className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={`https://hydersoft.com/${course.thumbnail}`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Image failed to load:', `https://hydersoft.com/${course.thumbnail}`);
                        e.target.onerror = null;

                        // Try alternative paths if the main path fails
                        const altPaths = [
                          `https://hydersoft.com/storage/coursethumbnails/${course.thumbnail.split('/').pop()}`,
                          `https://hydersoft.com/storage/app/public/coursethumbnails/${course.thumbnail.split('/').pop()}`
                        ];

                        const currentFailedUrl = e.target.src;

                        // Try each alternative path
                        for (let altPath of altPaths) {
                          if (currentFailedUrl !== altPath) {
                            console.log('Trying alternative path:', altPath);
                            e.target.src = altPath;
                            return;
                          }
                        }

                        // If all paths fail, use placeholder
                        console.log('All image paths failed, using placeholder');
                        e.target.src = createPlaceholderImage();
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', `https://hydersoft.com/${course.thumbnail}`);
                      }}
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {course.title || 'Course Title'}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {course.description || course.bio || 'No description available'}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(course.price)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                        {enrollment.status || 'Unknown'}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Enrolled: {enrollment.enrollment_date ? 
                        new Date(enrollment.enrollment_date).toLocaleDateString() : 'Unknown'}
                    </div>

                    <button
                      onClick={() => navigate(`/student/videos`)}
                      className="w-full mt-auto bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentMyCourses;
