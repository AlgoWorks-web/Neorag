import React from 'react';

const StudentProfile = () => {
  const profilePic = ''; // Replace with dynamic image path if available
  const name = 'John Doe';
  const email = 'john.doe@example.com';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm text-center">
        <img
          src={profilePic}
          alt=""
          className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-500"
          onError={(e) => (e.target.src = '/default-avatar.png')}
        />
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">{name}</h2>
        <p className="text-gray-500">{email}</p>
      </div>
    </div>
  );
};

export default StudentProfile;
