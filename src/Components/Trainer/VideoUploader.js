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

  // Fetch courses (your original code)
  useEffect(() => {
    fetch('https://hydersoft.com/api/courses/getcourse')
      .then(response => response.json())
      .then(data => {
        console.log('Courses fetched:', data);
        setCourses(data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  // Fetch videos when courseId changes
  useEffect(() => {
    if (courseId) {
      fetchVideos();
    } else {
      setVideos([]);
    }
  }, [courseId]);

  // Fixed fetch videos function (your original code with the fix)
  const fetchVideos = async () => {
    if (!courseId) return;

    setLoading(true);
    try {
      console.log(`Fetching videos for course: ${courseId}`);
      const response = await fetch(`https://hydersoft.com/api/trainer/courses/${courseId}/videos`);
      const data = await response.json();
      
      console.log('Full API response:', data);
      
      // Fix: Access the nested data array
      let videoData = [];
      if (data && data.success && Array.isArray(data.data)) {
        videoData = data.data;
      } else if (Array.isArray(data)) {
        // Fallback for direct array response
        videoData = data;
      }
      
      console.log('Processed videos:', videoData);
      setVideos(videoData);
      
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]);
      setUploadMessage(`Failed to fetch videos: ${error.message}`);
      setTimeout(() => setUploadMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

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
      formData.append('video', video);
    }

    setUploading(true);
    try {
      let response;
      
      if (editingVideo) {
        // Update existing video
        response = await fetch(`https://hydersoft.com/api/trainer/updatevideos/${editingVideo.video_id || editingVideo.id}`, {
          method: 'POST',
          body: formData,
        });
      } else {
        // Upload new video
        response = await fetch('https://hydersoft.com/api/trainer/videos', {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error(`${editingVideo ? 'Update' : 'Upload'} failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload/Update result:', result);

      if (editingVideo) {
        setUploadSuccess('✅ Video updated successfully!');
      } else {
        setUploadSuccess('✅ Video uploaded successfully!');
      }
      
      setUploadMessage('');
      setTimeout(() => setUploadSuccess(''), 4000);

      setTitle('');
      setDescription('');
      setSequence(1);
      setVideo(null);
      setEditingVideo(null);
      setShowModal(false);
      fetchVideos();

    } catch (error) {
      setUploadSuccess('');
      setUploadMessage(error.message || (editingVideo ? 'Update failed' : 'Upload failed'));
      console.error(editingVideo ? 'Update error:' : 'Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      const response = await fetch(`https://hydersoft.com/api/trainer/videos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }
      
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      setUploadMessage(`Delete failed: ${error.message}`);
      setTimeout(() => setUploadMessage(''), 3000);
    }
  };

  const handleEdit = (videoToEdit) => {
    setEditingVideo(videoToEdit);
    setTitle(videoToEdit.title);
    setDescription(videoToEdit.description || '');
    setSequence(videoToEdit.sequence);
    setCourseId(videoToEdit.course_id);
    setVideo(null);
    setShowModal(true);
    setUploadMessage('');
    setUploadSuccess('');
  };

  const handleCourseChange = (selectedCourseId) => {
    setCourseId(selectedCourseId);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingVideo(null);
    setTitle('');
    setDescription('');
    setSequence(1);
    setVideo(null);
    setUploadMessage('');
    setUploadSuccess('');
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full">
      {/* Course Selection */}
      <div className="mb-4 sm:mb-6">
        <label className="block mb-2 font-medium text-sm sm:text-base">Select Course to View Videos:</label>
        <select
          className="w-full sm:max-w-md border px-3 py-2 rounded text-sm sm:text-base"
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
          className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
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
        <div className="mb-4 text-blue-700 bg-blue-100 border border-blue-300 px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base">
          Loading videos...
        </div>
      )}

      {/* Debug Info */}
      {/* <div className="mb-4 text-xs text-gray-600 bg-gray-50 p-2 rounded">
        <strong>Debug:</strong> Course ID: {courseId}, Videos count: {videos.length}
        {videos.length > 0 && (
          <div className="mt-1">
            Video IDs: {videos.map(v => v.video_id).join(', ')}
          </div>
        )}
      </div> */}

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border text-sm font-medium">Course ID</th>
              <th className="px-4 py-3 border text-sm font-medium">Title</th>
              <th className="px-4 py-3 border text-sm font-medium">Description</th>
              <th className="px-4 py-3 border text-sm font-medium">Sequence</th>
              <th className="px-4 py-3 border text-sm font-medium">Video</th>
              <th className="px-4 py-3 border text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!courseId ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">Please select a course to view videos.</td>
              </tr>
            ) : Array.isArray(videos) && videos.length > 0 ? (
              videos.map(video => (
                <tr key={video.video_id || video.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border text-center text-sm">{video.course_id}</td>
                  <td className="px-4 py-3 border text-sm font-medium">{video.title}</td>
                  <td className="px-4 py-3 border text-sm max-w-xs truncate" title={video.description}>
                    {video.description || '-'}
                  </td>
                  <td className="px-4 py-3 border text-center text-sm">{video.sequence}</td>
                  <td className="px-4 py-3 border text-blue-600 underline text-sm">
                    {video.video_url ? (
                      <a href={video.video_url} target="_blank" rel="noreferrer" className="hover:text-blue-800">View</a>
                    ) : video.video_path ? (
                      <a href={`https://hydersoft.com/storage/app/public/${video.video_path}`} target="_blank" rel="noreferrer" className="hover:text-blue-800">View</a>
                    ) : (
                      <span className="text-gray-500">No video</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border text-center">
                    <span
                      onClick={() => handleEdit(video)}
                      className="cursor-pointer text-blue-600 hover:text-blue-800 mr-2"
                      title="Edit video"
                    >
                      ✏️
                    </span>
                    <span
                      onClick={() => handleDelete(video.video_id || video.id)}
                      className="cursor-pointer text-red-600 hover:text-red-800"
                      title="Delete video"
                    >
                      🗑️
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  {courseId ? 'No videos uploaded yet for this course.' : 'Select a course to view videos.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
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
                      className="cursor-pointer text-red-600 hover:text-red-800 text-lg"
                      title="Delete video"
                    >
                      🗑️
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
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sequence:</span>
                    <span className="font-medium">{video.sequence}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Video:</span>
                    {video.video_url ? (
                      <a 
                        href={video.video_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-600 underline hover:text-blue-800 font-medium"
                      >
                        View Video
                      </a>
                    ) : video.video_path ? (
                      <a 
                        href={`https://hydersoft.com/storage/app/public/${video.video_path}`} 
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
                <label className="block mb-1 font-medium text-sm sm:text-base">Course</label>
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
                <label className="block mb-1 font-medium text-sm sm:text-base">Title</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Description</label>
                <textarea
                  className="w-full border px-3 py-2 rounded text-sm sm:text-base h-20 sm:h-24"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter video description..."
                ></textarea>
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">Sequence</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                  value={sequence}
                  onChange={e => setSequence(e.target.value)}
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-sm sm:text-base">
                  {editingVideo ? 'Upload New Video (optional)' : 'Upload Video'}
                </label>
                <input
                  type="file"
                  className="w-full text-sm sm:text-base"
                  accept="video/*"
                  onChange={e => setVideo(e.target.files[0])}
                  required={!editingVideo}
                />
                {editingVideo && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Leave empty to keep the current video file
                  </p>
                )}
              </div>

              {uploadMessage && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {uploadMessage}
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
                  type="button"
                  onClick={handleUpload}
                  className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm sm:text-base"
                  disabled={uploading}
                >
                  {uploading ? (editingVideo ? 'Updating...' : 'Uploading...') : (editingVideo ? 'Update' : 'Upload')}
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