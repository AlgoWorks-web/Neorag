import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';

function Useragreement() {
    const [accepted, setAccepted] = useState(false);
    const [signature, setSignature] = useState('');
    const agreementRef = useRef(null);

    const handleSubmit = async () => {
        if (!accepted) {
            alert('Please accept the conditions before submitting.');
            return;
        }

        if (!signature.trim()) {
            alert('Please enter your signature.');
            return;
        }

        try {
            const canvas = await html2canvas(agreementRef.current, {
                scrollY: -window.scrollY,
                scale: 2,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            const pdfBlob = pdf.output('blob');

            // ✅ Convert blob to File so Laravel detects it
            const file = new File([pdfBlob], 'agreement.pdf', { type: 'application/pdf' });

            const formData = new FormData();
            formData.append('agreement', file);

            const response = await axios.post('http://127.0.0.1:8000/api/agreements', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Agreement submitted and saved successfully!');
            console.log('Server response:', response.data);
        } catch (error) {
            console.error('Upload failed:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            alert('Upload failed: ' + error.message);
        }
    };

    return (
<div className="w-full p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
    <div className="p-4 border border-gray-300 rounded-md bg-white text-gray-900" ref={agreementRef}>
        <h1 className="text-2xl font-bold mb-4">SERVICE LEVEL AGREEMENT (SLA)</h1>
        <p><strong>Last updated:</strong> March 16, 2025</p>

        <div className="mt-4 space-y-6 text-sm text-gray-800">
            <p>
                This Service Level Agreement (“SLA”) outlines the terms and service standards that Neorag Solutions LLC (“Company,” “we,” “us,” or “our”) commits to providing you (“User,” “you,” or “your”) through our online job application services available at www.neorag.com (“Website”). By purchasing a Payment Plan and utilizing our services (“Services”), you confirm your acceptance of this SLA.
            </p>

            <p><strong>1. SERVICE DESCRIPTION</strong><br />
            <strong>Job Requirement Notifications:</strong> Tailored job opportunities and requirements based on your preferences and chosen plan.<br />
            <strong>Job Application Assistance:</strong> Submission of applications on your behalf, with your prior explicit approval, as per the selected plan.</p>

            <p><strong>2. SERVICE LEVELS</strong></p>
            <p><strong>2.1 Job Requirement Notifications</strong><br />
            Notifications will be provided via email or your account dashboard on the Website.<br />
            Frequency and quantity are determined by your selected plan.<br />
            Job preferences such as type, location, and industry can be customized for more relevant opportunities.</p>

            <p><strong>2.2 Job Application Assistance</strong><br />
            Applications are submitted only with your explicit approval per job.<br />
            You must review and approve all job details, resumes, and cover letters before submission.<br />
            Notifications will confirm when your applications have been submitted.</p>

            <p><strong>3. SERVICE AVAILABILITY</strong></p>
            <p><strong>3.1 Uptime Guarantee</strong><br />
            We aim to maintain 95% uptime for our Website and Services, barring events like technical issues or force majeure.</p>

            <p><strong>3.2 Scheduled Maintenance</strong><br />
            Advance notifications (minimum 24 hours) will be sent via email or posted on the Website.</p>

            <p><strong>3.3 Support Hours</strong><br />
            Monday to Friday: 9:00 AM – 5:00 PM (Central Time)<br />
            Email Support: corporate@neorag.com<br />
            Phone Support: +91 7382624522</p>

            <p><strong>4. USER RESPONSIBILITIES</strong><br />
            Provide and maintain accurate and updated profile information.<br />
            Approve submitted applications (when applicable).<br />
            Notify us of updates to preferences or contact details.<br />
            Ensure the accuracy of submitted materials like resumes or cover letters.</p>

            <p><strong>5. LIMITATIONS</strong></p>
            <p><strong>5.1 Job Outcomes</strong><br />
            We cannot guarantee job offers or interviews from applications. Employer decisions and the accuracy of job listings are beyond our control.</p>

            <p><strong>5.2 User Permissions</strong><br />
            Applications will only be submitted with your explicit consent.</p>

            <p><strong>5.3 Third-Party Platforms</strong><br />
            We are not liable for third-party platforms used during the application process.</p>

            <p><strong>6. SERVICE CREDITS</strong><br />
            If the uptime guarantee or specified service levels are not met, contact us at corporate@neorag.com within 30 days to request service credits.</p>

            <p><strong>7. TERMINATION</strong><br />
            Your access may be suspended or terminated if this SLA or our User Agreement is violated.</p>

            <p><strong>8. GOVERNING LAW</strong><br />
            This SLA is governed by the laws of Texas, USA.</p>

            <p><strong>9. DISPUTE RESOLUTION</strong><br />
            Disputes are resolved through binding arbitration in Euless, Texas, under the American Arbitration Association.</p>

            <p><strong>10. CHANGES TO THIS SLA</strong><br />
            Updates to this SLA are effective immediately upon posting on the Website. Continued use of our Services indicates acceptance of updates.</p>

            <p><strong>11. CONTACT INFORMATION</strong><br />
            For queries, please reach out to:<br />
            Neorag Solutions LLC<br />
            Email: corporate@neorag.com<br />
            Phone: +91 7382624522<br />
            Website: www.neorag.com/contact</p>
        </div>

        <div className="mt-6 pt-4 border-t">
            <div className="flex items-center mb-4">
                <input
                    type="checkbox"
                    id="accept"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="accept" className="text-sm">
                    I accept the terms and conditions outlined above.
                </label>
            </div>

            <div className="mb-4">
                <label htmlFor="signature" className="block text-sm font-medium mb-1">Signature:</label>
                <input
                    type="text"
                    id="signature"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Type your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>
        </div>
    </div>

    <div className="mt-6 flex justify-center">
        <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
        >
            Submit
        </button>
    </div>
</div>

    );
}

export default Useragreement;
