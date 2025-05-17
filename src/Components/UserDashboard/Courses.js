import React from "react";

const Courses = () => {
  const courseVideos = Array(6).fill("https://www.youtube.com/embed/dQw4w9WgXcQ");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <p className="text-gray-600 mb-6">Explore our available courses and register now.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseVideos.map((url, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <iframe
                src={url}
                title={`course-video-${idx}`}
                className="w-full h-48 rounded"
                frameBorder="0"
                allowFullScreen
              />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition">
              Register Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
