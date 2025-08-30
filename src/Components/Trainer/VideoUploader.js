import React, { useState, useEffect } from 'react';

function VideoUploader() {
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sequence, setSequence] = useState(1);
  const [video, setVideo] = useState(null);
  const [courseId, setCourseId] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [deletingVideo, setDeletingVideo] = useState(null);

  // Get authentication token from localStorage
  const token = localStorage.getItem('authToken');
  const trainerUser = JSON.parse(localStorage.getItem('trainerUser') || '{}');

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // File validation function
  const validateFile = (file) => {
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
    const maxSize = 100 * 1024 * 1024; // 100MB (matches backend)

    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid video file (MP4, MOV, AVI, WMV)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 100MB';
    }

    return null;
  };

  // Handle file selection with validation and preview
  const handleFileChange = (file) => {
    if (file) {
      const error = validateFile(file);
      if (error) {
        setUploadMessage(error);
        setVideo(null);
        setVideoPreview(null);
        return;
      }

      setVideo(file);
      setUploadMessage('');

      // Clean up previous preview
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      // Create new preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  // Get video URL helper function
  const getVideoUrl = (video) => {
    if (video.video_url) {
      return video.video_url;
    } else if (video.video_path) {
      return `https://hydersoft.com/storage/app/public/${video.video_path}`;
    }
    return null;
  };

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
        console.log('Fetching courses with token:', token?.substring(0, 20) + '...');

        const response = await fetch('https://hydersoft.com/api/courses/trainer/my-courses', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        console.log('Courses response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.log('Courses error response:', errorText);

          if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
          } else if (response.status === 403) {
            throw new Error('Access denied. You are not authorized to view courses.');
          } else {
            throw new Error(`Failed to fetch courses: HTTP ${response.status}`);
          }
        }

        const result = await response.json();
        console.log('Courses fetched:', result);

        // Handle the response structure from backend
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

  // Fetch videos when courseId changes
  useEffect(() => {
    if (courseId && token) {
      fetchVideos();
    } else {
      setVideos([]);
    }
  }, [courseId, token]);

  // Enhanced fetch videos function
  const fetchVideos = async () => {
    if (!courseId || !checkAuth()) return;

    setLoading(true);
    try {
      console.log(`Fetching videos for course: ${courseId}`);
      const response = await fetch(`https://hydersoft.com/api/trainer/courses/${courseId}/videos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      console.log('Videos response status:', response.status);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You are not authorized to view videos for this course');
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else {
          throw new Error(`Failed to fetch videos: HTTP ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('Videos API response:', data);

      // Backend returns array directly for this endpoint
      const videoData = Array.isArray(data) ? data : [];
      console.log('Processed videos:', videoData);
      setVideos(videoData);

    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]);
      setUploadMessage(error.message);
      setTimeout(() => setUploadMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Upload with progress tracking
  const uploadWithProgress = (formData, url, method = 'POST') => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed: HTTP ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Network error during upload')));

      xhr.open(method, url);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  };

  // Enhanced upload handler
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!checkAuth()) return;

    if (!video && !editingVideo) {
      setUploadMessage('Please select a video file.');
      return;
    }

    if (!title || !courseId) {
      setUploadMessage('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('sequence', sequence);
    formData.append('course_id', courseId);

    if (video) {
      formData.append('video', video); // Use 'video' not 'video_path'
    }

    // Debug: Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let result;

      if (editingVideo) {
        // Update existing video
        result = await uploadWithProgress(
          formData,
          `https://hydersoft.com/api/trainer/updatevideos/${editingVideo.video_id || editingVideo.id}`,
          'POST'
        );
      } else {
        // Upload new video
        result = await uploadWithProgress(
          formData,
          'https://hydersoft.com/api/trainer/videos',
          'POST'
        );
      }

      console.log('Upload/Update result:', result);

      // Handle backend response structure
      if (result.success) {
        setUploadSuccess(`✅ ${result.message}`);
        setUploadMessage('');
      } else {
        throw new Error(result.error || (editingVideo ? 'Update failed' : 'Upload failed'));
      }

      setTimeout(() => setUploadSuccess(''), 4000);

      // Reset form
      resetForm();
      fetchVideos();

    } catch (error) {
      setUploadSuccess('');
      setUploadMessage(error.message || (editingVideo ? 'Update failed' : 'Upload failed'));
      console.error(editingVideo ? 'Update error:' : 'Upload error:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Enhanced delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    if (!checkAuth()) return;

    setDeletingVideo(id);
    try {
      const response = await fetch(`https://hydersoft.com/api/trainer/videos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You are not authorized to delete this video');
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else {
          throw new Error(`Delete failed: HTTP ${response.status}`);
        }
      }

      const result = await response.json();

      if (result.success) {
        setUploadSuccess(`✅ ${result.message}`);
        setTimeout(() => setUploadSuccess(''), 3000);
        fetchVideos();
      } else {
        throw new Error(result.error || 'Delete failed');
      }

    } catch (error) {
      console.error('Error deleting video:', error);
      setUploadMessage(error.message);
      setTimeout(() => setUploadMessage(''), 3000);
    } finally {
      setDeletingVideo(null);
    }
  };

  const handleEdit = (videoToEdit) => {
    setEditingVideo(videoToEdit);
    setTitle(videoToEdit.title);
    setDescription(videoToEdit.description || '');
    setSequence(videoToEdit.sequence);
    setCourseId(videoToEdit.course_id);
    setVideo(null);
    setVideoPreview(null);
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
    setSequence(1);
    setVideo(null);
    setEditingVideo(null);
    setShowModal(false);
    setUploadProgress(0);

    // Clean up preview
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
  };

  const handleModalClose = () => {
    resetForm();
    setUploadMessage('');
    setUploadSuccess('');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  // Show login message if not authenticated
  if (!token) {
    return (
      <div className="p-6 max-w-full">
        <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p>Please log in as a trainer to access the video uploader.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Video Management</h1>
        <p className="text-gray-600">Manage videos for your assigned courses</p>
        {trainerUser.name && (
          <p className="text-sm text-gray-500">Logged in as: {trainerUser.name}</p>
        )}
      </div>

      {/* Course Selection */}
      <div className="mb-4 sm:mb-6">
        <label className="block mb-2 font-medium text-sm sm:text-base">Select Course to View Videos:</label>
        <select
          className="w-full sm:max-w-md border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          value={courseId}
          onChange={e => handleCourseChange(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.course_id} value={course.course_id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Button */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold lg:hidden">Videos</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Upload Video
        </button>
      </div>

      {/* Error Message */}
      {uploadMessage && (
        <div className="mb-4 text-red-700 bg-red-100 border border-red-300 px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base">
          {uploadMessage}
        </div>
      )}

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
          Loading videos...
        </div>
      )}

      {/* Desktop Table View with Date Column */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Course ID</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Title</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Description</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Date</th> {/* NEW DATE COLUMN */}
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Sequence</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Video</th>
              <th className="px-4 py-3 border text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!courseId ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">Please select a course to view videos.</td>
              </tr>
            ) : Array.isArray(videos) && videos.length > 0 ? (
              videos.map(video => (
                <tr key={video.video_id || video.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 border text-center text-sm">{video.course_id}</td>
                  <td className="px-4 py-3 border text-sm font-medium">{video.title}</td>
                  <td className="px-4 py-3 border text-sm max-w-xs truncate" title={video.description}>
                    {video.description || '-'}
                  </td>
                  <td className="px-4 py-3 border text-sm text-center">{formatDate(video.created_at)}</td> {/* DISPLAY DATE FROM created_at */}
                  <td className="px-4 py-3 border text-center text-sm">{video.sequence}</td>
                  <td className="px-4 py-3 border text-blue-600 underline text-sm">
                    {getVideoUrl(video) ? (
                      <a href={getVideoUrl(video)} target="_blank" rel="noreferrer" className="hover:text-blue-800">View</a>
                    ) : (
                      <span className="text-gray-500">No video</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border text-center">
                    <span
                      onClick={() => handleEdit(video)}
                      className="cursor-pointer text-blue-600 hover:text-blue-800 mr-2 text-lg"
                      title="Edit video"
                    >
                      ✏️
                    </span>
                    <span
                      onClick={() => handleDelete(video.video_id || video.id)}
                      className={`cursor-pointer hover:text-red-800 text-lg ${
                        deletingVideo === (video.video_id || video.id)
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-red-600'
                      }`}
                      title={deletingVideo === (video.video_id || video.id) ? "Deleting..." : "Delete video"}
                    >
                      {deletingVideo === (video.video_id || video.id) ? '⏳' : '🗑️'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  {courseId ? 'No videos uploaded yet for this course.' : 'Select a course to view videos.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View with Date */}
      <div className="lg:hidden">
        {!courseId ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            Please select a course to view videos.
          </div>
        ) : Array.isArray(videos) && videos.length > 0 ? (
          <div className="space-y-4">
            {videos.map(video => (
              <div key={video.video_id || video.id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-base text-gray-900 flex-1 mr-2">{video.title}</h3>
                  <div className="flex space-x-2 flex-shrink-0">
                    <span
                      onClick={() => handleEdit(video)}
                      className="cursor-pointer text-blue-600 hover:text-blue-800 text-lg"
                      title="Edit video"
                    >
                      ✏️
                    </span>
                    <span
                      onClick={() => handleDelete(video.video_id || video.id)}
                      className={`cursor-pointer hover:text-red-800 text-lg ${
                        deletingVideo === (video.video_id || video.id)
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-red-600'
                      }`}
                      title={deletingVideo === (video.video_id || video.id) ? "Deleting..." : "Delete video"}
                    >
                      {deletingVideo === (video.video_id || video.id) ? '⏳' : '🗑️'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course ID:</span>
                    <span className="font-medium">{video.course_id}</span>
                  </div>

                  {video.description && (
                    <div>
                      <span className="text-gray-600">Description:</span>
                      <p className="text-gray-900 mt-1">{video.description}</p>
                    </div>
                  )}

                  {/* Date in Mobile View */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(video.created_at)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Sequence:</span>
                    <span className="font-medium">{video.sequence}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Video:</span>
                    {getVideoUrl(video) ? (
                      <a
                        href={getVideoUrl(video)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline hover:text-blue-800 font-medium"
                      >
                        View Video
                      </a>
                    ) : (
                      <span className="text-gray-500">No video</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            {courseId ? 'No videos uploaded yet for this course.' : 'Select a course to view videos.'}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {editingVideo ? 'Edit Video' : 'Upload Video'}
            </h2>

            <div className="space-y-4">
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
                <label className="block mb-1 font-medium text-sm sm:text-base">Title *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Description</label>
                <textarea
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base h-20 sm:h-24 resize-vertical"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter video description..."
                ></textarea>
              </div>

              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Sequence *</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  value={sequence}
                  onChange={e => setSequence(parseInt(e.target.value) || 1)}
                  min="1"
                  placeholder="Enter sequence number"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">
                  {editingVideo ? 'Upload New Video (optional)' : 'Upload Video *'}
                </label>
                <input
                  type="file"
                  className="w-full text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept="video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv"
                  onChange={e => handleFileChange(e.target.files[0])}
                  required={!editingVideo}
                />
                {editingVideo && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Leave empty to keep the current video file
                  </p>
                )}
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Supported formats: MP4, MOV, AVI, WMV (Max: 100MB)
                </p>
              </div>

              {/* Video Preview */}
              {videoPreview && (
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-sm">Preview:</label>
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-h-48 bg-gray-100 rounded"
                  />
                </div>
              )}

              {/* Upload Progress */}
              {uploading && uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Upload Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

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
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={uploading || !title || !courseId || (!video && !editingVideo)}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingVideo ? 'Updating...' : 'Uploading...'}
                    </span>
                  ) : (
                    editingVideo ? 'Update' : 'Upload'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoUploader;
