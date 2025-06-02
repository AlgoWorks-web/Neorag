import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { studentCourses } from '../../data/studentCourses';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
            <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
          </div>
          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
            {course.progress}% Complete
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{course.description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Start: {course.startDate}</p>
            <p className="text-xs text-gray-500">End: {course.endDate}</p>
          </div>
          <Link 
            to={`/student/course/${course.id}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View Course
          </Link>
        </div>
      </div>
      
      <div className="bg-gray-100 px-5 py-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full" 
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const StudentCourses = () => {
  const [filter, setFilter] = useState('all');
  
  const filteredCourses = filter === 'all' 
    ? studentCourses 
    : studentCourses.filter(course => 
        filter === 'in-progress' ? course.progress < 100 : course.progress === 100
      );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Courses
          </button>
          <button 
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'in-progress' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            In Progress
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'completed' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'completed' 
              ? "You haven't completed any courses yet." 
              : "You don't have any courses in this category."}
          </p>
          <button className="text-indigo-600 font-medium hover:text-indigo-800">
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;