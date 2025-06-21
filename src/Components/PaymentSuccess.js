import React, { useEffect, useState } from 'react';

function PaymentSuccess() {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sessionId = new URLSearchParams(window.location.search).get('session_id');

  useEffect(() => {
    if (sessionId) {
      handlePaymentSuccess();
    } else {
      setError('No session ID found in URL');
      setLoading(false);
    }
  }, [sessionId]);

  const handlePaymentSuccess = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/payments/success?session_id=${sessionId}`);
      const data = await response.json();

      if (response.ok) {
        setPaymentData(data);
      } else {
        setError(data.error || 'Payment verification failed.');
      }
    } catch (err) {
      setError('Failed to verify payment.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourses = () => {
    window.location.href = '/courses';
  };

  const handleViewEnrollments = () => {
    window.location.href = '/my-enrollments';
  };

  const formatAmount = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleViewCourses}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>

        {paymentData && (
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Enrollment Details:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Course:</span> {paymentData.course_title}
              </div>
              <div>
                <span className="font-medium">Amount Paid:</span> {formatAmount(paymentData.amount_paid)}
              </div>
              <div>
                <span className="font-medium">Enrollment ID:</span> {paymentData.enrollment_id}
              </div>
            </div>
          </div>
        )}

        <p className="text-gray-600 mb-6">
          Congratulations! You’ve successfully enrolled in the course. Enjoy learning!
        </p>

        <div className="space-y-3">
          <button
            onClick={handleViewEnrollments}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            View My Enrollments
          </button>
          <button
            onClick={handleViewCourses}
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Browse More Courses
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
