import React, { useState } from 'react';
import { FaPlay, FaCheckCircle, FaClock, FaSearch } from 'react-icons/fa';

const VideoLectureCard = ({ video, onSelect }) => {
  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        video.selected 
          ? 'border-indigo-600 bg-indigo-50 shadow-md' 
          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
      }`}
      onClick={() => onSelect(video.id)}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
            <FaPlay className="text-gray-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${
            video.watched ? 'text-gray-700' : 'text-gray-900'
          }`}>
            {video.title}
            {video.watched && (
              <FaCheckCircle className="text-green-500 ml-2 inline-block" />
            )}
          </p>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <FaClock className="mr-1" />
            <span>{video.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoLectures = () => {
  const [videos, setVideos] = useState([
    { id: 1, title: "Introduction to React", duration: "15:30", watched: true },
    { id: 2, title: "Components and Props", duration: "22:15", watched: true },
    { id: 3, title: "State and Lifecycle", duration: "28:45", watched: false },
    { id: 4, title: "Hooks in Depth", duration: "35:20", watched: false },
    { id: 5, title: "Context API", duration: "24:10", watched: false },
    { id: 6, title: "Routing with React Router", duration: "31:45", watched: false },
  ]);
  
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelectVideo = (id) => {
    setSelectedVideo(videos.find(v => v.id === id));
    setVideos(videos.map(v => ({
      ...v,
      selected: v.id === id
    })));
  };
  
  const markAsWatched = () => {
    if (selectedVideo) {
      setVideos(videos.map(v => 
        v.id === selectedVideo.id ? {...v, watched: true} : v
      ));
      setSelectedVideo({...selectedVideo, watched: true});
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Video Lectures</h1>
          
          <div className="relative mt-4 md:mt-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search videos..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-1 ${selectedVideo ? 'lg:order-1' : ''}`}>
            <div className="bg-gray-50 rounded-lg p-4 max-h-[500px] overflow-y-auto">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Lecture List</h2>
              
              <div className="space-y-3">
                {filteredVideos.map(video => (
                  <VideoLectureCard 
                    key={video.id} 
                    video={video} 
                    onSelect={handleSelectVideo} 
                  />
                ))}
                
                {filteredVideos.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No videos match your search
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedVideo ? (
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-gray-700 rounded-full p-4 inline-block">
                        <FaPlay className="text-white text-3xl" />
                      </div>
                      <p className="mt-4 text-white font-medium">Now Playing: {selectedVideo.title}</p>
                      <p className="text-gray-400 mt-1">{selectedVideo.duration}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-800">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white">{selectedVideo.title}</h3>
                    {!selectedVideo.watched && (
                      <button 
                        onClick={markAsWatched}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
                      >
                        <FaCheckCircle className="mr-1" /> Mark as Watched
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center text-gray-400 text-sm">
                      <FaClock className="mr-1" />
                      <span>{selectedVideo.duration}</span>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-gray-300">
                        In this lecture, we'll cover the core concepts of {selectedVideo.title.toLowerCase()}, 
                        including practical examples and best practices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaPlay className="text-gray-400 text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a video to watch</h3>
                  <p className="text-gray-500">
                    Choose a lecture from the list on the left to start watching
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLectures;