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
            const response = await fetch('https://hydersoft.com/api/courses/getcourse');
            if (!response.ok) throw new Error('Failed to fetch courses');
            const data = await response.json();
            setCourses(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
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

    return (

        <div className="min-h-screen bg-gray-50 py-8">
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

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-1/2 border border-gray-300 rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {loading ? (
                    <p>Loading courses...</p>
                ) : error ? (
                    <p className="text-red-600">Error: {error}</p>
                ) : filteredCourses.length === 0 ? (
                    <p className="text-gray-500">No matching courses found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredCourses.map((course) => (
                            <div key={course.course_id} className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden">
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
                                <div className="p-4">
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

                                    <div className="flex items-center justify-between">
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
                                        onClick={() => handleExplore(course.course_id)}
                                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
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

export default PublicCourses;
