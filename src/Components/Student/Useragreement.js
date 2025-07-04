import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Useragreement() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [accepted, setAccepted] = useState(false);
    const [signature, setSignature] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const agreementRef = useRef(null);

    const handleSubmit = async () => {
        if (!accepted || !signature.trim() || !courseId) {
            alert("✅ Please accept the agreement and sign.");
            return;
        }

        const studentUser = JSON.parse(localStorage.getItem("studentUser"));
        const studentId = studentUser?.id || studentUser?.student_id;

        if (!studentId) {
            alert("❌ Student ID not found. Please log in again.");
            return;
        }

        setIsSubmitting(true);

        try {
            const html2canvas = (await import('html2canvas')).default;
            const jsPDF = (await import('jspdf')).default;

            const canvas = await html2canvas(agreementRef.current, {
                scrollY: -window.scrollY,
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            const pdfDataUrl = pdf.output('dataurlstring');
            const base64Only = pdfDataUrl.split(',')[1];

            let enrollmentId;

            // Try creating enrollment
            const enrollmentRes = await fetch('https://hydersoft.com/api/enrollments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    student_id: studentId,
                    course_id: courseId,
                    status: 'enrolled',
                    enrollment_date: new Date().toISOString().split('T')[0]
                })
            });

            if (enrollmentRes.status === 409) {
                // If already enrolled, get latest enrollment
                const fallbackRes = await fetch(`https://hydersoft.com/api/enrollments?student_id=${studentId}&course_id=${courseId}`);
                const fallbackData = await fallbackRes.json();
                if (!fallbackData.success || !fallbackData.data?.data?.length) throw new Error("No existing enrollment found");
                enrollmentId = fallbackData.data.data[0].enrollment_id;
            } else if (enrollmentRes.ok) {
                const enrollmentData = await enrollmentRes.json();
                enrollmentId = enrollmentData.data.enrollment_id;
            } else {
                throw new Error("Failed to create enrollment");
            }

            // ✅ Save agreement
            const agreementRes = await fetch('https://hydersoft.com/api/enrollments/save-agreement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    enrollment_id: enrollmentId,
                    course_id: courseId,
                    student_id: studentId,
                    useragreement: base64Only,
                    signature: signature.trim(),
                    agreement_signed_at: new Date().toISOString()
                })
            });

            if (!agreementRes.ok) throw new Error('Failed to save agreement.');

            const result = await agreementRes.json();

            if (result.success) {
                alert('✅ Agreement saved and uploaded successfully.');

                // 🔁 Create Stripe Checkout Session
                const stripeRes = await fetch('https://hydersoft.com/api/payments/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        student_id: studentId,
                        course_id: courseId
                    })
                });

                const stripeData = await stripeRes.json();

                if (!stripeRes.ok || !stripeData.checkout_url) {
                    throw new Error(stripeData.error || 'Failed to create Stripe session.');
                }

                window.location.href = stripeData.checkout_url;
            }

        } catch (err) {
            console.error('Error:', err);
            alert('❌ Failed to complete agreement. Try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="mb-6">
                        <button
                            onClick={() => navigate(`/student/course-details/${courseId}`)}
                            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                        >
                            <span className="mr-2">←</span>
                            Back to Course Details
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Course Enrollment Agreement</h1>
                        <p className="text-gray-600 mt-2">Please read and accept the terms before proceeding to payment.</p>
                    </div>

                    <div
                        className="border border-gray-300 rounded-lg bg-white text-gray-900 overflow-y-auto max-h-[70vh] p-6"
                        ref={agreementRef}
                    >
                        <h2 className="text-2xl font-bold mb-4">Course Enrollment Terms & Conditions</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                        </p>

                        {/* ⛳ Replace this with your actual agreement terms */}
                        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-2">
                            <li>All course fees are non-refundable.</li>
                            <li>Course materials are for individual use only.</li>
                            <li>Enrollment is subject to verification of provided information.</li>
                        </ul>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-start mb-4">
                                <input
                                    type="checkbox"
                                    id="accept"
                                    checked={accepted}
                                    onChange={(e) => setAccepted(e.target.checked)}
                                    className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="accept" className="text-sm text-gray-700">
                                    I have read, understood, and agree to be bound by the terms and conditions outlined above.
                                    I acknowledge that my enrollment is subject to successful payment processing.
                                </label>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-2">
                                    Digital Signature (Type your full name):
                                </label>
                                <input
                                    type="text"
                                    id="signature"
                                    value={signature}
                                    onChange={(e) => setSignature(e.target.value)}
                                    placeholder="Enter your full legal name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="text-xs text-gray-500 mb-4">
                                <strong>Date:</strong> {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                                <br />
                                <strong>Course ID:</strong> {courseId}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !accepted || !signature.trim()}
                            className={`font-semibold px-8 py-3 rounded-md transition-colors ${isSubmitting || !accepted || !signature.trim()
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            {isSubmitting ? 'Processing Agreement...' : 'Accept Agreement & Proceed to Payment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Useragreement;
