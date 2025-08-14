import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentUser, isStudentAuthenticated } from '../../auth/authUtils'; // Adjust path as needed

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null); // null, 'enrolled', 'not-enrolled'
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);

  // Get student headers for authenticated requests
  const getStudentHeaders = () => {
    const studentUser = getStudentUser();
    if (!studentUser || !studentUser.id) {
      return null;
    }
    
    return {
      'X-Student-ID': studentUser.id.toString(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  };

  // Check if student is already enrolled in this course
  const checkEnrollmentStatus = async () => {
    if (!isStudentAuthenticated() || !courseId) {
      setEnrollmentStatus('not-enrolled');
      return;
    }

    setCheckingEnrollment(true);
    try {
      const headers = getStudentHeaders();
      if (!headers) {
        setEnrollmentStatus('not-enrolled');
        return;
      }

      console.log('Checking enrollment status for course:', courseId);
      
      const response = await fetch('https://hydersoft.com/api/enrolledstudent/my-courses', {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.data) {
          // Check if current course is in enrolled courses
          const isEnrolled = data.data.some(enrollment => {
            const courseInfo = enrollment.course?.course_id || enrollment.course_id;
            return courseInfo && courseInfo.toString() === courseId.toString();
          });

          console.log('Enrollment check result:', isEnrolled);
          setEnrollmentStatus(isEnrolled ? 'enrolled' : 'not-enrolled');

          // ✅ REDIRECT: If already enrolled, redirect to my courses
          if (isEnrolled) {
            console.log('Student already enrolled, redirecting to my courses...');
            setTimeout(() => {
              navigate('/student/mycourses', { 
                replace: true,
                state: { 
                  message: `You are already enrolled in "${course?.title || 'this course'}". Access it from your courses.`,
                  courseId: courseId
                }
              });
            }, 1500); // Show message briefly before redirecting
          }
        } else {
          setEnrollmentStatus('not-enrolled');
        }
      } else {
        console.log('Failed to check enrollment:', response.status);
        setEnrollmentStatus('not-enrolled');
      }
    } catch (err) {
      console.error('Error checking enrollment:', err);
      setEnrollmentStatus('not-enrolled');
    } finally {
      setCheckingEnrollment(false);
    }
  };

  // Fetch course details
  const fetchCourse = async () => {
    try {
      const response = await fetch(`https://hydersoft.com/api/courses/getcourse`);
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }
      const data = await response.json();
      const selected = data.find(c => c.course_id.toString() === courseId);
      setCourse(selected);
      
      // After course is loaded, check enrollment status
      if (selected) {
        await checkEnrollmentStatus();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  // Handle enrollment button click
  const handleEnrollClick = () => {
    if (!isStudentAuthenticated()) {
      // Redirect to login if not authenticated
      navigate('/login', { 
        state: { 
          returnTo: `/course/${courseId}`,
          message: 'Please log in to enroll in this course.' 
        }
      });
      return;
    }

    if (enrollmentStatus === 'enrolled') {
      // Redirect to my courses if already enrolled
      navigate('/student/mycourses');
      return;
    }

    // Proceed to enrollment
    navigate(`/student/useragreement/${course.course_id}`);
  };

  if (loading) return (
    <div className="p-8 text-center text-gray-500">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
      Loading course details...
    </div>
  );

  if (error) return (
    <div className="p-8 text-red-600 text-center">
      <p>Error: {error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
  );

  if (!course) return (
    <div className="p-8 text-center">
      <p>Course not found.</p>
      <button 
        onClick={() => navigate('/courses')} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Browse Courses
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 py-10 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 text-lg">{course.description}</p>

          {/* ✅ ENROLLMENT STATUS MESSAGE */}
          {enrollmentStatus === 'enrolled' && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">
                ✅ You are already enrolled in this course! Redirecting to your courses...
              </span>
            </div>
          )}

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

        {/* ✅ UPDATED: Sticky Enroll Box with enrollment status */}
        <div className="lg:col-span-1 md:mt-28">
          <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24 border border-purple-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

            <div className="mb-4">
              <span className="block text-sm text-gray-500">Price</span>
              <p className="text-3xl font-extrabold text-purple-700">${course.price}</p>
            </div>

            {/* ✅ DYNAMIC BUTTON based on enrollment status */}
            {checkingEnrollment ? (
              <button 
                disabled 
                className="w-full bg-gray-400 text-white text-lg font-medium py-3 rounded cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Checking...
                </div>
              </button>
            ) : enrollmentStatus === 'enrolled' ? (
              <button
                onClick={() => navigate('/student/mycourses')}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-medium py-3 rounded transition duration-300"
              >
                ✅ Already Enrolled - Go to My Courses
              </button>
            ) : (
              <button
                onClick={handleEnrollClick}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium py-3 rounded transition duration-300"
              >
                {isStudentAuthenticated() ? 'Enroll Now' : 'Login to Enroll'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
