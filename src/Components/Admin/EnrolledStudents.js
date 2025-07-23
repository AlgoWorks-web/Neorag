import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, STORAGE_BASE_URL } from '../../config';

const EnrolledStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  const fetchEnrolledStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/enrollments?per_page=100`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setStudents(response.data.data.data);
      } else {
        setError('Failed to fetch enrolled students');
      }
    } catch (err) {
      console.error('Failed to load enrolled students', err);
      setError('Error loading enrolled students');
    } finally {
      setLoading(false);
    }
  };

  // Check if the agreement data is base64 encoded or a file path
  const isBase64Data = (data) => {
    if (!data) return false;

    // Check if it's a base64 string (starts with data: or is a long string without file extension)
    return data.startsWith('data:application/pdf;base64,') ||
      (data.length > 100 && !data.includes('/') && !data.includes('.'));
  };

  // Handle file path URLs (for varchar stored paths)
  const getAgreementUrl = (agreementPath) => {
    if (!agreementPath) return null;

    // If it's base64 data, return null (handle separately)
    if (isBase64Data(agreementPath)) return null;

    const cleanPath = agreementPath.replace(/^storage\//, '');
    const finalPath = cleanPath.startsWith('useragreements/') ? cleanPath : `useragreements/${cleanPath}`;
    return `${STORAGE_BASE_URL}/${finalPath}`;
  };

  // Create blob from base64 data
  const createBlobFromBase64 = (base64Data) => {
    try {
      let base64String = base64Data;

      // Remove data URL prefix if present
      if (base64String.startsWith('data:application/pdf;base64,')) {
        base64String = base64String.replace('data:application/pdf;base64,', '');
      }

      // Convert base64 to binary
      const binaryString = window.atob(base64String);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return new Blob([bytes], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error creating blob from base64:', error);
      return null;
    }
  };



  const viewAgreement = (enrollment) => {
    const agreementData = enrollment.useragreement;

    if (!agreementData) {
      alert('No agreement data available');
      return;
    }

    // If it's base64, handle with blob
    if (isBase64Data(agreementData)) {
      console.log('Viewing base64 PDF...');
      const blob = createBlobFromBase64(agreementData);
      if (!blob) {
        alert('Failed to process base64 agreement data');
        return;
      }

      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } else {
      console.log('Opening direct file path PDF...');
      const cleanPath = agreementData.replace(/^storage\//, '');
      const url = `${STORAGE_BASE_URL}/${cleanPath}`;
      window.open(url, '_blank');
    }
  };


  // Alternative download function for base64 data
  const downloadAgreementDirect = (enrollment) => {
    try {
      const agreementData = enrollment.useragreement;

      if (!agreementData) {
        alert('No agreement data available');
        return;
      }

      let blob;

      if (isBase64Data(agreementData)) {
        blob = createBlobFromBase64(agreementData);

        if (!blob) {
          alert('Failed to process PDF data');
          return;
        }
      } else {
        alert('Please use the API download button for file-based agreements');
        return;
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `agreement_${enrollment.enrollment_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Direct download failed:', error);
      alert('Failed to download agreement');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-lg">Loading enrolled students...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold">Error</h2>
          <p>{error}</p>
          <button
            onClick={fetchEnrolledStudents}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Enrolled Students</h1>
        <button
          onClick={fetchEnrolledStudents}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Students</h3>
          <p className="text-2xl font-bold text-blue-600">{students.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Enrolled</h3>
          <p className="text-2xl font-bold text-green-600">{students.filter(s => s.status === 'enrolled').length}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">In Progress</h3>
          <p className="text-2xl font-bold text-yellow-600">{students.filter(s => s.status === 'in-progress').length}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Completed</h3>
          <p className="text-2xl font-bold text-purple-600">{students.filter(s => s.status === 'completed').length}</p>
        </div>
      </div>


      {students.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No enrolled students found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg mt-10">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-r border-indigo-500">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-r border-indigo-500">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-r border-indigo-500">Course Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-r border-indigo-500">Status</th>
                
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-r border-indigo-500">Agreement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Enrolled Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((enroll) => (
                  <tr key={enroll.enrollment_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">{enroll.enrollment_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">{enroll.student?.username || enroll.student?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">{enroll.course?.title || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm border-r border-gray-200">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${enroll.status === 'enrolled' ? 'bg-green-100 text-green-800' :
                        enroll.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          enroll.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {enroll.status || 'Pending'}
                      </span>
                    </td>
                   
                    <td className="px-6 py-4 text-sm border-r border-gray-200">
                      {enroll.useragreement ? (
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => viewAgreement(enroll)}
                            className="text-blue-600 hover:text-blue-800 underline mr-10 text-xs"
                          >
                            View
                          </button>
                          <div className="text-xs font-medium ml-16 text-gray-500">
                            {isBase64Data(enroll.useragreement) ? 'Base64 Data' : 'File Path'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No Agreement</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(enroll.enrollment_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 mt-10">
            {students.map((enroll) => (
              <div
                key={enroll.enrollment_id}
                className="bg-white border border-gray-200 rounded-lg shadow p-4"
              >
                <p className="text-sm"><strong>ID:</strong> {enroll.enrollment_id}</p>
                <p className="text-sm"><strong>Name:</strong> {enroll.student?.username || enroll.student?.name || 'N/A'}</p>
                <p className="text-sm"><strong>Course:</strong> {enroll.course?.title || 'N/A'}</p>
                <p className="text-sm">
                  <strong>Status:</strong>{' '}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${enroll.status === 'enrolled' ? 'bg-green-100 text-green-800' :
                    enroll.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      enroll.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {enroll.status || 'Pending'}
                  </span>
                </p>
               
                <div className="mt-2">
                  <strong>Agreement:</strong>{' '}
                  {enroll.useragreement ? (
                    <button
                      onClick={() => viewAgreement(enroll)}
                      className="ml-1 text-blue-600 hover:text-blue-800 underline text-xs font-medium"
                    >
                      View
                    </button>
                  ) : (
                    <span className="ml-1 text-gray-400">No Agreement</span>
                  )}
                </div>
                <p className="text-sm mt-2"><strong>Date:</strong> {new Date(enroll.enrollment_date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </>
      )}



    </div>
  );
};

export default EnrolledStudents;