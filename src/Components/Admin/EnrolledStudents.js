import React, { useEffect, useState } from 'react';

const EnrolledStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://hydersoft.com/api/enrollments?per_page=100', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStudents(data.data.data); // Laravel pagination format
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load enrolled students', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Enrolled Students</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Student Name</th>
                <th className="px-4 py-2 border">Course Title</th>
                <th className="px-4 py-2 border">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((enroll, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-2 border">{enroll.enrollment_id}</td>
                  <td className="px-4 py-2 border">{enroll.student?.username || 'N/A'}</td>
                  <td className="px-4 py-2 border">{enroll.course?.title || 'N/A'}</td>
                  <td className="px-4 py-2 border">
                    {enroll.status ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EnrolledStudents;
