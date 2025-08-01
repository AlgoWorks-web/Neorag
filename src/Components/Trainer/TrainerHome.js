import React, { useState, useEffect } from 'react';
import { 
  FaChalkboardTeacher, 
  FaUsers, 
  FaBook, 
  FaVideo, 
  FaEye,
  FaEdit,
  FaCalendarAlt
} from 'react-icons/fa';
import { 
  AlertCircle, 
  RefreshCw, 
  BookOpen, 
  Activity,
  Calendar,
  Loader
} from 'lucide-react';
import { getTrainerUser, isTrainerAuthenticated } from '../../auth/authUtils';

const TrainerHome = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalCourses: 0,
      totalEnrolledStudents: 0,
      totalClasses: 0,
      totalVideos: 0,
      totalMaterials: 0
    },
    courses: [],
    recentActivities: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Get trainer headers for API calls
  const getTrainerHeaders = () => {
    const trainerUser = getTrainerUser();
    if (!trainerUser || !trainerUser.trainer_id) {
      throw new Error('Trainer not found in localStorage');
    }
    
    return {
      'Authorization': `Bearer ${trainerUser.token || ''}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  };

  // Fetch trainer's assigned courses
  const fetchTrainerCourses = async () => {
    try {
      const trainerUser = getTrainerUser();
      const trainerId = trainerUser.trainer_id;
      
      console.log('Fetching courses for trainer:', trainerId);
      
      const response = await fetch(`https://hydersoft.com/api/trainer/${trainerId}/courses`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Trainer courses response:', data);

      if (response.ok && data.success) {
        const courses = data.data || [];
        setDashboardData(prev => ({
          ...prev,
          courses: courses
        }));
        
        // Fetch detailed stats for each course
        await fetchDetailedStats(courses);
        
        return courses;
      } else {
        throw new Error(data.message || 'Failed to fetch courses');
      }
    } catch (err) {
      console.error('Error fetching trainer courses:', err);
      throw err;
    }
  };

  // Fetch detailed stats for all courses
  const fetchDetailedStats = async (courses) => {
    try {
      let totalEnrolledStudents = 0;
      let totalClasses = 0;
      let totalVideos = 0;
      let totalMaterials = 0;
      
      const recentActivities = [];

      // Fetch stats for each course
      for (const course of courses) {
        const courseId = course.course_id;
        
        try {
          // Fetch enrolled students count
          const enrollmentsResponse = await fetch(`https://hydersoft.com/api/course/${courseId}/enrollments`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          if (enrollmentsResponse.ok) {
            const enrollmentsData = await enrollmentsResponse.json();
            if (enrollmentsData.success) {
              const enrolledCount = enrollmentsData.data ? enrollmentsData.data.length : 0;
              totalEnrolledStudents += enrolledCount;
              
              // Add to recent activities
              if (enrolledCount > 0) {
                recentActivities.push({
                  id: `enrollment_${courseId}`,
                  action: `${enrolledCount} students enrolled`,
                  course: course.title || course.course_name,
                  time: '1 day ago',
                  type: 'enrollment'
                });
              }
            }
          }

          // Fetch classes count
          const classesResponse = await fetch(`https://hydersoft.com/api/course/${courseId}/classes`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          if (classesResponse.ok) {
            const classesData = await classesResponse.json();
            if (classesData.success) {
              const classesCount = classesData.data ? classesData.data.length : 0;
              totalClasses += classesCount;
              
              if (classesCount > 0) {
                recentActivities.push({
                  id: `classes_${courseId}`,
                  action: `${classesCount} classes scheduled`,
                  course: course.title || course.course_name,
                  time: '2 days ago',
                  type: 'classes'
                });
              }
            }
          }

          // Fetch videos count
          const videosResponse = await fetch(`https://hydersoft.com/api/course/${courseId}/videos`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          if (videosResponse.ok) {
            const videosData = await videosResponse.json();
            if (videosData.success) {
              const videosCount = videosData.data ? videosData.data.length : 0;
              totalVideos += videosCount;
              
              if (videosCount > 0) {
                recentActivities.push({
                  id: `videos_${courseId}`,
                  action: `${videosCount} videos uploaded`,
                  course: course.title || course.course_name,
                  time: '3 days ago',
                  type: 'videos'
                });
              }
            }
          }

          // Fetch materials count
          const materialsResponse = await fetch(`https://hydersoft.com/api/course/${courseId}/materials`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          if (materialsResponse.ok) {
            const materialsData = await materialsResponse.json();
            if (materialsData.success) {
              const materialsCount = materialsData.data ? materialsData.data.length : 0;
              totalMaterials += materialsCount;
              
              if (materialsCount > 0) {
                recentActivities.push({
                  id: `materials_${courseId}`,
                  action: `${materialsCount} materials uploaded`,
                  course: course.title || course.course_name,
                  time: '4 days ago',
                  type: 'materials'
                });
              }
            }
          }

        } catch (courseErr) {
          console.error(`Error fetching stats for course ${courseId}:`, courseErr);
        }
      }

      // Update dashboard data with real stats
      setDashboardData(prev => ({
        ...prev,
        stats: {
          totalCourses: courses.length,
          totalEnrolledStudents,
          totalClasses,
          totalVideos,
          totalMaterials
        },
        recentActivities: recentActivities.slice(0, 8) // Show latest 8 activities
      }));

      console.log('Dashboard stats updated:', {
        totalCourses: courses.length,
        totalEnrolledStudents,
        totalClasses,
        totalVideos,
        totalMaterials
      });

    } catch (err) {
      console.error('Error fetching detailed stats:', err);
    }
  };

  // Initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      if (!isTrainerAuthenticated()) {
        setError('Please log in as a trainer to view your dashboard');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        await fetchTrainerCourses();
        setError('');
      } catch (err) {
        setError('Failed to load dashboard data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    initializeDashboard();
  }, []);

  // Refresh dashboard
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTrainerCourses();
      setError('');
    } catch (err) {
      setError('Failed to refresh dashboard: ' + err.message);
    } finally {
      setRefreshing(false);
    }
  };

  // Authentication check
  if (!isTrainerAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in as a trainer to view your dashboard.</p>
          <button 
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => window.location.href = '/trainer-login'}
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
        <p className="text-gray-600 text-lg">Loading your trainer dashboard...</p>
      </div>
    );
  }

  const stats = [
    { 
      id: 1, 
      name: 'Assigned Courses', 
      value: dashboardData.stats.totalCourses, 
      icon: FaBook,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      id: 2, 
      name: 'Enrolled Students', 
      value: dashboardData.stats.totalEnrolledStudents, 
      icon: FaUsers,
      color: 'bg-green-100 text-green-600'
    },
    { 
      id: 3, 
      name: 'Scheduled Classes', 
      value: dashboardData.stats.totalClasses, 
      icon: FaCalendarAlt,
      color: 'bg-purple-100 text-purple-600'
    },
    { 
      id: 4, 
      name: 'Videos Uploaded', 
      value: dashboardData.stats.totalVideos, 
      icon: FaVideo,
      color: 'bg-orange-100 text-orange-600'
    },
    { 
      id: 5, 
      name: 'Materials Uploaded', 
      value: dashboardData.stats.totalMaterials, 
      icon: FaChalkboardTeacher,
      color: 'bg-red-100 text-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Trainer Dashboard</h1>
            {getTrainerUser() && (
              <p className="text-gray-600">
                Welcome back, <span className="font-medium">{getTrainerUser().name || getTrainerUser().email}</span>!
              </p>
            )}
          </div>
          
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-4 sm:mt-0"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Recent Activities
              </h2>
            </div>
            
            {dashboardData.recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p>No recent activities found</p>
                <p className="text-sm">Activities will appear here as you manage your courses</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{activity.action}</p>
                      <p className="text-gray-600 text-sm">{activity.course}</p>
                      <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.type === 'enrollment' ? 'bg-green-100 text-green-700' :
                        activity.type === 'videos' ? 'bg-orange-100 text-orange-700' :
                        activity.type === 'materials' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {activity.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Assigned Courses */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                Assigned Courses
              </h2>
            </div>
            
            {dashboardData.courses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaBook className="text-4xl text-gray-400 mx-auto mb-3" />
                <p>No courses assigned</p>
                <p className="text-sm">Courses will appear here when assigned</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.courses.slice(0, 5).map((course) => (
                  <div key={course.course_id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium text-gray-800 mb-1 truncate">
                      {course.title || course.course_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {course.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Course ID: {course.course_id}</span>
                      <span>{course.duration || 'Duration: TBD'}</span>
                    </div>
                  </div>
                ))}
                
                {dashboardData.courses.length > 5 && (
                  <div className="text-center pt-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All {dashboardData.courses.length} Courses
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerHome;
