import React from "react";

const UserDashboard = () => {
  const sampleVideos = Array(6).fill("https://www.youtube.com/embed/dQw4w9WgXcQ");

  // Using the same ad for all three promotions
  const ads = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjSD6Nk2WnH_Dm10w-2w1R1dx6fLDTkzl6AOqBHcATOpxaLLTZsv8RahdZxD3-Fn2m7P0&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjSD6Nk2WnH_Dm10w-2w1R1dx6fLDTkzl6AOqBHcATOpxaLLTZsv8RahdZxD3-Fn2m7P0&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjSD6Nk2WnH_Dm10w-2w1R1dx6fLDTkzl6AOqBHcATOpxaLLTZsv8RahdZxD3-Fn2m7P0&usqp=CAU",
  ];

  return (
    <div className="h-screen overflow-y-auto">
      {/* Top Greeting and Profile */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome back, User</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <span className="text-sm text-gray-500">User</span>
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sampleVideos.map((url, idx) => (
          <div key={idx} className="bg-white shadow rounded p-3">
            <iframe
              src={url}
              className="w-full h-40 rounded"  // Keeping the videos as they are
              title={`video-${idx}`}
              allowFullScreen
            />
          </div>
        ))}
      </div>

      {/* Promotional Ads Section in a Single Row with Distance */}
      <div className="mt-8 space-y-4"> {/* Added margin-top for more space */}
        <div className="flex gap-6 overflow-x-auto">
          {ads.map((ad, idx) => (
            <div key={idx} className="bg-white shadow rounded p-3 flex-shrink-0">
              <img
                src={ad}
                alt={`Promotion ${idx + 1}`}
                className="w-64 h-32 object-cover rounded"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
