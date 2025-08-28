
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function PublicCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            // Updated URL to fetch courses with trainer data
            const response = await fetch('https://hydersoft.com/api/courses/getcourse');
            if (!response.ok) throw new Error('Failed to fetch courses');
            const data = await response.json();
            
            console.log('Fetched courses data:', data); // Debug log
            
            // Handle different response structures
            let coursesData = [];
            if (data.success && data.data) {
                coursesData = data.data;
            } else if (Array.isArray(data)) {
                coursesData = data;
            } else {
                coursesData = data;
            }
            
            setCourses(coursesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.trainer && course.trainer.trainer_name && 
         course.trainer.trainer_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleExplore = (courseId) => {
        navigate(`/public-course-details/${courseId}`);
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
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 rounded-lg shadow mb-10">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-8">Level Up Your Skills</h1>
                    <p className="text-lg md:text-xl mb-6">
                        Learn from expert trainers and unlock new career opportunities with our curated courses.
                    </p>
                </div>
            </section>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Our Courses</h1>
                    <p className="text-gray-600">Get started by browsing our available training options</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search courses or trainers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-1/2 border border-gray-300 rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {filteredCourses.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No matching courses found</h3>
                        <p className="text-gray-500">Try a different search term or browse all courses.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredCourses.map((course) => (
                            <div key={course.course_id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
                                {/* Course Image */}
                                <div className="aspect-video bg-gray-200">
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
                                    {/* Course Title */}
                                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
                                        {course.title}
                                    </h3>

                                    {/* Course Description */}
                                    {/* <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                                        {course.description}
                                    </p> */}

                                    {/* Trainer Information */}
                                    {course.trainer ? (
                                        <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-white text-sm font-semibold">
                                                        {course.trainer.trainer_name ? course.trainer.trainer_name.charAt(0).toUpperCase() : 'T'}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-blue-900">
                                                        {course.trainer.trainer_name || 'Unknown Trainer'}
                                                    </p>
                                                </div>
                                            </div>
                                            {course.trainer.bio && (
                                                <p className="text-xs text-blue-700 line-clamp-2 ml-11">
                                                    {course.trainer.bio}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-white text-sm font-semibold">?</span>
                                                </div>
                                                <p className="text-sm text-gray-600">No trainer assigned</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Course Bio */}
                                    {/* {course.bio && (
                                        <p className="text-xs text-gray-500 mb-3 line-clamp-2 bg-gray-50 p-2 rounded">
                                            <span className="font-medium">Course Info:</span> {course.bio}
                                        </p>
                                    )} */}

                                    {/* Course Level & Duration */}
                                    {/* <div className="flex items-center gap-2 mb-3">
                                        {course.level && (
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                                                course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                            </span>
                                        )}
                                        {course.duration && (
                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                                                {course.duration}
                                            </span>
                                        )}
                                    </div> */}

                                    {/* Status and Date */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            {course.is_active ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    ✓ Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    ✗ Inactive
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {course.created_on ? new Date(course.created_on).toLocaleDateString() : ''}
                                        </span>
                                    </div>

                                    {/* Price - Bottom above explore button */}
                                    <div className="mt-auto mb-3">
                                        <div className="text-center py-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                                            <span className="text-2xl font-bold text-blue-600">
                                                {formatPrice(course.price)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Explore Button */}
                                    <button
                                        onClick={() => handleExplore(course.course_id)}
                                        className="mt-auto w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                                    >
                                        Explore Course
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

export default PublicCourses;
