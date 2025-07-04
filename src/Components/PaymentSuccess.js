import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const [enrollment, setEnrollment] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const response = await fetch(`https://hydersoft.com/api/payments/session-details?session_id=${sessionId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch enrollment details');
        }

        const data = await response.json();
        setEnrollment(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (sessionId) {
      fetchEnrollment();
    }
  }, [sessionId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-600 text-lg">
        ❌ {error}
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ⏳ Verifying your payment...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center px-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-700 mb-4">🎉 Payment Successful!</h1>
        <p className="mb-2 text-gray-800">
          You are now enrolled in <strong>{enrollment.course_title}</strong>
        </p>
        <p className="mb-2 text-sm text-gray-500">Enrollment Date: {new Date(enrollment.enrollment_date).toLocaleDateString()}</p>
        <p className="text-sm text-gray-500">Status: {enrollment.status}</p>
        <a
          href="/student"
          className="inline-block mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

export default PaymentSuccess;
