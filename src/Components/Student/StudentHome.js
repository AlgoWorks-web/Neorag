import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaBook, FaVideo, FaChartLine, FaSpinner } from 'react-icons/fa';
import { AlertCircle, RefreshCw, TrendingUp, Clock, BookOpen, Play } from 'lucide-react';
import Courses from './Courses';
import { getStudentUser, isStudentAuthenticated } from '../../auth/authUtils';

const StudentHome = () => {
  const [dashboardData, setDashboardData] = useState({
    enrolledCourses: 0,
    videosWatched: '0/0',
    upcomingClasses: 0,
    overallProgress: '0%'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Get student headers for API calls
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

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const headers = getStudentHeaders();
      
      const response = await fetch('https://hydersoft.com/api/enrolledstudent/dashboard', {
        headers
      });

      const data = await response.json();

      if (response.status === 401) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      if (data.success) {
        const stats = data.data.stats;
        const recentActivity = data.data.recent_activity || [];
        
        setDashboardData({
          enrolledCourses: stats.total_enrolled || 0,
          videosWatched: '0/0', // You can enhance this based on your video tracking
          upcomingClasses: stats.upcoming_classes || 0,
          overallProgress: stats.completed_courses > 0 
            ? Math.round((stats.completed_courses / stats.total_enrolled) * 100) + '%'
            : '0%'
        });
        
        setRecentActivity(recentActivity);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Network error while fetching dashboard data: ' + err.message);
      console.error('Error fetching dashboard data:', err);
    }
  };

  // Fetch upcoming classes
  const fetchUpcomingClasses = async () => {
    try {
      const headers = getStudentHeaders();
      
      // Get enrolled courses first
      const coursesResponse = await fetch('https://hydersoft.com/api/enrolledstudent/my-courses', {
        headers
      });
      
      const coursesData = await coursesResponse.json();
      
      if (coursesData.success && coursesData.data.length > 0) {
        // Fetch classes for all enrolled courses
        const allClasses = [];
        
        for (const course of coursesData.data) {
          try {
            const classResponse = await fetch(`https://hydersoft.com/api/enrolledstudent/course/${course.course_id}/classes`, {
              headers
            });
            
            const classData = await classResponse.json();
            
            if (classData.success && classData.data.upcoming_classes) {
              const classesWithCourse = classData.data.upcoming_classes.map(classItem => ({
                ...classItem,
                course_name: course.course_name
              }));
              allClasses.push(...classesWithCourse);
            }
          } catch (err) {
            console.error(`Error fetching classes for course ${course.course_id}:`, err);
          }
        }
        
        // Sort by schedule date and take first 3
        allClasses.sort((a, b) => new Date(a.schedule_date) - new Date(b.schedule_date));
        setUpcomingClasses(allClasses.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching upcoming classes:', err);
    }
  };

  // Initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      if (!isStudentAuthenticated()) {
        setError('Please log in as a student to view your dashboard');
        setLoading(false);
        return;
      }

      setLoading(true);
      await Promise.all([
        fetchDashboardData(),
        fetchUpcomingClasses()
      ]);
      setLoading(false);
    };
    
    initializeDashboard();
  }, []);

  // Refresh dashboard
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchDashboardData(),
      fetchUpcomingClasses()
    ]);
    setRefreshing(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Authentication check
  if (!isStudentAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in as a student to view your dashboard.</p>
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
        <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
          {getStudentUser() && (
            <p className="text-gray-600">
              Welcome back, <span className="font-medium">{getStudentUser().name || getStudentUser().email_id}</span>!
            </p>
          )}
        </div>
        
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-4 sm:mt-0"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-auto text-red-600 hover:text-red-800 text-xl font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-lg mr-4">
              <FaBook className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.enrolledCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <FaVideo className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Videos Watched</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.videosWatched}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <FaCalendarAlt className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Upcoming Classes</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.upcomingClasses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <FaChartLine className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.overallProgress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Recent Activity
              </h2>
            </div>
            
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p>No recent activity found</p>
                <p className="text-sm">Start watching videos or attending classes to see activity here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{activity.course_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="capitalize">{activity.status}</span>
                        <span>{activity.progress}% progress</span>
                        <span>{new Date(activity.last_accessed).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${activity.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                Upcoming Classes
              </h2>
            </div>
            
            {upcomingClasses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaCalendarAlt className="text-4xl text-gray-400 mx-auto mb-3" />
                <p>No upcoming classes</p>
                <p className="text-sm">Check back later for scheduled classes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingClasses.map((classItem, index) => {
                  const isStartingSoon = () => {
                    const now = new Date();
                    const classTime = new Date(classItem.schedule_date);
                    const timeDiff = classTime.getTime() - now.getTime();
                    return timeDiff > 0 && timeDiff <= 30 * 60 * 1000; // 30 minutes
                  };

                  return (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isStartingSoon() 
                          ? 'border-red-200 bg-red-50 animate-pulse' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      {isStartingSoon() && (
                        <div className="text-xs font-bold text-red-600 mb-2">Starting Soon!</div>
                      )}
                      <h3 className="font-medium text-gray-800 mb-1">{classItem.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{classItem.course_name}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(classItem.schedule_date)}</span>
                        <span>{classItem.duration} min</span>
                      </div>
                      {classItem.zoom_link && (
                        <button 
                          onClick={() => window.open(classItem.zoom_link, '_blank')}
                          className={`mt-3 w-full py-2 px-3 rounded text-xs font-medium transition-colors ${
                            isStartingSoon()
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          <Play className="w-3 h-3 inline mr-1" />
                          {isStartingSoon() ? 'Join Now' : 'Join Class'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Courses Component */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-500" />
          My Courses
        </h2>
        <Courses />
      </div>
    </div>
  );
};

export default StudentHome;
