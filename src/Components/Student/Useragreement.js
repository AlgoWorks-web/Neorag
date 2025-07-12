import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51RVbIMHKv8G6Dr0HV8vYvZ2bQux6APWVlcvCrgFIBFkrD6Ivga3ssrHYxOnApFQF3LJPg0s5JMBc0mM4YdNhdXKG00L77W7fp6');

function Useragreement() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [accepted, setAccepted] = useState(false);
    const [signature, setSignature] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreementText, setAgreementText] = useState('');

    useEffect(() => {
        fetchAgreementForCourse();
    }, []);

    const fetchAgreementForCourse = async () => {
        try {
            const res = await axios.get(`https://hydersoft.com/api/agreements/by-course/${courseId}`);
            setAgreementText(res.data.data.user_agreement || '');
        } catch (error) {
            console.error('Agreement fetch error:', error);
            alert('❌ No agreement found for this course.');
        }
    };

    const handleSubmit = async () => {
        if (!accepted || !signature.trim()) {
            alert('✅ Please accept the agreement and type your signature.');
            return;
        }

        const studentUser = JSON.parse(localStorage.getItem('studentUser'));
        const studentId = studentUser?.id || studentUser?.student_id;

        if (!studentId) {
            alert('❌ Student ID not found. Please log in again.');
            return;
        }

        setIsSubmitting(true);

        try {
            const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');

            // Create a new PDF
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const { width, height } = page.getSize();

            const fontSize = 12;
            const lineHeight = 18;
            const margin = 50;
            let y = height - margin;

            // Word wrapping function
            const wrapText = (text, maxWidth, font, size) => {
                const words = text.split(' ');
                const lines = [];
                let currentLine = '';

                words.forEach(word => {
                    const lineWidth = font.widthOfTextAtSize(currentLine + ' ' + word, size);
                    if (lineWidth > maxWidth && currentLine) {
                        lines.push(currentLine);
                        currentLine = word;
                    } else {
                        currentLine += (currentLine ? ' ' : '') + word;
                    }
                });

                if (currentLine) lines.push(currentLine);
                return lines;
            };

            // Draw agreement text
            const lines = agreementText.split('\n').flatMap(line =>
                wrapText(line, width - 2 * margin, font, fontSize)
            );

            lines.forEach((line) => {
                if (y - lineHeight < 80) return; // leave space for signature
                page.drawText(line, {
                    x: margin,
                    y: y,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                });
                y -= lineHeight;
            });

            // Add signature and date
            page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
                x: margin,
                y: 60,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
            });

            page.drawText(`Signature: ${signature}`, {
                x: margin,
                y: 40,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
            });

            const modifiedPdfBytes = await pdfDoc.save();
            const base64Only = btoa(
                new Uint8Array(modifiedPdfBytes).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            // Create or get enrollment
            let enrollmentId = null;

            const enrollmentRes = await fetch('https://hydersoft.com/api/enrollments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    student_id: studentId,
                    course_id: courseId,
                    status: 'enrolled',
                    enrollment_date: new Date().toISOString().split('T')[0],
                }),
            });

            if (enrollmentRes.status === 409) {
                const fallbackRes = await fetch(`https://hydersoft.com/api/enrollments?student_id=${studentId}&course_id=${courseId}`);
                const fallbackData = await fallbackRes.json();
                enrollmentId = fallbackData.data.data[0].enrollment_id;
            } else if (enrollmentRes.ok) {
                const enrollmentData = await enrollmentRes.json();
                enrollmentId = enrollmentData.data.enrollment_id;
            } else {
                throw new Error('Failed to create or fetch enrollment.');
            }

            // Save signed agreement
            const agreementRes = await fetch('https://hydersoft.com/api/enrollments/save-agreement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    enrollment_id: enrollmentId,
                    course_id: courseId,
                    student_id: studentId,
                    useragreement: base64Only,
                    signature: signature.trim(),
                    agreement_signed_at: new Date().toISOString(),
                }),
            });

            if (!agreementRes.ok) throw new Error('❌ Failed to save agreement');

            // Proceed to Stripe payment
            const stripeRes = await fetch('https://hydersoft.com/api/payments/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ student_id: studentId, course_id: courseId }),
            });

            const stripeData = await stripeRes.json();
            const stripe = await stripePromise;
            await stripe.redirectToCheckout({ sessionId: stripeData.session_id });

        } catch (err) {
            console.error('Error:', err);
            alert('❌ Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Course Enrollment Agreement</h1>
                    <p className="text-gray-600 mt-2">Please review the agreement below and accept the terms to proceed.</p>

                    {agreementText ? (
                        <div className="border rounded my-4 p-4 max-h-[500px] overflow-y-scroll bg-gray-50 whitespace-pre-wrap text-gray-800">
                            {agreementText}
                        </div>
                    ) : (
                        <p className="text-red-600">No agreement found for this course.</p>
                    )}

                    <div className="mt-8 border-t pt-6">
                        <div className="flex items-start mb-4">
                            <input
                                type="checkbox"
                                id="accept"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <label htmlFor="accept" className="text-sm text-gray-700">
                                I have read and agree to the terms in the above agreement.
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
                                placeholder="Enter your full name"
                                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="text-sm text-gray-500 mb-4">
                            <strong>Date:</strong> {new Date().toLocaleDateString()} <br />
                            <strong>Course ID:</strong> {courseId}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!accepted || !signature.trim() || isSubmitting}
                            className={`w-full py-3 mt-2 rounded font-semibold transition ${isSubmitting || !accepted || !signature.trim()
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {isSubmitting ? 'Processing...' : 'Accept & Proceed to Payment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Useragreement;
