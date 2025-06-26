import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaSearch, FaPlus } from 'react-icons/fa';

function AdminCourses() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [trainerId, setTrainerId] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalCourses, setTotalCourses] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bio: '',
    price: '',
    thumbnail: null,
  });

  // Fetch trainer list and courses on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trainers
        const trainersResponse = await fetch('https://hydersoft.com/api/admin/trainer/trainers', {
          headers: {
            Accept: 'application/json',
          },
        });
        const trainersData = await trainersResponse.json();
        setTrainers(trainersData);

        // Fetch courses
        const coursesResponse = await fetch('https://hydersoft.com/api/courses/getcourse');
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
        setTotalCourses(coursesData.length);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.trainer.trainer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!trainerId) {
      alert('Please select a trainer.');
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('bio', formData.bio);
    data.append('price', formData.price);
    data.append('trainer_id', trainerId);
    data.append('is_active', '1');
    if (formData.thumbnail) {
      data.append('thumbnail', formData.thumbnail);
    }

    try {
      const response = await fetch('https://hydersoft.com/api/courses/uploadcourse', {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json',
        },
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          console.error('Server error response:', error);
          alert(error.message || 'Upload failed');
        } else {
          const errorText = await response.text();
          console.error('Non-JSON response:', errorText);
          alert('Server returned an unexpected response.');
        }
        return;
      }

      const result = await response.json();
      console.log('Success response:', result);

      // Refresh the courses list
      const coursesResponse = await fetch('https://hydersoft.com/api/courses/getcourse');
      const coursesData = await coursesResponse.json();
      setCourses(coursesData);
      setTotalCourses(coursesData.length);

      alert('✅ Course uploaded successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        bio: '',
        price: '',
        thumbnail: null,
      });
      setTrainerId('');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">COURSE MANAGEMENT</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
            onClick={() => setShowForm(true)}
          >
            <FaPlus className="mr-2" /> Upload Course
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCourses.map((course) => (
                <tr key={course.course_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.course_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{course.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.trainer?.trainer_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${course.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(course.created_on).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {course.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * perPage >= totalCourses}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * perPage + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * perPage, totalCourses)}</span> of{' '}
                <span className="font-medium">{totalCourses}</span> courses
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <FaChevronUp className="h-5 w-5 transform -rotate-90" aria-hidden="true" />
                </button>
                {[...Array(Math.ceil(totalCourses / perPage)).keys()].map((page) => (
                  <button
                    key={page + 1}
                    onClick={() => handlePageChange(page + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page + 1
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    {page + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage * perPage >= totalCourses}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <FaChevronDown className="h-5 w-5 transform -rotate-90" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add Course Modal (keep your existing modal code) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">Add New Course</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Bio (Optional)</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Trainer</label>
                <select
                  value={trainerId}
                  onChange={(e) => setTrainerId(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 mt-1 bg-white text-black appearance-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- Select Trainer --</option>
                  {trainers.map((trainer) => (
                    <option
                      key={trainer.trainer_id}
                      value={trainer.trainer_id}
                      className="text-black bg-white"
                    >
                      {trainer.trainer_name}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute right-3 top-[58px] text-gray-500">
                  ▼
                </div>
              </div>



              <div>
                <label className="block text-sm font-medium">Thumbnail (Image)</label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !trainerId}
                className={`w-full text-white py-2 rounded flex justify-center items-center ${isSubmitting || !trainerId
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCourses;