import React, { useState, useEffect } from 'react';
import {
  Play,
  Clock,
  BookOpen,
  Search,
  Grid3X3,
  List,
  Eye,
  AlertCircle,
  Users,
  Calendar,
  RefreshCw,
  Loader
} from 'lucide-react';
import { getStudentUser, isStudentAuthenticated } from '../../auth/authUtils';

function VideoLectures() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [authenticatedVideoUrl, setAuthenticatedVideoUrl] = useState('');

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

  // Helper function to safely get course info (handles both old and new data structures)
  const getCourseInfo = (enrollment) => {
    if (!enrollment) return { id: null, title: 'Unknown Course' };

    // Handle new nested structure
    if (enrollment.course) {
      return {
        id: enrollment.course.course_id,
        title: enrollment.course.title || 'Unknown Course'
      };
    } else if (enrollment.course_id) {
      // Fallback for old flattened structure
      return {
        id: enrollment.course_id,
        title: enrollment.course_name || 'Unknown Course'
      };
    }

    return { id: null, title: 'Unknown Course' };
  };

  // Create authenticated video URL
  const createAuthenticatedVideoUrl = (video) => {
    const studentUser = getStudentUser();
    if (!studentUser || !studentUser.id) {
      return video.stream_url;
    }

    const baseUrl = video.stream_url;
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}student_id=${studentUser.id}`;
  };

  // Fetch enrolled courses
  const fetchMyCourses = async () => {
    try {
      const headers = getStudentHeaders();

      const response = await fetch('https://hydersoft.com/api/enrolledstudent/my-courses', {
        headers
      });

      const data = await response.json();

      console.log('=== API Response Debug ===');
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.status === 401) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      if (data.success) {
        setCourses(data.data);
        console.log('Courses set:', data.data);

        // Auto-select first course if available
        if (data.data.length > 0) {
          const firstCourse = getCourseInfo(data.data[0]);
          if (firstCourse.id) {
            setSelectedCourse(firstCourse.id);
            console.log('Auto-selected course:', firstCourse.id);
          }
        }
      } else {
        setError(data.message || data.error || 'Failed to fetch courses');
      }
    } catch (err) {
      setError('Network error while fetching courses: ' + err.message);
      console.error('Error fetching courses:', err);
    }
  };

  // Fetch videos for selected course
  // Fetch videos for selected course
  const fetchCourseVideos = async (courseId) => {
    if (!courseId) return;

    console.log('=== FETCH VIDEOS DEBUG ===');
    console.log('Course ID:', courseId);
    console.log('Course ID type:', typeof courseId);

    setVideoLoading(true);
    try {
      const headers = getStudentHeaders();

      // FIXED: Ensure proper URL construction
      const videoUrl = `https://hydersoft.com/api/enrolledstudent/course/${courseId}/videos`;
      console.log('Video API URL:', videoUrl);

      const response = await fetch(videoUrl, {
        method: 'GET', // Explicitly set method
        headers
      });

      console.log('=== VIDEO API RESPONSE ===');
      console.log('Response status:', response.status);
      console.log('Response URL:', response.url);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.status === 401) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      if (response.status === 403) {
        setError('Access denied. Please make sure you are enrolled in this course.');
        return;
      }

      if (data.success) {
        setVideos(data.data);
        setError('');

        // Auto-select first video if none selected
        if (data.data.length > 0 && !selectedVideo) {
          handleVideoSelect(data.data[0]);
        }
      } else {
        setError(data.error || data.message || 'Failed to fetch videos');
        setVideos([]);
      }
    } catch (err) {
      setError('Network error while fetching videos: ' + err.message);
      setVideos([]);
      console.error('Error fetching videos:', err);
    } finally {
      setVideoLoading(false);
    }
  };


  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      if (!isStudentAuthenticated()) {
        setError('Please log in as a student to access videos');
        setLoading(false);
        return;
      }

      setLoading(true);
      await fetchMyCourses();
      setLoading(false);
    };

    initializeData();
  }, []);

  // Debug logging for courses data
  useEffect(() => {
    console.log('=== COURSES DATA DEBUG ===');
    console.log('Courses array:', courses);
    console.log('First course structure:', courses[0]);
    console.log('Selected course ID:', selectedCourse);
  }, [courses, selectedCourse]);

  // Fetch videos when course selection changes
  useEffect(() => {
    if (selectedCourse) {
      setSelectedVideo(null);
      setAuthenticatedVideoUrl('');
      fetchCourseVideos(selectedCourse);
    }
  }, [selectedCourse]);

  // Filter videos based on search only
  const filteredVideos = videos.filter(video => {
    return video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle video selection
  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setError('');

    const authenticatedUrl = createAuthenticatedVideoUrl(video);
    setAuthenticatedVideoUrl(authenticatedUrl);
  };

  // Handle video time update
  const handleTimeUpdate = (e) => {
    const video = e.target;
    setCurrentTime(video.currentTime);
  };

  // Handle video loaded metadata
  const handleLoadedMetadata = (e) => {
    const video = e.target;
    setDuration(video.duration);
  };

  // Handle video error
  const handleVideoError = (e) => {
    console.error('Video playback error:', e);
    setError('Failed to load video. Please check your connection or try refreshing the page.');
  };

  // Handle video loading events
  const handleVideoLoadStart = () => {
    setVideoLoading(true);
  };

  const handleVideoCanPlay = () => {
    setVideoLoading(false);
  };

  const handleVideoPlaying = () => {
    setVideoLoading(false);
    setIsPlaying(true);
  };

  // Refresh videos
  const handleRefresh = () => {
    if (selectedCourse) {
      setRefreshing(true);
      fetchCourseVideos(selectedCourse).finally(() => {
        setRefreshing(false);
      });
    }
  };

  // Authentication check
  if (!isStudentAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in as a student to access video lectures.</p>
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
        <p className="text-gray-600 text-lg">Loading your video lectures...</p>
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
                <Play className="text-blue-500 w-8 h-8" />
                Video Lectures
              </h1>
              {getStudentUser() && (
                <p className="text-gray-600 mt-1">
                  Welcome back, <span className="font-medium">{getStudentUser().username || getStudentUser().email_id}</span>
                </p>
              )}
            </div>

            {/* Course Selector - UPDATED */}
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
                  {courses.map(enrollment => {
                    const courseInfo = getCourseInfo(enrollment);
                    return (
                      <option
                        key={courseInfo.id || enrollment.enrollment_id}
                        value={courseInfo.id}
                      >
                        {courseInfo.title}
                      </option>
                    );
                  })}
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
              You haven't enrolled in any courses yet. Purchase a course to access video lectures.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {selectedCourse && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Video Player Section */}
            <div className="xl:col-span-2">
              {selectedVideo ? (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Video Player */}
                  <div className="relative bg-black aspect-video">
                    {videoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
                        <div className="text-center">
                          <Loader className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                          <p className="text-white text-sm">Loading video...</p>
                        </div>
                      </div>
                    )}

                    <video
                      key={selectedVideo.video_id}
                      className="w-full h-full"
                      controls
                      controlsList="nodownload"
                      preload="metadata"
                      crossOrigin="anonymous"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onError={handleVideoError}
                      onLoadStart={handleVideoLoadStart}
                      onCanPlay={handleVideoCanPlay}
                      onPlaying={handleVideoPlaying}
                    >
                      <source
                        src={authenticatedVideoUrl || selectedVideo.stream_url}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  {/* Video Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedVideo.title}
                      </h2>
                      {selectedVideo.description && (
                        <p className="text-gray-600 leading-relaxed">
                          {selectedVideo.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Sequence {selectedVideo.sequence}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(selectedVideo.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatDuration(currentTime)} / {formatDuration(duration)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Video</h3>
                  <p className="text-gray-600">Choose a video from the playlist to start watching</p>
                </div>
              )}
            </div>

            {/* Video Playlist Section */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow-lg">
                {/* Playlist Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Course Videos ({filteredVideos.length})
                    </h3>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                          }`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                          }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Search Only */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search videos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Video List */}
                <div className="max-h-96 overflow-y-auto">
                  {filteredVideos.length === 0 ? (
                    <div className="p-6 text-center">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">
                        {videos.length === 0 ? 'No videos available for this course' : 'No videos match your search'}
                      </p>
                    </div>
                  ) : (
                    <div className={viewMode === 'grid' ? 'p-4 grid grid-cols-1 gap-3' : 'divide-y divide-gray-200'}>
                      {filteredVideos.map((video) => (
                        <div
                          key={video.video_id}
                          onClick={() => handleVideoSelect(video)}
                          className={`cursor-pointer transition-all duration-200 ${viewMode === 'grid'
                            ? `p-4 rounded-lg border-2 hover:shadow-md ${selectedVideo?.video_id === video.video_id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }`
                            : `p-4 hover:bg-gray-50 ${selectedVideo?.video_id === video.video_id ? 'bg-blue-50' : ''
                            }`
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-8 bg-gray-900 rounded flex items-center justify-center">
                                <Play className="w-4 h-4 text-white" />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate mb-1">
                                {video.title}
                              </h4>

                              {video.description && viewMode === 'grid' && (
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                  {video.description}
                                </p>
                              )}

                              <div className="text-xs text-gray-500">
                                <span>Sequence {video.sequence}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoLectures;
