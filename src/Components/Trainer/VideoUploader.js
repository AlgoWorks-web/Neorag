// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function VideoUploader() {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [sequence, setSequence] = useState(1);
//   const [courseId, setCourseId] = useState('');
//   const [video, setVideo] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadMessage, setUploadMessage] = useState('');
//   const [courses, setCourses] = useState([]);

//   // Fetch courses on mount
//   useEffect(() => {
//     axios.get('http://localhost:8000/api/courses/getcourse')
//       .then(response => {
//         setCourses(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching courses:', error);
//       });
//   }, []);

//   // Upload video handler
//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!video || !title || !courseId) {
//       setUploadMessage('Please fill in all required fields.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('sequence', sequence);
//     formData.append('course_id', courseId);
//     formData.append('video', video);

//     setUploading(true);
//     try {
//       const response = await axios.post('http://localhost:8000/api/trainer/videos', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       setUploadMessage('Video uploaded successfully!');
//       setTitle('');
//       setDescription('');
//       setSequence(1);
//       setVideo(null);
//       setCourseId('');
//     } catch (error) {
//       setUploadMessage(error?.response?.data?.message || 'Upload failed');
//       console.error('Upload error:', error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-semibold mb-4">Upload Training Video</h2>

//       {uploadMessage && (
//         <div className={`mb-4 p-3 rounded ${uploadMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//           {uploadMessage}
//         </div>
//       )}

//       <form onSubmit={handleUpload} className="space-y-4">
//         <div>
//           <label className="block mb-1 font-medium">Select Course <span className="text-red-500">*</span></label>
//           <select
//             className="w-full p-2 border border-gray-300 rounded text-black bg-white"
//             value={courseId}
//             onChange={(e) => setCourseId(e.target.value)}
//             required
//           >
//             <option value="">-- Choose Course --</option>
//             {courses.map((course) => (
//               <option key={course.course_id} value={course.course_id}>
//                 {course.title}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Video Title <span className="text-red-500">*</span></label>
//           <input
//             type="text"
//             className="w-full border rounded px-3 py-2"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Description</label>
//           <textarea
//             className="w-full border rounded px-3 py-2"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Sequence</label>
//           <input
//             type="number"
//             className="w-full border rounded px-3 py-2"
//             value={sequence}
//             onChange={(e) => setSequence(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Choose Video File <span className="text-red-500">*</span></label>
//           <input
//             type="file"
//             accept="video/mp4,video/mov,video/avi,video/wmv"
//             className="w-full"
//             onChange={(e) => setVideo(e.target.files[0])}
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//           disabled={uploading}
//         >
//           {uploading ? 'Uploading...' : 'Upload Video'}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default VideoUploader;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  // Fetch courses
  useEffect(() => {
    axios.get('http://localhost:8000/api/courses/getcourse')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  // Fetch videos
  const fetchVideos = () => {
    axios.get('http://localhost:8000/api/trainer/videos')
      .then(response => {
        setVideos(response.data);
      })
      .catch(error => {
        console.error('Error fetching videos:', error);
      });
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!video || !title || !courseId) {
      setUploadMessage('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('sequence', sequence);
    formData.append('course_id', courseId);
    formData.append('video', video);

    setUploading(true);
    try {
      await axios.post('http://localhost:8000/api/trainer/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadMessage('');
      setUploadSuccess('✅ Video uploaded successfully!');
      setTimeout(() => setUploadSuccess(''), 4000);

      setTitle('');
      setDescription('');
      setSequence(1);
      setVideo(null);
      setCourseId('');
      setShowModal(false);
      fetchVideos();
    } catch (error) {
      setUploadSuccess('');
      setUploadMessage(error?.response?.data?.message || 'Upload failed');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/trainer/videos/${id}`);
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  return (
    <div className="p-4">
      {/* Upload Button */}
      <div className="text-right mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Video
        </button>
      </div>

      {/* Success Message */}
      {uploadSuccess && (
        <div className="mb-4 text-green-700 bg-green-100 border border-green-300 px-4 py-2 rounded">
          {uploadSuccess}
        </div>
      )}

      {/* Video Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Course ID</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Sequence</th>
              <th className="px-4 py-2 border">Video</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(videos) && videos.length > 0 ? (
              videos.map(video => (
                <tr key={video.id}>
                  <td className="px-4 py-2 border text-center">{video.course_id}</td>
                  <td className="px-4 py-2 border">{video.title}</td>
                  <td className="px-4 py-2 border">{video.description}</td>
                  <td className="px-4 py-2 border text-center">{video.sequence}</td>
                  <td className="px-4 py-2 border text-blue-600 underline">
                    <a href={video.video_url} target="_blank" rel="noreferrer">View</a>
                  </td>
                  <td className="px-4 py-2 border text-center">
                    ✏️ | <span onClick={() => handleDelete(video.id)} className="cursor-pointer text-red-600">🗑️</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">No videos uploaded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl relative">
            <h2 className="text-xl font-bold mb-4">Upload Video</h2>
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Course</label>
                <select
                  className="w-full border px-3 py-2 rounded"
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
              <div className="mb-4">
                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Sequence</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={sequence}
                  onChange={e => setSequence(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Upload Video</label>
                <input
                  type="file"
                  className="w-full"
                  accept="video/*"
                  onChange={e => setVideo(e.target.files[0])}
                  required
                />
              </div>

              {uploadMessage && (
                <div className="mb-2 text-sm text-red-600">{uploadMessage}</div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoUploader;
