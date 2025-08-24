// import React, { useState, useEffect } from 'react';
// import {
//   FaChalkboardTeacher,
//   FaUsers,
//   FaBook,
//   FaVideo,
//   FaCalendarAlt,
//   FaExternalLinkAlt
// } from 'react-icons/fa';
// import {
//   AlertCircle,
//   RefreshCw,
//   BookOpen,
//   Activity,
//   Calendar,
//   Clock
// } from 'lucide-react';

// import { getTrainerHeaders, getTrainerUser, clearTrainerAuth, isTrainerAuthenticated } from '../../auth/authUtils';
// import { useNavigate } from 'react-router-dom';

// const TrainerHome = () => {
//   const [dashboardData, setDashboardData] = useState({
//     stats: {
//       totalCourses: 0,
//       totalEnrolledStudents: 0,
//       totalClasses: 0,
//       totalVideos: 0,
//       totalMaterials: 0
//     },
//     recentActivities: [],
//     upcomingClassesList: [],
//     todayClassesList: []
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [refreshing, setRefreshing] = useState(false);
//   const navigate = useNavigate();

//   // ✅ Fetch dashboard stats using Bearer token
//   const fetchDashboardStats = async () => {
//     try {
//       const headers = getTrainerHeaders(); // Uses Bearer token
//       console.log('🔍 Making request with token headers');

//       // Fetch all stats in parallel
//       const [classStatsResponse, videoStatsResponse, materialStatsResponse] = await Promise.all([
//         fetch('https://hydersoft.com/api/trainer/class-stats', { method: 'GET', headers }),
//         fetch('https://hydersoft.com/api/trainer/video-stats', { method: 'GET', headers }),
//         fetch('https://hydersoft.com/api/trainer/material-stats', { method: 'GET', headers })
//       ]);

//       // Handle 401 errors by clearing auth and redirecting
//       if (classStatsResponse.status === 401 || videoStatsResponse.status === 401 || materialStatsResponse.status === 401) {
//         console.error('❌ Token expired or invalid');
//         clearTrainerAuth();
//         navigate('/login');
//         return;
//       }

//       // Process responses
//       const classData = classStatsResponse.ok ? await classStatsResponse.json() : { success: false };
//       const videoData = videoStatsResponse.ok ? await videoStatsResponse.json() : { success: false };
//       const materialData = materialStatsResponse.ok ? await materialStatsResponse.json() : { success: false };

//       console.log('✅ Stats fetched with token:', { classData, videoData, materialData });

//       // Update dashboard data
//       setDashboardData(prev => ({
//         ...prev,
//         stats: {
//           ...prev.stats,
//           totalClasses: classData.success ? classData.data.total_classes : 0,
//           totalVideos: videoData.success ? videoData.data.total_videos : 0,
//           totalMaterials: materialData.success ? materialData.data.total_materials : 0
//         }
//       }));

//       setError('');

//     } catch (err) {
//       console.error('❌ Error fetching dashboard stats:', err);
//       setError('Network error while fetching dashboard stats: ' + err.message);
//     }
//   };

//   // ✅ Fetch upcoming classes using Bearer token
//   const fetchUpcomingClasses = async () => {
//     try {
//       const headers = getTrainerHeaders();

//       const [upcomingResponse, todayResponse] = await Promise.all([
//         fetch('https://hydersoft.com/api/trainer/upcoming-classes', {
//           method: 'GET',
//           headers
//         }),
//         fetch('https://hydersoft.com/api/trainer/today-classes', {
//           method: 'GET',
//           headers
//         })
//       ]);

//       // Handle 401 errors
//       if (upcomingResponse.status === 401 || todayResponse.status === 401) {
//         console.error('❌ Token expired for class data');
//         clearTrainerAuth();
//         navigate('/login');
//         return;
//       }

//       if (upcomingResponse.ok) {
//         const upcomingData = await upcomingResponse.json();
//         if (upcomingData.success) {
//           setDashboardData(prev => ({
//             ...prev,
//             upcomingClassesList: upcomingData.data.slice(0, 5)
//           }));
//         }
//       }

//       if (todayResponse.ok) {
//         const todayData = await todayResponse.json();
//         if (todayData.success) {
//           setDashboardData(prev => ({
//             ...prev,
//             todayClassesList: todayData.data
//           }));
//         }
//       }

//     } catch (err) {
//       console.error('❌ Error fetching upcoming classes:', err);
//     }
//   };

//   // ✅ Generate basic recent activities (without courses)
//   const generateBasicActivities = () => {
//     const basicActivities = [
//       {
//         id: 'activity_1',
//         action: 'Dashboard accessed',
//         course: 'System',
//         time: 'Just now',
//         type: 'access'
//       },
//       {
//         id: 'activity_2',
//         action: 'Profile updated',
//         course: 'Account',
//         time: '2 hours ago',
//         type: 'update'
//       }
//     ];

//     setDashboardData(prev => ({
//       ...prev,
//       recentActivities: basicActivities
//     }));
//   };

//   // ✅ NEW: Handle join class
//   const handleJoinClass = (zoomLink, classTitle) => {
//     if (zoomLink) {
//       // Open zoom link in new tab
//       window.open(zoomLink, '_blank', 'noopener,noreferrer');
//     } else {
//       alert(`Zoom link not available for "${classTitle}"`);
//     }
//   };

//   // ✅ Initialize dashboard
//   useEffect(() => {
//     const initializeDashboard = async () => {
//       if (!isTrainerAuthenticated()) {
//         setError('Please log in as a trainer to view your dashboard');
//         setLoading(false);
//         navigate('/login');
//         return;
//       }

//       setLoading(true);
//       try {
//         await Promise.all([
//           fetchDashboardStats(),
//           fetchUpcomingClasses()
//         ]);
//         generateBasicActivities(); // Generate basic activities instead of course-based ones
//       } catch (err) {
//         console.error('❌ Error initializing dashboard:', err);
//         setError('Failed to load dashboard data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeDashboard();
//   }, [navigate]);

//   // ✅ Refresh dashboard
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     try {
//       await Promise.all([
//         fetchDashboardStats(),
//         fetchUpcomingClasses()
//       ]);
//       generateBasicActivities();
//     } catch (err) {
//       console.error('❌ Error refreshing dashboard:', err);
//       setError('Failed to refresh dashboard data');
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // ✅ Format date for display
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Authentication check
//   if (!isTrainerAuthenticated()) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//         <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
//           <p className="text-gray-600 mb-4">Please log in as a trainer to view your dashboard.</p>
//           <button
//             className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//             onClick={() => navigate('/login')}
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//         <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
//         <p className="text-gray-600 text-lg">Loading your trainer dashboard...</p>
//       </div>
//     );
//   }

//   // Stats configuration (removed courses stat)
//   const stats = [
//     {
//       id: 2,
//       name: 'Total Classes',
//       value: dashboardData.stats.totalClasses,
//       icon: FaCalendarAlt,
//       color: 'bg-purple-100 text-purple-600',
//       borderColor: 'border-purple-500'
//     },
//     {
//       id: 3,
//       name: 'Videos Uploaded',
//       value: dashboardData.stats.totalVideos,
//       icon: FaVideo,
//       color: 'bg-green-100 text-green-600',
//       borderColor: 'border-green-500'
//     },
//     {
//       id: 4,
//       name: 'Materials Uploaded',
//       value: dashboardData.stats.totalMaterials,
//       icon: FaChalkboardTeacher,
//       color: 'bg-orange-100 text-orange-600',
//       borderColor: 'border-orange-500'
//     }
//   ];

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">Trainer Dashboard</h1>
//           {getTrainerUser() && (
//             <p className="text-gray-600">
//               Welcome back, <span className="font-medium">{getTrainerUser().name || getTrainerUser().email}</span>!
//             </p>
//           )}
//         </div>

//         <button
//           onClick={handleRefresh}
//           disabled={refreshing}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-4 sm:mt-0"
//         >
//           <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//           Refresh
//         </button>
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
//           <AlertCircle className="w-5 h-5 flex-shrink-0" />
//           <span>{error}</span>
//           <button
//             onClick={() => setError('')}
//             className="ml-auto text-red-600 hover:text-red-800 text-xl font-bold"
//           >
//             ×
//           </button>
//         </div>
//       )}

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         {stats.map((stat) => (
//           <div key={stat.id} className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${stat.borderColor} hover:shadow-lg transition-shadow`}>
//             <div className="flex items-center">
//               <div className={`p-3 rounded-lg mr-4 ${stat.color}`}>
//                 <stat.icon className="text-xl" />
//               </div>
//               <div>
//                 <p className="text-gray-500 text-sm">{stat.name}</p>
//                 <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Today's Classes Section */}
//       {dashboardData.todayClassesList.length > 0 && (
//         <div className="mb-8">
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <Clock className="w-5 h-5 text-indigo-500" />
//               Today's Classes
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {dashboardData.todayClassesList.map((classItem) => (
//                 <div key={classItem.class_id} className="p-4 border-2 border-indigo-200 rounded-lg bg-indigo-50">
//                   <h3 className="font-medium text-gray-800 mb-1">{classItem.title}</h3>
//                   <p className="text-sm text-gray-600 mb-2">{classItem.course_name}</p>
//                   <div className="flex items-center justify-between text-xs mb-3">
//                     <span className="text-indigo-600 font-medium">{classItem.formatted_time}</span>
//                   </div>
//                   {/* ✅ NEW: Join button for today's classes */}
//                   <button
//                     onClick={() => handleJoinClass(classItem.zoom_link, classItem.title)}
//                     className="w-full bg-indigo-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <FaExternalLinkAlt className="w-3 h-3" />
//                     Join Class
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Dashboard Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//         {/* Recent Activities */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 <Activity className="w-5 h-5 text-blue-500" />
//                 Recent Activities
//               </h2>
//             </div>

//             {dashboardData.recentActivities.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//                 <p>No recent activities found</p>
//                 <p className="text-sm">Activities will appear here as you use the system</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {dashboardData.recentActivities.map((activity) => (
//                   <div key={activity.id} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                     <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
//                       <BookOpen className="w-4 h-4 text-blue-600" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-medium text-gray-800">{activity.action}</p>
//                       <p className="text-gray-600 text-sm">{activity.course}</p>
//                       <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Upcoming Classes */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 <Calendar className="w-5 h-5 text-orange-500" />
//                 Upcoming Classes
//               </h2>
//             </div>

//             {dashboardData.upcomingClassesList.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 <FaCalendarAlt className="text-4xl text-gray-400 mx-auto mb-3" />
//                 <p>No upcoming classes</p>
//                 <p className="text-sm">Check back later for scheduled classes</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {dashboardData.upcomingClassesList.map((classItem) => (
//                   <div key={classItem.class_id} className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
//                     <h3 className="font-medium text-gray-800 mb-1 truncate">{classItem.title}</h3>
//                     <p className="text-sm text-gray-600 mb-2">{classItem.course_name}</p>
//                     <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
//                       <span>{formatDate(classItem.schedule_date)}</span>
//                     </div>
//                     {/* ✅ NEW: Join button for upcoming classes */}
//                     <button
//                       onClick={() => handleJoinClass(classItem.zoom_link, classItem.title)}
//                       className="w-full bg-orange-500 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <FaExternalLinkAlt className="w-3 h-3" />
//                       Join Class
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrainerHome;
import React, { useState, useEffect } from 'react';
import {
  FaChalkboardTeacher,
  FaUsers,
  FaBook,
  FaVideo,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaGraduationCap,
  FaArrowUp
} from 'react-icons/fa';
import {
  AlertCircle,
  RefreshCw,
  BookOpen,
  Activity,
  Calendar,
  Clock,
  TrendingUp,
  BarChart3
} from 'lucide-react';

import { getTrainerHeaders, getTrainerUser, clearTrainerAuth, isTrainerAuthenticated } from '../../auth/authUtils';
import { useNavigate } from 'react-router-dom';

const TrainerHome = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalCourses: 0,
      totalEnrolledStudents: 0,
      totalClasses: 0,
      totalVideos: 0,
      totalMaterials: 0
    },
    recentActivities: [],
    upcomingClassesList: [],
    todayClassesList: [],
    enrolledStudentsData: {
      total_enrolled_students: 0,
      enrolled_by_course: [],
      enrolled_by_status: {
        enrolled: 0,
        in_progress: 0,
        completed: 0
      },
      recent_enrollments: []
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch enrolled students stats using Bearer token
  const fetchEnrolledStudentsStats = async () => {
    try {
      const headers = getTrainerHeaders();
      console.log('🔍 Fetching enrolled students stats with token headers');

      const response = await fetch('https://hydersoft.com/api/trainer/enrolled-students-stats', {
        method: 'GET',
        headers
      });

      if (response.status === 401) {
        console.error('❌ Token expired for enrolled students stats');
        clearTrainerAuth();
        navigate('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('✅ Enrolled students stats fetched:', data.data);
          
          setDashboardData(prev => ({
            ...prev,
            stats: {
              ...prev.stats,
              totalEnrolledStudents: data.data.total_enrolled_students
            },
            enrolledStudentsData: data.data
          }));
        }
      } else {
        console.warn('⚠️ Failed to fetch enrolled students stats:', response.status);
      }

    } catch (err) {
      console.error('❌ Error fetching enrolled students stats:', err);
    }
  };

  // ✅ Fetch dashboard stats using Bearer token
  const fetchDashboardStats = async () => {
    try {
      const headers = getTrainerHeaders();
      console.log('🔍 Making request with token headers');

      // Fetch all stats in parallel
      const [classStatsResponse, videoStatsResponse, materialStatsResponse] = await Promise.all([
        fetch('https://hydersoft.com/api/trainer/class-stats', { method: 'GET', headers }),
        fetch('https://hydersoft.com/api/trainer/video-stats', { method: 'GET', headers }),
        fetch('https://hydersoft.com/api/trainer/material-stats', { method: 'GET', headers })
      ]);

      // Handle 401 errors by clearing auth and redirecting
      if (classStatsResponse.status === 401 || videoStatsResponse.status === 401 || materialStatsResponse.status === 401) {
        console.error('❌ Token expired or invalid');
        clearTrainerAuth();
        navigate('/login');
        return;
      }

      // Process responses
      const classData = classStatsResponse.ok ? await classStatsResponse.json() : { success: false };
      const videoData = videoStatsResponse.ok ? await videoStatsResponse.json() : { success: false };
      const materialData = materialStatsResponse.ok ? await materialStatsResponse.json() : { success: false };

      console.log('✅ Stats fetched with token:', { classData, videoData, materialData });

      // Update dashboard data
      setDashboardData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalClasses: classData.success ? classData.data.total_classes : 0,
          totalVideos: videoData.success ? videoData.data.total_videos : 0,
          totalMaterials: materialData.success ? materialData.data.total_materials : 0
        }
      }));

      // Also fetch enrolled students stats
      await fetchEnrolledStudentsStats();

      setError('');

    } catch (err) {
      console.error('❌ Error fetching dashboard stats:', err);
      setError('Network error while fetching dashboard stats: ' + err.message);
    }
  };

  // ✅ Fetch upcoming classes using Bearer token
  const fetchUpcomingClasses = async () => {
    try {
      const headers = getTrainerHeaders();

      const [upcomingResponse, todayResponse] = await Promise.all([
        fetch('https://hydersoft.com/api/trainer/upcoming-classes', {
          method: 'GET',
          headers
        }),
        fetch('https://hydersoft.com/api/trainer/today-classes', {
          method: 'GET',
          headers
        })
      ]);

      // Handle 401 errors
      if (upcomingResponse.status === 401 || todayResponse.status === 401) {
        console.error('❌ Token expired for class data');
        clearTrainerAuth();
        navigate('/login');
        return;
      }

      if (upcomingResponse.ok) {
        const upcomingData = await upcomingResponse.json();
        if (upcomingData.success) {
          setDashboardData(prev => ({
            ...prev,
            upcomingClassesList: upcomingData.data.slice(0, 5)
          }));
        }
      }

      if (todayResponse.ok) {
        const todayData = await todayResponse.json();
        if (todayData.success) {
          setDashboardData(prev => ({
            ...prev,
            todayClassesList: todayData.data
          }));
        }
      }

    } catch (err) {
      console.error('❌ Error fetching upcoming classes:', err);
    }
  };

  // ✅ Generate basic recent activities
  const generateBasicActivities = () => {
    const basicActivities = [
      {
        id: 'activity_1',
        action: 'Dashboard accessed',
        course: 'System',
        time: 'Just now',
        type: 'access'
      },
      {
        id: 'activity_2',
        action: 'Profile updated',
        course: 'Account',
        time: '2 hours ago',
        type: 'update'
      }
    ];

    setDashboardData(prev => ({
      ...prev,
      recentActivities: basicActivities
    }));
  };

  // ✅ Handle join class
  const handleJoinClass = (zoomLink, classTitle) => {
    if (zoomLink) {
      window.open(zoomLink, '_blank', 'noopener,noreferrer');
    } else {
      alert(`Zoom link not available for "${classTitle}"`);
    }
  };

  // ✅ Initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      if (!isTrainerAuthenticated()) {
        setError('Please log in as a trainer to view your dashboard');
        setLoading(false);
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        await Promise.all([
          fetchDashboardStats(),
          fetchUpcomingClasses()
        ]);
        generateBasicActivities();
      } catch (err) {
        console.error('❌ Error initializing dashboard:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  // ✅ Refresh dashboard
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchUpcomingClasses()
      ]);
      generateBasicActivities();
    } catch (err) {
      console.error('❌ Error refreshing dashboard:', err);
      setError('Failed to refresh dashboard data');
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ Format date for display
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

  // ✅ Get progress status helper
  const getProgressStatus = (progress) => {
    if (progress === 0) return 'Not Started';
    if (progress < 50) return 'In Progress';
    if (progress < 100) return 'Nearly Complete';
    return 'Completed';
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
            onClick={() => navigate('/login')}
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

  // Stats configuration with enrolled students
  const stats = [
    {
      id: 1,
      name: 'Enrolled Students',
      value: dashboardData.stats.totalEnrolledStudents,
      icon: FaUsers,
      color: 'bg-blue-100 text-blue-600',
      borderColor: 'border-blue-500'
    },
    {
      id: 2,
      name: 'Total Classes',
      value: dashboardData.stats.totalClasses,
      icon: FaCalendarAlt,
      color: 'bg-purple-100 text-purple-600',
      borderColor: 'border-purple-500'
    },
    {
      id: 3,
      name: 'Videos Uploaded',
      value: dashboardData.stats.totalVideos,
      icon: FaVideo,
      color: 'bg-green-100 text-green-600',
      borderColor: 'border-green-500'
    },
    {
      id: 4,
      name: 'Materials Uploaded',
      value: dashboardData.stats.totalMaterials,
      icon: FaChalkboardTeacher,
      color: 'bg-orange-100 text-orange-600',
      borderColor: 'border-orange-500'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Trainer Dashboard</h1>
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
        {stats.map((stat) => (
          <div key={stat.id} className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${stat.borderColor} hover:shadow-lg transition-shadow`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg mr-4 ${stat.color}`}>
                <stat.icon className="text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enrolled Students by Course Section */}
      {dashboardData.enrolledStudentsData.enrolled_by_course.length > 0 && (
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaGraduationCap className="w-5 h-5 text-blue-500" />
              Students Enrolled in Your Courses
            </h2>
            
            {/* Course Enrollment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {dashboardData.enrolledStudentsData.enrolled_by_course.map((course, index) => (
                <div key={course.course_id || index} className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                  <h3 className="font-medium text-gray-800 mb-2 truncate" title={course.title}>
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{course.student_count}</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {course.student_count === 1 ? 'student' : 'students'}
                      </span>
                    </div>
                    < FaArrowUp className="text-blue-500" />
                  </div>
                </div>
              ))}
            </div>

            {/* Enrollment Status Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {dashboardData.enrolledStudentsData.enrolled_by_status.enrolled}
                </div>
                <div className="text-sm text-gray-600 font-medium">Newly Enrolled</div>
                <div className="text-xs text-gray-500 mt-1">Active enrollments</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {dashboardData.enrolledStudentsData.enrolled_by_status.in_progress}
                </div>
                <div className="text-sm text-gray-600 font-medium">In Progress</div>
                <div className="text-xs text-gray-500 mt-1">Learning actively</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {dashboardData.enrolledStudentsData.enrolled_by_status.completed}
                </div>
                <div className="text-sm text-gray-600 font-medium">Completed</div>
                <div className="text-xs text-gray-500 mt-1">Course finished</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Classes Section */}
      {dashboardData.todayClassesList.length > 0 && (
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Today's Classes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.todayClassesList.map((classItem) => (
                <div key={classItem.class_id} className="p-4 border-2 border-indigo-200 rounded-lg bg-indigo-50">
                  <h3 className="font-medium text-gray-800 mb-1">{classItem.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{classItem.course_name}</p>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-indigo-600 font-medium">{classItem.formatted_time}</span>
                  </div>
                  <button
                    onClick={() => handleJoinClass(classItem.zoom_link, classItem.title)}
                    className="w-full bg-indigo-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaExternalLinkAlt className="w-3 h-3" />
                    Join Class
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Recent Activities
              </h2>
            </div>

            {dashboardData.recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p>No recent activities found</p>
                <p className="text-sm">Activities will appear here as you use the system</p>
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
                <Calendar className="w-5 h-5 text-orange-500" />
                Upcoming Classes
              </h2>
            </div>

            {dashboardData.upcomingClassesList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaCalendarAlt className="text-4xl text-gray-400 mx-auto mb-3" />
                <p>No upcoming classes</p>
                <p className="text-sm">Check back later for scheduled classes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.upcomingClassesList.map((classItem) => (
                  <div key={classItem.class_id} className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <h3 className="font-medium text-gray-800 mb-1 truncate">{classItem.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{classItem.course_name}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{formatDate(classItem.schedule_date)}</span>
                    </div>
                    <button
                      onClick={() => handleJoinClass(classItem.zoom_link, classItem.title)}
                      className="w-full bg-orange-500 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaExternalLinkAlt className="w-3 h-3" />
                      Join Class
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Enrollments Section */}
      {dashboardData.enrolledStudentsData.recent_enrollments.length > 0 && (
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Recent Enrollments (Last 30 Days)
            </h2>
            <div className="space-y-3">
              {dashboardData.enrolledStudentsData.recent_enrollments.slice(0, 5).map((enrollment) => (
                <div key={enrollment.enrollment_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{enrollment.student_name}</p>
                    <p className="text-sm text-gray-600">{enrollment.course_title}</p>
                    <p className="text-xs text-gray-500">{new Date(enrollment.enrollment_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      enrollment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      enrollment.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {enrollment.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            enrollment.progress === 100 ? 'bg-green-500' :
                            enrollment.progress > 0 ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{enrollment.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {dashboardData.enrolledStudentsData.recent_enrollments.length > 5 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Showing 5 of {dashboardData.enrolledStudentsData.recent_enrollments.length} recent enrollments
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerHome;
