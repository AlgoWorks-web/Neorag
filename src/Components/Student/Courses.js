import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = courses.filter(course =>
        course.title.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://hydersoft.com/api/courses/getcourse');

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const createPlaceholderImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 300, 200);
    ctx.fillStyle = '#6b7280';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('No Image Available', 150, 100);
    return canvas.toDataURL();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchCourses}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Courses</h1>
          <p className="text-gray-600">Discover and learn new skills with our comprehensive courses</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by course title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/2 border border-gray-300 rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No matching courses</h3>
            <p className="text-gray-600">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.course_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img
                    src={`https://hydersoft.com/${course.thumbnail}`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image failed to load:', `https://hydersoft.com/${course.thumbnail}`);
                      e.target.onerror = null;

                      // Try alternative paths if the main path fails
                      const altPaths = [
                        `https://hydersoft.com/storage/coursethumbnails/${course.thumbnail.split('/').pop()}`,
                        `https://hydersoft.com/storage/app/public/coursethumbnails/${course.thumbnail.split('/').pop()}`
                      ];

                      const currentFailedUrl = e.target.src;

                      // Try each alternative path
                      for (let altPath of altPaths) {
                        if (currentFailedUrl !== altPath) {
                          console.log('Trying alternative path:', altPath);
                          e.target.src = altPath;
                          return;
                        }
                      }

                      // If all paths fail, use placeholder
                      console.log('All image paths failed, using placeholder');
                      e.target.src = createPlaceholderImage();
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', `https://hydersoft.com/${course.thumbnail}`);
                    }}
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {course.description}
                  </p>

                  {course.bio && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {course.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(course.price)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Created: {new Date(course.created_on).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center">
                      {course.is_active ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/student/course-details/${course.course_id}`)}
                    className="w-full mt-auto bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
