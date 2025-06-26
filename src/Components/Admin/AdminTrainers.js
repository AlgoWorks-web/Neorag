import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaSearch, FaUserPlus, FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

function AdminTrainers() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    trainerName: '',
    email: '',
    profilePic: null,
    bio: '',
    expertise: '',
    location: '',
    phone_number: '',
  });

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalTrainers, setTotalTrainers] = useState(0);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        console.log(`Fetching trainers: page=${currentPage}, per_page=${perPage}`);

        const response = await fetch(`https://hydersoft.com/api/admin/trainer/trainers?page=${currentPage}&per_page=${perPage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
          // Handle HTTP errors
          const errorText = await response.text();
          console.error('HTTP Error Response:', errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Check if response has expected structure
        if (!data) {
          throw new Error('No data received from server');
        }

        if (data.success === true || data.success === 'true') {
          // Handle successful response
          const trainersData = data.data || data.trainers || [];
          const metaData = data.meta || data.metadata || {};

          setTrainers(Array.isArray(trainersData) ? trainersData : []);
          setTotalTrainers(metaData.total || trainersData.length || 0);

          console.log('Trainers loaded:', trainersData.length);
        } else if (data.error) {
          // Handle API error response
          throw new Error(data.error || data.message || 'API returned an error');
        } else {
          // Handle unexpected response format
          console.warn('Unexpected response format:', data);

          // Try to extract trainers from various possible structures
          if (Array.isArray(data)) {
            setTrainers(data);
            setTotalTrainers(data.length);
          } else if (data.trainers && Array.isArray(data.trainers)) {
            setTrainers(data.trainers);
            setTotalTrainers(data.trainers.length);
          } else if (data.data && Array.isArray(data.data)) {
            setTrainers(data.data);
            setTotalTrainers(data.data.length);
          } else {
            throw new Error('Unexpected response format - unable to extract trainers data');
          }
        }
      } catch (err) {
        console.error('Error fetching trainers:', err);

        // Provide more specific error messages
        let errorMessage = 'Failed to fetch trainers';

        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          errorMessage = 'Network error: Unable to connect to server. Please check if the server is running.';
        } else if (err.message.includes('JSON')) {
          errorMessage = 'Server response error: Invalid JSON format received.';
        } else if (err.message.includes('HTTP')) {
          errorMessage = `Server error: ${err.message}`;
        } else {
          errorMessage = err.message || errorMessage;
        }

        setError(errorMessage);
        setTrainers([]); // Reset trainers on error
        setTotalTrainers(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [currentPage, perPage]);

  const filteredTrainers = trainers.filter((trainer) => {
    if (!trainer) return false;

    const email = trainer.email || '';
    const name = trainer.name || trainer.trainer_name || trainer.trainerName || '';
    const searchLower = searchTerm.toLowerCase();

    return email.toLowerCase().includes(searchLower) ||
      name.toLowerCase().includes(searchLower);
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalTrainers / perPage)) {
      setCurrentPage(newPage);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      setFormData({ ...formData, profilePic: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('trainer_name', formData.trainerName);
    data.append('email', formData.email);
    if (formData.profilePic) {
      data.append('profile_pic', formData.profilePic);
    }
    data.append('bio', formData.bio);
    data.append('expertise', formData.expertise);
    data.append('location', formData.location);
    data.append('phone_number', formData.phone_number);

    try {
      const response = await fetch('https://hydersoft.com/api/admin/trainer/trainers', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert('Trainer onboarded successfully.');
        setFormData({
          trainerName: '',
          email: '',
          profilePic: null,
          bio: '',
          expertise: '',
          location: '',
          phone_number: '',
        });
        setShowForm(false);
        setCurrentPage(1);
        // Refresh the trainers list
        window.location.reload();
      } else {
        alert(result.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Retry function for failed requests
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Force re-fetch by updating a dependency
    setCurrentPage(prev => prev);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">TRAINERS MANAGEMENT</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search trainers..."
              className="pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            onClick={() => setShowForm(true)}
          >
            <FaUserPlus className="mr-2" /> Onboard Trainer
          </button>
        </div>
      </div>

      {/* Trainers List */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading trainers...</span>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-start">
            <div>
              <strong>Error:</strong> {error}
              <div className="mt-2 text-sm">
                <p>Possible solutions:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Check if the backend server is running on port 8000</li>
                  <li>Verify the API endpoint URL is correct</li>
                  <li>Check network connectivity</li>
                  <li>Look at browser console for more details</li>
                </ul>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trainer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expertise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrainers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      {trainers.length === 0 ? 'No trainers found' : 'No trainers match your search'}
                    </td>
                  </tr>
                ) : (
                  filteredTrainers.map((trainer, index) => (
                    <tr key={trainer.id || trainer.email || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {trainer.profile_pic || trainer.profilePic ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={trainer.profile_pic || trainer.profilePic}
                                alt={trainer.name || trainer.trainer_name || 'Trainer'}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                              style={{ display: trainer.profile_pic || trainer.profilePic ? 'none' : 'flex' }}>
                              <FaUser className="text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {trainer.name || trainer.trainer_name || trainer.trainerName || 'N/A'}
                            </div>
                            {trainer.bio && (
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {trainer.bio}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaEnvelope className="mr-2 text-gray-400" />
                          {trainer.email || 'N/A'}
                        </div>
                        {trainer.phone_number && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FaPhone className="mr-2 text-gray-400" />
                            {trainer.phone_number}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {trainer.expertise || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-gray-400" />
                          {trainer.location || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                          <FaEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalTrainers > perPage && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage * perPage >= totalTrainers}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * perPage + 1}</span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * perPage, totalTrainers)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{totalTrainers}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronUp className="h-5 w-5 transform -rotate-90" />
                    </button>
                    {Array.from({ length: Math.ceil(totalTrainers / perPage) }, (_, i) => i + 1)
                      .filter(page =>
                        page === 1 ||
                        page === Math.ceil(totalTrainers / perPage) ||
                        Math.abs(page - currentPage) <= 1
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage * perPage >= totalTrainers}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronDown className="h-5 w-5 transform -rotate-90" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">Add Trainer</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Trainer Name</label>
                <input
                  type="text"
                  name="trainerName"
                  value={formData.trainerName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Profile Pic</label>
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Bio (Optional)</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium">Expertise</label>
                <textarea
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white py-2 rounded flex justify-center items-center ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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

export default AdminTrainers;