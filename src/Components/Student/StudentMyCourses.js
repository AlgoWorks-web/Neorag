import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentUser, isStudentAuthenticated, clearStudentAuth } from '../../auth/authUtils';

function StudentMyCourses() {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isStudentAuthenticated()) {
      navigate('/student/login');
      return;
    }
    fetchPurchasedCourses();
  }, [navigate]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses(purchasedCourses);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = purchasedCourses.filter(enrollment =>
        enrollment.course.title.toLowerCase().includes(lowercasedQuery) ||
        enrollment.course.description.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, purchasedCourses]);

  const fetchPurchasedCourses = async () => {
    try {
      setLoading(true);
      
      const studentData = getStudentUser();
      
      if (!studentData) {
        throw new Error('Student not authenticated');
      }

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const studentToken = localStorage.getItem('studentToken');
      if (studentToken) {
        headers['Authorization'] = `Bearer ${studentToken}`;
      }

      const response = await fetch('https://hydersoft.com/api/enrollments/my-courses', {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      });

      if (response.status === 401) {
        clearStudentAuth();
        navigate('/student/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch purchased courses');
      }

      const data = await response.json();
      
      if (data.success) {
        setPurchasedCourses(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch courses');
      }
      
    } catch (err) {
      console.error('Error fetching purchased courses:', err);
      setError(err.message);
      
      if (err.message.includes('authenticated') || err.message.includes('401')) {
        clearStudentAuth();
        navigate('/student/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'enrolled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const createPlaceholderImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 300, 200);
    ctx.fillStyle = '#6b7280';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('No Image Available', 150, 100);
    return canvas.toDataURL();
  };

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
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchPurchasedCourses}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentStudent = getStudentUser();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Purchased Courses</h1>
          <p className="text-gray-600">
            Welcome back, {currentStudent?.name || currentStudent?.username || 'Student'}! Continue your learning journey.
          </p>
        </div>

        {purchasedCourses.length > 0 && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-1/2 border border-gray-300 rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {purchasedCourses.length === 0 ? 'No purchased courses yet' : 'No matching courses'}
            </h3>
            <p className="text-gray-600 mb-4">
              {purchasedCourses.length === 0 
                ? 'Start your learning journey by exploring our course catalog.' 
                : 'Try a different search term.'}
            </p>
            {purchasedCourses.length === 0 && (
              <button
                onClick={() => navigate('/student/courses')}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((enrollment) => {
              const course = enrollment.course;
              return (
                <div key={enrollment.enrollment_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={`https://hydersoft.com/${course.thumbnail}`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = createPlaceholderImage();
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {course.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          Progress: {parseFloat(enrollment.progress || 0).toFixed(1)}%
                        </span>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${enrollment.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(course.price)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                        {enrollment.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mb-3">
                      Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                    </div>

                    <button
                      onClick={() => navigate(`/student/course-details/${course.course_id}`)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors duration-200"
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
