import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import axios from 'axios';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://hydersoft.com/api/student/verified?page=${currentPage}&per_page=${perPage}`);

        if (response.data.success) {
          setStudents(response.data.data);
          setTotalStudents(response.data.meta.total);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [currentPage, perPage]);

  const filteredStudents = students.filter(student =>
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
        <h2 className="text-2xl font-bold">STUDENTS MANAGEMENT</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search students..."
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Joined On</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(student.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden space-y-4 p-4">
          {filteredStudents.length === 0 ? (
            <div className="text-center text-gray-500">
              {totalStudents === 0 ? 'No students found' : 'No students match your filter'}
            </div>
          ) : (
            filteredStudents.map(student => (
              <div key={student.id} className="bg-white border border-gray-200 rounded-lg shadow p-4">
                <p className="text-sm"><strong>ID:</strong> {student.id}</p>
                <p className="text-sm mt-1"><strong>Email:</strong> {student.email}</p>
                <p className="text-sm mt-1">
                  <strong>Joined On:</strong>{' '}
                  {new Date(student.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm mt-1">
                  <strong>Status:</strong>{' '}
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </p>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalStudents > perPage && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            {/* mobile prev/next */}
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage * perPage >= totalStudents}
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            {/* desktop pagination */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * perPage + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * perPage, totalStudents)}</span> of{' '}
                <span className="font-medium">{totalStudents}</span> students
              </p>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <FaChevronUp className="h-5 w-5 transform -rotate-90" />
                </button>
                {[...Array(Math.ceil(totalStudents / perPage)).keys()].map(i => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 border text-sm font-medium ${currentPage === i + 1
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage * perPage >= totalStudents}
                  className="px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <FaChevronDown className="h-5 w-5 transform -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminStudents;