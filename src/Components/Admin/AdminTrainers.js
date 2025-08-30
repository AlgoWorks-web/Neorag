import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaSearch, FaUserPlus, FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function AdminTrainers() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editTrainerId, setEditTrainerId] = useState(null);
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
        setError(null);

        console.log(`Fetching trainers: page=${currentPage}, per_page=${perPage}`);

        const response = await fetch(`https://hydersoft.com/api/secure/trainer/trainers?page=${currentPage}&per_page=${perPage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('HTTP Error Response:', errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (!data) {
          throw new Error('No data received from server');
        }

        if (data.success === true || data.success === 'true') {
          const trainersData = data.data || data.trainers || [];
          const metaData = data.meta || data.metadata || {};

          setTrainers(Array.isArray(trainersData) ? trainersData : []);
          setTotalTrainers(metaData.total || trainersData.length || 0);

          console.log('Trainers loaded:', trainersData.length);
        } else if (data.error) {
          throw new Error(data.error || data.message || 'API returned an error');
        } else {
          console.warn('Unexpected response format:', data);

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
        setTrainers([]);
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

  // Handle phone number change from PhoneInput component
const handlePhoneChange = (value) => {
  console.log(value); 
  setFormData({ ...formData, phone_number: value });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('trainer_name', formData.trainerName);
    data.append('bio', formData.bio);
    data.append('expertise', formData.expertise);
    data.append('location', formData.location);
    data.append('phone_number', formData.phone_number); 

    if (!editTrainerId && formData.email) {
      data.append('email', formData.email);
    }

    if (formData.profilePic) {
      data.append('profile_pic', formData.profilePic);
    }

    try {
      const url = editTrainerId
        ? `https://hydersoft.com/api/secure/trainer/trainers/${editTrainerId}`
        : 'https://hydersoft.com/api/secure/trainer/trainers';

      console.log('Submitting to URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      const contentType = response.headers.get('content-type') || '';

      if (response.status === 200) {
        if (contentType.includes('application/json')) {
          const result = JSON.parse(responseText);
          console.log('Parsed JSON result:', result);
          alert(editTrainerId ? 'Trainer updated successfully.' : 'Trainer onboarded successfully.');
        } else if (contentType.includes('text/html')) {
          console.log('Server returned HTML success page');
          alert(editTrainerId ? 'Trainer updated successfully.' : 'Trainer onboarded successfully.');
        } else {
          console.log('Unknown content type but successful status');
          alert(editTrainerId ? 'Trainer updated successfully.' : 'Trainer onboarded successfully.');
        }

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
        setEditTrainerId(null);
        setCurrentPage(1);
        window.location.reload();

      } else {
        if (contentType.includes('application/json')) {
          const result = JSON.parse(responseText);
          alert(result.message || result.error || 'Something went wrong.');
        } else {
          alert(`Server error: ${response.status} ${response.statusText}`);
        }
      }

    } catch (error) {
      console.error('Error submitting form:', error);

      let errorMessage = 'Error submitting the form.';

      if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
        errorMessage = 'Server returned an unexpected response format, but the operation may have succeeded. Please refresh the page to check.';
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to server.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;

    try {
      const response = await fetch(`https://hydersoft.com/api/secure/trainer/trainers/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (response.ok) {
        alert('Trainer deleted successfully.');
        window.location.reload();
      } else {
        alert(result.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting trainer.');
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setCurrentPage(prev => prev);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-center md:text-left">TRAINERS MANAGEMENT</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search trainers..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
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
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Expertise</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrainers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-3 sm:px-6 py-2 sm:py-4 text-center text-gray-500">
                      {trainers.length === 0 ? 'No trainers found' : 'No trainers match your search'}
                    </td>
                  </tr>
                ) : (
                  filteredTrainers.map((trainer, index) => (
                    <tr key={trainer.id || trainer.email || index} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
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
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaEnvelope className="mr-2 text-gray-400" />
                          {trainer.email || 'N/A'}
                        </div>
                        {trainer.phone_number && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FaPhone className="mr-2 text-gray-400" />
                            +{trainer.phone_number}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {trainer.expertise || 'N/A'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-gray-400" />
                          {trainer.location || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          onClick={() => {
                            setFormData({
                              trainerName: trainer.trainer_name || '',
                              email: trainer.email || '',
                              profilePic: null,
                              bio: trainer.bio || '',
                              expertise: trainer.expertise || '',
                              location: trainer.location || '',
                              phone_number: trainer.phone_number || '',
                            });
                            setEditTrainerId(trainer.trainer_id);
                            setShowForm(true);
                          }}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(trainer.trainer_id)}
                        >
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 px-4 py-2">
        {filteredTrainers.length === 0 ? (
          <div className="text-center text-gray-500">
            {trainers.length === 0 ? 'No trainers found' : 'No trainers match your search'}
          </div>
        ) : (
          filteredTrainers.map((trainer, index) => (
            <div
              key={trainer.id || trainer.email || index}
              className="bg-white rounded-lg shadow border border-gray-200 p-4 space-y-3"
            >
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 relative">
                  {trainer.profile_pic || trainer.profilePic ? (
                    <img
                      src={trainer.profile_pic || trainer.profilePic}
                      alt={trainer.name || trainer.trainer_name || 'Trainer'}
                      className="h-12 w-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center absolute top-0 left-0"
                    style={{ display: trainer.profile_pic || trainer.profilePic ? 'none' : 'flex' }}
                  >
                    <FaUser className="text-gray-500" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {trainer.name || trainer.trainer_name || trainer.trainerName || 'N/A'}
                  </p>
                  {trainer.bio && (
                    <p className="text-xs text-gray-500 truncate">{trainer.bio}</p>
                  )}
                </div>
              </div>

              <div className="text-sm">
                <p className="flex items-center text-gray-700">
                  <FaEnvelope className="mr-2 text-gray-400" />
                  {trainer.email || 'N/A'}
                </p>
                {trainer.phone_number && (
                  <p className="flex items-center text-gray-700 mt-1">
                    <FaPhone className="mr-2 text-gray-400" />
                    {trainer.phone_number}
                  </p>
                )}
              </div>

              <div className="text-sm text-gray-700">
                <strong>Expertise:</strong> {trainer.expertise || 'N/A'}
              </div>

              <div className="text-sm text-gray-700 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-gray-400" />
                {trainer.location || 'N/A'}
              </div>

              <div className="flex justify-end space-x-4 text-sm">
                <button
                  className="text-indigo-600 hover:text-indigo-900"
                  onClick={() => {
                    setFormData({
                      trainerName: trainer.trainer_name || '',
                      email: trainer.email || '',
                      profilePic: null,
                      bio: trainer.bio || '',
                      expertise: trainer.expertise || '',
                      location: trainer.location || '',
                      phone_number: trainer.phone_number || '',
                    });
                    setEditTrainerId(trainer.trainer_id);
                    setShowForm(true);
                  }}
                >
                  <FaEdit />
                </button>

                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => handleDelete(trainer.trainer_id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal form with React Phone Input */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditTrainerId(null);
                setFormData({
                  trainerName: '',
                  email: '',
                  profilePic: null,
                  bio: '',
                  expertise: '',
                  location: '',
                  phone_number: '',
                });
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {editTrainerId ? 'Edit Trainer' : 'Add Trainer'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Trainer Name</label>
                <input
                  type="text"
                  name="trainerName"
                  value={formData.trainerName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  disabled={!!editTrainerId}
                />
                {editTrainerId && (
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed when editing</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium">Profile Pic</label>
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">Bio (Optional)</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief bio about the trainer..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium">Expertise</label>
                <textarea
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Areas of expertise, skills, technologies..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City, Country"
                />
              </div>
              
              {/* NEW: Phone Number with react-phone-input-2 */}
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <PhoneInput
                  country={'us'} // Default country
                  value={formData.phone_number}
                  onChange={handlePhoneChange}
                  inputStyle={{
                    width: '100%',
                    height: '40px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    paddingLeft: '48px',
                  }}
                  containerStyle={{
                    width: '100%',
                  }}
                  dropdownStyle={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
                  buttonStyle={{
                    borderRadius: '8px 0 0 8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#f9fafb',
                  }}
                  countryCodeEditable={true}
                  enableSearch={true}
                  searchPlaceholder="Search countries..."
                  placeholder="Enter phone number"
                  specialLabel=""
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select your country and enter your phone number
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white py-2 rounded flex justify-center items-center transition-colors ${
                  isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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
                    {editTrainerId ? 'Updating...' : 'Submitting...'}
                  </div>
                ) : (
                  editTrainerId ? 'Update Trainer' : 'Add Trainer'
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
