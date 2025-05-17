import { useState } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';

const AdminCourses = () => {
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [courses] = useState([
    { id: 1, title: 'Introduction to React', students: 45, status: 'Active' },
    { id: 2, title: 'Advanced JavaScript', students: 32, status: 'Active' },
    { id: 3, title: 'Python Fundamentals', students: 28, status: 'Draft' },
  ]);

  const toggleCourseExpand = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
          <FaPlus className="mr-2" /> Add Course
        </button>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Students</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{course.id}</td>
                <td className="px-6 py-4 font-medium">{course.title}</td>
                <td className="px-6 py-4">{course.students}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    course.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (visible on mobile) */}
      <div className="md:hidden space-y-4">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleCourseExpand(course.id)}
            >
              <div>
                <h3 className="font-medium">{course.title}</h3>
                <div className="flex items-center mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    course.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">{course.students} students</span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCourseExpand(course.id);
                }}
                className="text-gray-500"
              >
                {expandedCourse === course.id ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            
            {expandedCourse === course.id && (
              <div className="p-4 border-t">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Course ID</h4>
                    <p>{course.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Enrollments</h4>
                    <p>{course.students}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-600 rounded flex items-center"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCourses;