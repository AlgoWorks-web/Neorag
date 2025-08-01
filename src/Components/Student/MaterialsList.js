// import React, { useState, useEffect } from 'react';
// import {
//   FaFilePdf,
//   FaFileImage,
//   FaFileWord,
//   FaFileAlt,
//   FaDownload,
//   FaSearch,
//   FaFileExcel,
//   FaFilePowerpoint,
//   FaFileArchive
// } from 'react-icons/fa';
// import {
//   BookOpen,
//   AlertCircle,
//   Users,
//   RefreshCw,
//   Grid3X3,
//   List,
//   Calendar,
//   FileText,
//   Download,
//   Eye,
//   Loader,
//   File,
//   HardDrive
// } from 'lucide-react';
// import { getStudentUser, isStudentAuthenticated } from '../../auth/authUtils';

// const MaterialsList = () => {
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [materialsLoading, setMaterialsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewMode, setViewMode] = useState('grid');
//   const [refreshing, setRefreshing] = useState(false);
//   const [downloadingId, setDownloadingId] = useState(null);

//   // Get student headers for API calls
//   const getStudentHeaders = () => {
//     const studentUser = getStudentUser();
//     if (!studentUser || !studentUser.id) {
//       throw new Error('Student not found in localStorage');
//     }

//     return {
//       'X-Student-ID': studentUser.id.toString(),
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     };
//   };

//   // Get file icon based on file type
//   const getFileIcon = (fileType) => {
//     const iconClass = "w-8 h-8";

//     switch (fileType?.toLowerCase()) {
//       case 'pdf':
//         return <FaFilePdf className={`${iconClass} text-red-500`} />;
//       case 'doc':
//       case 'docx':
//         return <FaFileWord className={`${iconClass} text-blue-500`} />;
//       case 'xls':
//       case 'xlsx':
//         return <FaFileExcel className={`${iconClass} text-green-500`} />;
//       case 'ppt':
//       case 'pptx':
//         return <FaFilePowerpoint className={`${iconClass} text-orange-500`} />;
//       case 'jpg':
//       case 'jpeg':
//       case 'png':
//       case 'gif':
//       case 'bmp':
//       case 'svg':
//         return <FaFileImage className={`${iconClass} text-purple-500`} />;
//       case 'zip':
//       case 'rar':
//       case '7z':
//         return <FaFileArchive className={`${iconClass} text-yellow-500`} />;
//       case 'txt':
//         return <FileText className={`${iconClass} text-gray-500`} />;
//       default:
//         return <FaFileAlt className={`${iconClass} text-gray-500`} />;
//     }
//   };

//   // Get file type color for badge
//   const getFileTypeColor = (fileType) => {
//     switch (fileType?.toLowerCase()) {
//       case 'pdf':
//         return 'bg-red-100 text-red-700 border-red-200';
//       case 'doc':
//       case 'docx':
//         return 'bg-blue-100 text-blue-700 border-blue-200';
//       case 'xls':
//       case 'xlsx':
//         return 'bg-green-100 text-green-700 border-green-200';
//       case 'ppt':
//       case 'pptx':
//         return 'bg-orange-100 text-orange-700 border-orange-200';
//       case 'jpg':
//       case 'jpeg':
//       case 'png':
//       case 'gif':
//         return 'bg-purple-100 text-purple-700 border-purple-200';
//       case 'zip':
//       case 'rar':
//       case '7z':
//         return 'bg-yellow-100 text-yellow-700 border-yellow-200';
//       default:
//         return 'bg-gray-100 text-gray-700 border-gray-200';
//     }
//   };

//   // Format file size
//   const formatFileSize = (bytes) => {
//     if (!bytes) return 'Unknown size';
//     const units = ['B', 'KB', 'MB', 'GB'];
//     let size = bytes;
//     let unitIndex = 0;

//     while (size > 1024 && unitIndex < units.length - 1) {
//       size /= 1024;
//       unitIndex++;
//     }

//     return `${size.toFixed(1)} ${units[unitIndex]}`;
//   };

//   // Fetch enrolled courses
//   const fetchMyCourses = async () => {
//     try {
//       const headers = getStudentHeaders();

//       const response = await fetch('https://hydersoft.com/api/enrolledstudent/my-courses', {
//         headers
//       });

//       const data = await response.json();

//       if (response.status === 401) {
//         setError('Authentication failed. Please log in again.');
//         return;
//       }

//       if (data.success) {
//         setCourses(data.data);
//         if (data.data.length > 0) {
//           setSelectedCourse(data.data[0].course_id);
//         }
//       } else {
//         setError(data.error || 'Failed to fetch courses');
//       }
//     } catch (err) {
//       setError('Network error while fetching courses: ' + err.message);
//       console.error('Error fetching courses:', err);
//     }
//   };

//   // Fetch materials for selected course
//   const fetchCourseMaterials = async (courseId) => {
//     if (!courseId) return;

//     setMaterialsLoading(true);
//     try {
//       const headers = getStudentHeaders();

//       console.log('Fetching materials for course:', courseId);

//       const response = await fetch(`https://hydersoft.com/api/enrolledstudent/course/${courseId}/materials`, {
//         headers
//       });

//       const data = await response.json();

//       console.log('Materials API response:', data);

//       if (response.status === 401) {
//         setError('Authentication failed. Please log in again.');
//         return;
//       }

//       if (response.status === 403) {
//         setError('Access denied. Please make sure you are enrolled in this course.');
//         return;
//       }

//       if (data.success) {
//         setMaterials(data.data || []);
//         setError('');
//       } else {
//         setError(data.error || 'Failed to fetch materials');
//         setMaterials([]);
//       }
//     } catch (err) {
//       setError('Network error while fetching materials: ' + err.message);
//       setMaterials([]);
//       console.error('Error fetching materials:', err);
//     } finally {
//       setMaterialsLoading(false);
//     }
//   };

//   // Initialize data
//   useEffect(() => {
//     const initializeData = async () => {
//       if (!isStudentAuthenticated()) {
//         setError('Please log in as a student to access course materials');
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       await fetchMyCourses();
//       setLoading(false);
//     };

//     initializeData();
//   }, []);

//   // Fetch materials when course selection changes
//   useEffect(() => {
//     if (selectedCourse) {
//       fetchCourseMaterials(selectedCourse);
//     }
//   }, [selectedCourse]);

//   // Filter materials based on search
//   const filteredMaterials = materials.filter(material => {
//     if (!material) return false;

//     const searchLower = searchTerm.toLowerCase();
//     const titleMatch = material.title?.toLowerCase().includes(searchLower) || false;
//     const descriptionMatch = material.description?.toLowerCase().includes(searchLower) || false;
//     const fileNameMatch = material.file_name?.toLowerCase().includes(searchLower) || false;

//     return titleMatch || descriptionMatch || fileNameMatch;
//   });

//   // Handle material download
//   // Handle material download
//   const handleDownload = async (material) => {
//     try {
//       setDownloadingId(material.material_id);

//       const studentUser = getStudentUser();
//       if (!studentUser || !studentUser.id) {
//         setError('Authentication required. Please log in again.');
//         return;
//       }

//       // ✅ FIXED: Ensure URL includes student_id parameter
//       let downloadUrl = material.download_url;

//       console.log('Original download URL:', downloadUrl);

//       // Check if student_id is already in the URL
//       if (!downloadUrl.includes('student_id=')) {
//         const separator = downloadUrl.includes('?') ? '&' : '?';
//         downloadUrl = `${downloadUrl}${separator}student_id=${studentUser.id}`;
//       }

//       console.log('Final download URL with auth:', downloadUrl);

//       // Create a temporary link and trigger download
//       const link = document.createElement('a');
//       link.href = downloadUrl;
//       link.download = material.title || material.file_name || 'download';
//       link.target = '_blank';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       console.log('Material download initiated:', material.title);

//     } catch (err) {
//       console.error('Error downloading material:', err);
//       setError('Failed to download material. Please try again.');
//     } finally {
//       setDownloadingId(null);
//     }
//   };


//   // Handle material preview
//   const handlePreview = (material) => {
//     try {
//       console.log('Previewing material:', material.title);
//       window.open(material.preview_url || material.download_url, '_blank');
//     } catch (err) {
//       console.error('Error previewing material:', err);
//       setError('Failed to preview material. Please try again.');
//     }
//   };

//   // Refresh materials
//   const handleRefresh = () => {
//     if (selectedCourse) {
//       setRefreshing(true);
//       fetchCourseMaterials(selectedCourse).finally(() => {
//         setRefreshing(false);
//       });
//     }
//   };

//   // Authentication check
//   if (!isStudentAuthenticated()) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//         <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
//           <p className="text-gray-600 mb-4">Please log in as a student to access course materials.</p>
//           <button
//             className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//             onClick={() => window.location.href = '/login'}
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
//         <p className="text-gray-600 text-lg">Loading your course materials...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
//                 <BookOpen className="text-blue-500 w-8 h-8" />
//                 Course Materials
//               </h1>
//               {getStudentUser() && (
//                 <p className="text-gray-600 mt-1">
//                   Welcome back, <span className="font-medium">{getStudentUser().name || getStudentUser().email_id}</span>
//                 </p>
//               )}
//             </div>

//             {/* Course Selector */}
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <BookOpen className="w-5 h-5 text-gray-500" />
//                 <select
//                   value={selectedCourse}
//                   onChange={(e) => setSelectedCourse(e.target.value)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-48"
//                   disabled={courses.length === 0}
//                 >
//                   <option value="">Select a course</option>
//                   {courses.map(course => (
//                     <option key={course.course_id} value={course.course_id}>
//                       {course.course_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {selectedCourse && (
//                 <button
//                   onClick={handleRefresh}
//                   disabled={refreshing}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//                   Refresh
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
//             <AlertCircle className="w-5 h-5 flex-shrink-0" />
//             <span>{error}</span>
//             <button
//               onClick={() => setError('')}
//               className="ml-auto text-red-600 hover:text-red-800 text-xl font-bold"
//             >
//               ×
//             </button>
//           </div>
//         </div>
//       )}

//       {/* No Courses Message */}
//       {courses.length === 0 && !error && (
//         <div className="max-w-7xl mx-auto px-4 py-12">
//           <div className="bg-white rounded-lg shadow-lg p-12 text-center">
//             <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">No Enrolled Courses</h3>
//             <p className="text-gray-600 max-w-md mx-auto">
//               You haven't enrolled in any courses yet. Purchase a course to access course materials.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       {selectedCourse && (
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           {/* Controls */}
//           <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div className="flex items-center gap-4">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Materials ({filteredMaterials.length})
//                 </h2>

//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => setViewMode('grid')}
//                     className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
//                       }`}
//                   >
//                     <Grid3X3 className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => setViewMode('list')}
//                     className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
//                       }`}
//                   >
//                     <List className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Search */}
//               <div className="relative">
//                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search materials..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Materials List */}
//           <div className="bg-white rounded-lg shadow-lg">
//             {materialsLoading ? (
//               <div className="p-12 text-center">
//                 <Loader className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
//                 <p className="text-gray-500">Loading materials...</p>
//               </div>
//             ) : filteredMaterials.length === 0 ? (
//               <div className="p-12 text-center">
//                 <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                   {materials.length === 0 ? 'No Materials Available' : 'No Materials Found'}
//                 </h3>
//                 <p className="text-gray-600 max-w-md mx-auto">
//                   {materials.length === 0
//                     ? 'No materials have been uploaded for this course yet. Check back later!'
//                     : 'No materials match your search criteria. Try different keywords.'
//                   }
//                 </p>
//               </div>
//             ) : (
//               <div className={
//                 viewMode === 'grid'
//                   ? 'p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
//                   : 'divide-y divide-gray-200'
//               }>
//                 {filteredMaterials.map((material) => (
//                   <div
//                     key={material.material_id}
//                     className={
//                       viewMode === 'grid'
//                         ? 'p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200'
//                         : 'p-6 hover:bg-gray-50 transition-colors duration-200'
//                     }
//                   >
//                     <div className="flex items-start gap-4">
//                       {/* File Icon */}
//                       <div className="flex-shrink-0">
//                         <div className="p-3 bg-gray-50 rounded-lg">
//                           {getFileIcon(material.file_type)}
//                         </div>
//                       </div>

//                       {/* Material Info */}
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-semibold text-gray-900 mb-2 truncate">
//                           {material.title}
//                         </h3>

//                         {material.description && (
//                           <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                             {material.description}
//                           </p>
//                         )}

//                         {/* File Info */}
//                         <div className="flex items-center gap-3 mb-4">
//                           <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getFileTypeColor(material.file_type)}`}>
//                             {material.file_type?.toUpperCase() || 'FILE'}
//                           </span>

//                           <div className="flex items-center gap-1 text-xs text-gray-500">
//                             <Calendar className="w-3 h-3" />
//                             <span>{new Date(material.created_at).toLocaleDateString()}</span>
//                           </div>

//                           {material.file_name && (
//                             <div className="flex items-center gap-1 text-xs text-gray-500">
//                               <File className="w-3 h-3" />
//                               <span className="truncate max-w-20" title={material.file_name}>
//                                 {material.file_name}
//                               </span>
//                             </div>
//                           )}
//                         </div>

//                         {/* Actions */}
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => handleDownload(material)}
//                             disabled={downloadingId === material.material_id}
//                             className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
//                           >
//                             {downloadingId === material.material_id ? (
//                               <>
//                                 <Loader className="w-3 h-3 animate-spin" />
//                                 Downloading...
//                               </>
//                             ) : (
//                               <>
//                                 <FaDownload className="w-3 h-3" />
//                                 Download
//                               </>
//                             )}
//                           </button>

//                           <button
//                             onClick={() => handlePreview(material)}
//                             className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
//                           >
//                             <Eye className="w-3 h-3" />
//                             Preview
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MaterialsList;

import React, { useState, useEffect } from 'react';
import {
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFileAlt,
  FaDownload,
  FaSearch,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive
} from 'react-icons/fa';
import {
  BookOpen,
  AlertCircle,
  Users,
  RefreshCw,
  Grid3X3,
  List,
  Calendar,
  FileText,
  Download,
  Eye,
  Loader,
  File,
  X
} from 'lucide-react';
import { getStudentUser, isStudentAuthenticated } from '../../auth/authUtils';

const MaterialsList = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // ✅ SIMPLIFIED: Preview modal states (removed zoom, rotation)
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    material: null,
    loading: false,
    error: ''
  });

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

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    const iconClass = "w-8 h-8";

    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return <FaFilePdf className={`${iconClass} text-red-500`} />;
      case 'doc':
      case 'docx':
        return <FaFileWord className={`${iconClass} text-blue-500`} />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className={`${iconClass} text-green-500`} />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint className={`${iconClass} text-orange-500`} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
        return <FaFileImage className={`${iconClass} text-purple-500`} />;
      case 'zip':
      case 'rar':
      case '7z':
        return <FaFileArchive className={`${iconClass} text-yellow-500`} />;
      case 'txt':
        return <FileText className={`${iconClass} text-gray-500`} />;
      default:
        return <FaFileAlt className={`${iconClass} text-gray-500`} />;
    }
  };

  // Get file type color for badge
  const getFileTypeColor = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'doc':
      case 'docx':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'xls':
      case 'xlsx':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'ppt':
      case 'pptx':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'zip':
      case 'rar':
      case '7z':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Fetch enrolled courses
  const fetchMyCourses = async () => {
    try {
      const headers = getStudentHeaders();
      const response = await fetch('https://hydersoft.com/api/enrolledstudent/my-courses', {
        headers
      });
      const data = await response.json();

      if (response.status === 401) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      if (data.success) {
        setCourses(data.data);
        if (data.data.length > 0) {
          setSelectedCourse(data.data[0].course_id);
        }
      } else {
        setError(data.error || 'Failed to fetch courses');
      }
    } catch (err) {
      setError('Network error while fetching courses: ' + err.message);
      console.error('Error fetching courses:', err);
    }
  };

  // Fetch materials for selected course
  const fetchCourseMaterials = async (courseId) => {
    if (!courseId) return;

    setMaterialsLoading(true);
    try {
      const headers = getStudentHeaders();
      const response = await fetch(`https://hydersoft.com/api/enrolledstudent/course/${courseId}/materials`, {
        headers
      });
      const data = await response.json();

      if (response.status === 401) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      if (response.status === 403) {
        setError('Access denied. Please make sure you are enrolled in this course.');
        return;
      }

      if (data.success) {
        setMaterials(data.data || []);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch materials');
        setMaterials([]);
      }
    } catch (err) {
      setError('Network error while fetching materials: ' + err.message);
      setMaterials([]);
      console.error('Error fetching materials:', err);
    } finally {
      setMaterialsLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      if (!isStudentAuthenticated()) {
        setError('Please log in as a student to access course materials');
        setLoading(false);
        return;
      }
      setLoading(true);
      await fetchMyCourses();
      setLoading(false);
    };
    initializeData();
  }, []);

  // Fetch materials when course selection changes
  useEffect(() => {
    if (selectedCourse) {
      fetchCourseMaterials(selectedCourse);
    }
  }, [selectedCourse]);

  // Filter materials
  const filteredMaterials = materials.filter(material => {
    if (!material) return false;
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = material.title?.toLowerCase().includes(searchLower) || false;
    const descriptionMatch = material.description?.toLowerCase().includes(searchLower) || false;
    const fileNameMatch = material.file_name?.toLowerCase().includes(searchLower) || false;
    return titleMatch || descriptionMatch || fileNameMatch;
  });

  // Handle material download
  const handleDownload = async (material) => {
    try {
      setDownloadingId(material.material_id);
      const studentUser = getStudentUser();
      
      if (!studentUser || !studentUser.id) {
        setError('Authentication required. Please log in again.');
        return;
      }

      let downloadUrl = material.download_url;
      if (!downloadUrl.includes('student_id=')) {
        const separator = downloadUrl.includes('?') ? '&' : '?';
        downloadUrl = `${downloadUrl}${separator}student_id=${studentUser.id}`;
      }

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = material.title || material.file_name || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Material download initiated:', material.title);
    } catch (err) {
      console.error('Error downloading material:', err);
      setError('Failed to download material. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  // ✅ SIMPLIFIED: Handle material preview 
  const handlePreview = (material) => {
    try {
      console.log('Opening preview for material:', material.title);
      
      const studentUser = getStudentUser();
      if (!studentUser || !studentUser.id) {
        setError('Authentication required. Please log in again.');
        return;
      }

      // Create authenticated preview URL
      let previewUrl = material.preview_url || material.download_url;
      if (!previewUrl.includes('student_id=')) {
        const separator = previewUrl.includes('?') ? '&' : '?';
        previewUrl = `${previewUrl}${separator}student_id=${studentUser.id}`;
      }

      // ✅ SIMPLIFIED: Open preview modal without zoom/rotation controls
      setPreviewModal({
        isOpen: true,
        material: {
          ...material,
          authenticated_preview_url: previewUrl
        },
        loading: false,
        error: ''
      });

    } catch (err) {
      console.error('Error previewing material:', err);
      setError('Failed to preview material. Please try again.');
    }
  };

  // Close preview modal
  const closePreview = () => {
    setPreviewModal({
      isOpen: false,
      material: null,
      loading: false,
      error: ''
    });
  };

  const handleRefresh = () => {
    if (selectedCourse) {
      setRefreshing(true);
      fetchCourseMaterials(selectedCourse).finally(() => {
        setRefreshing(false);
      });
    }
  };

  // ✅ SIMPLIFIED: Get preview content (no zoom/rotation transforms)
  const getPreviewContent = (material) => {
    const fileType = material.file_type?.toLowerCase();
    const url = material.authenticated_preview_url;

    switch (fileType) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
        return (
          <img 
            src={url}
            alt={material.title}
            className="max-w-full max-h-full object-contain"
            onError={() => setPreviewModal(prev => ({ 
              ...prev, 
              error: 'Failed to load image' 
            }))}
          />
        );

      case 'pdf':
        return (
          <iframe 
            src={url}
            className="w-full h-full border-0"
            title={material.title}
            onError={() => setPreviewModal(prev => ({ 
              ...prev, 
              error: 'Failed to load PDF' 
            }))}
          />
        );

      case 'txt':
        return (
          <iframe 
            src={url}
            className="w-full h-full border-0 bg-white p-4"
            title={material.title}
          />
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            {getFileIcon(material.file_type)}
            <h3 className="text-lg font-semibold mt-4 mb-2">{material.title}</h3>
            <p className="text-center mb-4">
              Preview not available for {fileType?.toUpperCase() || 'this file type'}
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Click download to view this file
            </p>
            <button
              onClick={() => handleDownload(material)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaDownload className="w-4 h-4" />
              Download File
            </button>
          </div>
        );
    }
  };

  // Authentication check
  if (!isStudentAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in as a student to access course materials.</p>
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
        <p className="text-gray-600 text-lg">Loading your course materials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpen className="text-blue-500 w-8 h-8" />
                Course Materials
              </h1>
              {getStudentUser() && (
                <p className="text-gray-600 mt-1">
                  Welcome back, <span className="font-medium">{getStudentUser().name || getStudentUser().email_id}</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-48"
                  disabled={courses.length === 0}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCourse && (
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-600 hover:text-red-800 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* No Courses Message */}
      {courses.length === 0 && !error && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Enrolled Courses</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Purchase a course to access course materials.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {selectedCourse && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Materials ({filteredMaterials.length})
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Materials List */}
          <div className="bg-white rounded-lg shadow-lg">
            {materialsLoading ? (
              <div className="p-12 text-center">
                <Loader className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
                <p className="text-gray-500">Loading materials...</p>
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {materials.length === 0 ? 'No Materials Available' : 'No Materials Found'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {materials.length === 0
                    ? 'No materials have been uploaded for this course yet. Check back later!'
                    : 'No materials match your search criteria. Try different keywords.'
                  }
                </p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'divide-y divide-gray-200'
              }>
                {filteredMaterials.map((material) => (
                  <div
                    key={material.material_id}
                    className={
                      viewMode === 'grid'
                        ? 'p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200'
                        : 'p-6 hover:bg-gray-50 transition-colors duration-200'
                    }
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          {getFileIcon(material.file_type)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-2 truncate">
                          {material.title}
                        </h3>

                        {material.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {material.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getFileTypeColor(material.file_type)}`}>
                            {material.file_type?.toUpperCase() || 'FILE'}
                          </span>

                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(material.created_at).toLocaleDateString()}</span>
                          </div>

                          {material.file_name && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <File className="w-3 h-3" />
                              <span className="truncate max-w-20" title={material.file_name}>
                                {material.file_name}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownload(material)}
                            disabled={downloadingId === material.material_id}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                          >
                            {downloadingId === material.material_id ? (
                              <>
                                <Loader className="w-3 h-3 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <FaDownload className="w-3 h-3" />
                                Download
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handlePreview(material)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            <Eye className="w-3 h-3" />
                            Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ SIMPLIFIED: Preview Modal (removed zoom, rotation controls) */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
            onClick={closePreview}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-6xl max-h-full w-full h-full flex flex-col">
              
              {/* ✅ SIMPLIFIED: Header with basic info only */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    {getFileIcon(previewModal.material?.file_type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {previewModal.material?.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {previewModal.material?.file_type?.toUpperCase()} • {new Date(previewModal.material?.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {/* ✅ SIMPLIFIED: Only Download and Close buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(previewModal.material)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <FaDownload className="w-3 h-3" />
                    Download
                  </button>
                  
                  <button
                    onClick={closePreview}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center">
                {previewModal.loading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-gray-600">Loading preview...</p>
                  </div>
                ) : previewModal.error ? (
                  <div className="flex flex-col items-center gap-3 text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Preview Error</h3>
                    <p className="text-gray-600">{previewModal.error}</p>
                    <button
                      onClick={() => handleDownload(previewModal.material)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FaDownload className="w-4 h-4" />
                      Download Instead
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                    {getPreviewContent(previewModal.material)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsList;
