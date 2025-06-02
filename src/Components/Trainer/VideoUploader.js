// src/components/Trainer/VideoUploader.js
import React, { useState } from 'react';
import { FaDownload, FaTrash, FaPlus, FaSave, FaFilm, FaRegFileVideo } from 'react-icons/fa';
import FileUpload from '../Common/FileUpload';

const VideoUploader = () => {
  const [videos, setVideos] = useState([
    { 
      id: 1, 
      title: 'React Hooks Explained', 
      filename: 'react-hooks-tutorial.mp4',
      type: 'mp4', 
      size: '45.2 MB', 
      date: '2023-06-15',
      course: 'React Fundamentals',
      description: 'Deep dive into React hooks usage',
      duration: '12:45'
    },
    { 
      id: 2, 
      title: 'JavaScript Async/Await', 
      filename: 'async-await-guide.mov',
      type: 'mov', 
      size: '78.1 MB', 
      date: '2023-06-10',
      course: 'Advanced JavaScript',
      description: 'Master asynchronous programming in JS',
      duration: '18:32'
    }
  ]);
  
  const [showUpload, setShowUpload] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    course: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  
  const courses = [
    { id: 1, title: 'React Fundamentals' },
    { id: 2, title: 'Advanced JavaScript' },
    { id: 3, title: 'Node.js Backend Development' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVideo(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadError('');
    if (!newVideo.title) {
      const filenameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setNewVideo(prev => ({ ...prev, title: filenameWithoutExt }));
    }
  };

  const getVideoIcon = (type) => {
    const videoTypes = ['mp4', 'mov', 'avi', 'mkv', 'wmv'];
    return videoTypes.includes(type) 
      ? <FaFilm className="text-red-600 text-xl" /> 
      : <FaRegFileVideo className="text-blue-600 text-xl" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadError('Please select a video file');
      return;
    }
    
    if (!newVideo.title || !newVideo.course) {
      setUploadError('Title and course are required');
      return;
    }

    const extension = selectedFile.name.split('.').pop().toLowerCase();
    const validTypes = ['mp4', 'mov', 'avi', 'mkv', 'wmv'];
    
    if (!validTypes.includes(extension)) {
      setUploadError('Only video files are allowed (MP4, MOV, AVI, MKV, WMV)');
      return;
    }

    const newVideoEntry = {
      id: videos.length + 1,
      title: newVideo.title,
      filename: selectedFile.name,
      type: extension,
      size: formatFileSize(selectedFile.size),
      date: new Date().toISOString().split('T')[0],
      course: newVideo.course,
      description: newVideo.description,
      duration: '00:00'
    };

    setVideos([...videos, newVideoEntry]);
    setNewVideo({ title: '', description: '', course: '' });
    setSelectedFile(null);
    setShowUpload(false);
    setUploadError('');
  };

  const handleDelete = (id) => {
    setVideos(videos.filter(video => video.id !== id));
  };

  const handleDownload = (video) => {
    alert(`Downloading ${video.title}...`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Video Materials</h1>
        <button 
          onClick={() => setShowUpload(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Upload Video
        </button>
      </div>

      {showUpload && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload New Video</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Video File *</label>
                <FileUpload 
                  onFileSelect={handleFileSelect} 
                  accept="video/*"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: MP4, MOV, AVI, MKV, WMV
                </p>
              </div>
              
              <div>
                <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newVideo.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Video title"
                />
              </div>
              
              <div>
                <label htmlFor="course" className="block text-gray-700 text-sm font-medium mb-2">Course *</label>
                <select
                  id="course"
                  name="course"
                  value={newVideo.course}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.title}>{course.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newVideo.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Video description"
                ></textarea>
              </div>
            </div>
            
            {uploadError && (
              <div className="mb-4 text-red-600 text-sm">{uploadError}</div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowUpload(false);
                  setSelectedFile(null);
                  setUploadError('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <FaSave className="mr-2" /> Upload Video
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {videos.map((video) => (
              <tr key={video.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getVideoIcon(video.type)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{video.title}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <span className="mr-2">{video.filename}</span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {video.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">{video.description}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{video.course}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {video.duration}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {video.size}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {video.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDownload(video)}
                    className="text-blue-600 hover:text-blue-900 mx-2"
                    title="Download"
                  >
                    <FaDownload />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="text-red-600 hover:text-red-900 mx-2"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {videos.length === 0 && !showUpload && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaRegFileVideo className="mx-auto text-5xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No videos uploaded yet</h3>
            <p className="text-gray-500 mb-6">Upload your first training video to get started</p>
            <button 
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center mx-auto"
            >
              <FaPlus className="mr-2" /> Upload Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploader;