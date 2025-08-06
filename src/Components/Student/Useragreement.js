import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { getStudentUser, isStudentAuthenticated } from '../../auth/authUtils'; // Adjust path as needed

const stripePromise = loadStripe('pk_test_51RVbIMHKv8G6Dr0HV8vYvZ2bQux6APWVlcvCrgFIBFkrD6Ivga3ssrHYxOnApFQF3LJPg0s5JMBc0mM4YdNhdXKG00L77W7fp6');

function Useragreement() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [accepted, setAccepted] = useState(false);
    const [signature, setSignature] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreementText, setAgreementText] = useState('');
    const [loading, setLoading] = useState(true);
    const [agreementAlreadySigned, setAgreementAlreadySigned] = useState(false);

    useEffect(() => {
        if (!isStudentAuthenticated()) {
            navigate('/login');
            return;
        }
        checkAgreementStatusAndFetch();
    }, [courseId, navigate]);

   const checkAgreementStatusAndFetch = async () => {
    try {
        const studentData = getStudentUser();
        
        // Check agreement status
        const statusResponse = await fetch('https://hydersoft.com/api/enrollments/check-agreement-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('studentToken')}`
            },
            body: JSON.stringify({
                student_id: studentData.id,
                course_id: parseInt(courseId)
            })
        });

        const statusData = await statusResponse.json();
        
        if (statusData.success) {
            const { agreement_signed, payment_completed, next_step } = statusData.data;
            
            if (payment_completed) {
                // Already fully enrolled - don't allow re-signing
                alert('You are already enrolled in this course');
                navigate('/student/my-courses');
                return;
            }
            
            // ✅ ALLOW re-signing even if agreement exists
            // This lets users update their signature
        }

        // Always fetch agreement text - allow signing/re-signing
        await fetchAgreementForCourse();
        
    } catch (error) {
        console.error('Error checking agreement status:', error);
        await fetchAgreementForCourse();
    } finally {
        setLoading(false);
    }
};


    const fetchAgreementForCourse = async () => {
        try {
            const res = await axios.get(`https://hydersoft.com/api/agreements/by-course/${courseId}`);
            setAgreementText(res.data.data.user_agreement || '');
        } catch (error) {
            console.error('Agreement fetch error:', error);
            alert('❌ No agreement found for this course.');
            navigate('/student/courses'); // Redirect back to courses
        }
    };

    const proceedToPayment = async () => {
        try {
            const studentData = getStudentUser();
            
            const stripeRes = await fetch('https://hydersoft.com/api/payments/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('studentToken')}`
                },
                body: JSON.stringify({ 
                    student_id: studentData.id, 
                    course_id: parseInt(courseId) 
                }),
            });

            if (!stripeRes.ok) {
                throw new Error('Failed to create payment session');
            }

            const stripeData = await stripeRes.json();
            const stripe = await stripePromise;
            
            // Store course info for payment completion
            localStorage.setItem('pendingEnrollment', JSON.stringify({
                courseId: courseId,
                studentId: studentData.id
            }));
            
            await stripe.redirectToCheckout({ sessionId: stripeData.session_id });

        } catch (error) {
            console.error('Payment error:', error);
            alert('❌ Failed to proceed to payment. Please try again.');
        }
    };

    const handleSubmit = async () => {
        if (!accepted || !signature.trim()) {
            alert('✅ Please accept the agreement and type your signature.');
            return;
        }

        const studentData = getStudentUser();
        if (!studentData) {
            alert('❌ Student not found. Please log in again.');
            navigate('/student/login');
            return;
        }

        setIsSubmitting(true);

        try {
            const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');

            // Create PDF (your existing PDF creation code)
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
            const lines = agreementText
                .replace(/\t/g, '    ')
                .split('\n')
                .flatMap(line => wrapText(line, width - 2 * margin, font, fontSize));

            lines.forEach((line) => {
                if (y - lineHeight < 80) return;
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

            // ✅ Updated: Use the new save agreement endpoint
            const agreementRes = await fetch('https://hydersoft.com/api/enrollments/save-agreement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('studentToken')}`,
                },
                body: JSON.stringify({
                    student_id: studentData.id,
                    course_id: parseInt(courseId),
                    useragreement: base64Only,
                    signature: signature.trim(),
                    agreement_signed_at: new Date().toISOString(),
                }),
            });

            if (!agreementRes.ok) {
                const errorData = await agreementRes.json();
                throw new Error(errorData.message || '❌ Failed to save agreement');
            }

            const agreementData = await agreementRes.json();
            
            if (agreementData.success) {
                if (agreementData.data.next_step === 'payment') {
                    // Proceed to payment
                    await proceedToPayment();
                }
            } else {
                throw new Error(agreementData.message || 'Failed to save agreement');
            }

        } catch (err) {
            console.error('Error:', err);
            alert(`❌ ${err.message || 'Something went wrong. Please try again.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading agreement...</p>
                </div>
            </div>
        );
    }

    if (agreementAlreadySigned) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-blue-500 text-6xl mb-4">📄</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Agreement Already Signed</h2>
                    <p className="text-gray-600 mb-4">Redirecting to payment...</p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Course Enrollment Agreement</h1>
                    <p className="text-gray-600 mt-2">Please review the agreement below and accept the terms to proceed with enrollment.</p>

                    {agreementText ? (
                        <div className="border rounded my-4 p-4 max-h-[500px] overflow-y-scroll bg-gray-50 whitespace-pre-wrap text-gray-800">
                            {agreementText}
                        </div>
                    ) : (
                        <div className="my-4 p-4 bg-red-50 border border-red-200 rounded">
                            <p className="text-red-600">No agreement found for this course.</p>
                        </div>
                    )}

                    <div className="mt-8 border-t pt-6">
                        <div className="flex items-start mb-4">
                            <input
                                type="checkbox"
                                id="accept"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                disabled={isSubmitting}
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
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="text-sm text-gray-500 mb-4">
                            <strong>Date:</strong> {new Date().toLocaleDateString()} <br />
                            <strong>Course ID:</strong> {courseId}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!accepted || !signature.trim() || isSubmitting || !agreementText}
                            className={`w-full py-3 mt-2 rounded font-semibold transition ${
                                isSubmitting || !accepted || !signature.trim() || !agreementText
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
