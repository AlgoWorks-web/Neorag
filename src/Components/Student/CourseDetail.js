import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`https://hydersoft.com/api/courses/getcourse`);
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        const data = await response.json();
        const selected = data.find(c => c.course_id.toString() === courseId);
        setCourse(selected);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const createPlaceholderImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#6b7280';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('No Image Available', canvas.width / 2, canvas.height / 2);
    return canvas.toDataURL();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading course details...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!course) return <div className="p-8">Course not found.</div>;

  return (
    <div className="bg-gray-50 py-10 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 text-lg">{course.description}</p>

          <div className="aspect-video bg-gray-200 rounded overflow-hidden">
            <img
              src={`https://hydersoft.com/${course.thumbnail}`}
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Image failed to load:', `https://hydersoft.com/${course.thumbnail}`);
                e.target.onerror = null;

                const altPaths = [
                  `https://hydersoft.com/storage/coursethumbnails/${course.thumbnail.split('/').pop()}`,
                  `https://hydersoft.com/storage/app/public/coursethumbnails/${course.thumbnail.split('/').pop()}`
                ];

                const currentFailedUrl = e.target.src;

                for (let altPath of altPaths) {
                  if (currentFailedUrl !== altPath) {
                    console.log('Trying alternative path:', altPath);
                    e.target.src = altPath;
                    return;
                  }
                }

                console.log('All image paths failed, using placeholder');
                e.target.src = createPlaceholderImage();
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', `https://hydersoft.com/${course.thumbnail}`);
              }}
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Overview</h2>
            <p className="text-gray-700 whitespace-pre-line">{course.course_overview || 'No overview available.'}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">What You Will Learn</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {(course.what_you_learn || '')
                .split('\n')
                .filter(item => item.trim() !== '')
                .map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Requirements</h2>
            <p className="text-gray-700 whitespace-pre-line">{course.requirements || 'None'}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Trainer</h2>
            <p className="text-gray-700 font-medium">{course.trainer?.trainer_name || 'N/A'}</p>
            <p className="text-sm text-gray-500">{course.bio}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Course Info</h2>
            <p className="text-gray-700">Duration: {course.duration || 'N/A'}</p>
            <p className="text-gray-700">Level: {course.level || 'All levels'}</p>
          </div>
        </div>

        {/* Sticky Enroll Box */}
        <div className="lg:col-span-1 md:mt-28">
          <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24 border border-purple-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

            <div className="mb-4">
              <span className="block text-sm text-gray-500">Price</span>
              <p className="text-3xl font-extrabold text-purple-700">${course.price}</p>
            </div>

            <button
              onClick={() => navigate(`/student/useragreement/${course.course_id}`)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium py-3 rounded transition duration-300"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
