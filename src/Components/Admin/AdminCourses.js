const AdminCourses = () => {
  // Sample course data
  const courses = [
    { id: 1, title: 'Introduction to React', students: 45, status: 'Active' },
    { id: 2, title: 'Advanced JavaScript', students: 32, status: 'Active' },
    // More courses...
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Course Management</h2>
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg">All Courses</h3>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add New Course
          </button>
        </div>
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Students</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id} className="border-b">
                <td className="p-2">{course.id}</td>
                <td className="p-2">{course.title}</td>
                <td className="p-2">{course.students}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    course.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                </td>
                <td className="p-2">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                  <button className="text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCourses;