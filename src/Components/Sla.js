import React from 'react';

function Sla() {
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-4">SERVICE LEVEL AGREEMENT (SLA)</h1>
      <p><strong>Last updated:</strong> March 16, 2025</p>

      <p className="mt-4">
        This Service Level Agreement (“SLA”) outlines the terms and service standards that Neorag Solutions LLC (“Company,” “we,” “us,” or “our”) commits to providing you (“User,” “you,” or “your”) through our online job application services available at <a href="https://www.neorag.com" className="text-blue-600 underline">www.neorag.com</a> (“Website”). By purchasing a Payment Plan and utilizing our services (“Services”), you confirm your acceptance of this SLA.
      </p>

      <h2 className="text-xl font-semibold mt-6">1. SERVICE DESCRIPTION</h2>
      <ul className="list-disc list-inside ml-4">
        <li><strong>Job Requirement Notifications:</strong> Tailored job opportunities and requirements based on your preferences and chosen plan.</li>
        <li><strong>Job Application Assistance:</strong> Submission of applications on your behalf, with your prior explicit approval, as per the selected plan.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">2. SERVICE LEVELS</h2>
      <h3 className="font-semibold mt-2">2.1 Job Requirement Notifications</h3>
      <ul className="list-disc list-inside ml-4">
        <li>Notifications will be provided via email or your account dashboard on the Website.</li>
        <li>Frequency and quantity are determined by your selected plan.</li>
        <li>Job preferences such as type, location, and industry can be customized for more relevant opportunities.</li>
      </ul>

      <h3 className="font-semibold mt-2">2.2 Job Application Assistance</h3>
      <ul className="list-disc list-inside ml-4">
        <li>Applications are submitted only with your explicit approval per job.</li>
        <li>You must review and approve all job details, resumes, and cover letters before submission.</li>
        <li>Notifications will confirm when your applications have been submitted.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">3. SERVICE AVAILABILITY</h2>
      <h3 className="font-semibold mt-2">3.1 Uptime Guarantee</h3>
      <p>We aim to maintain 95% uptime for our Website and Services, barring events like technical issues or force majeure.</p>

      <h3 className="font-semibold mt-2">3.2 Scheduled Maintenance</h3>
      <p>Advance notifications (minimum 24 hours) will be sent via email or posted on the Website.</p>

      <h3 className="font-semibold mt-2">3.3 Support Hours</h3>
      <ul className="list-disc list-inside ml-4">
        <li>Monday to Friday: 9:00 AM – 5:00 PM (Central Time)</li>
        <li>Email Support: <a href="mailto:corporate@neorag.com" className="text-blue-600 underline">corporate@neorag.com</a></li>
        <li>Phone Support: +91 7382624522</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">4. USER RESPONSIBILITIES</h2>
      <ul className="list-disc list-inside ml-4">
        <li>Provide and maintain accurate and updated profile information.</li>
        <li>Approve submitted applications (when applicable).</li>
        <li>Notify us of updates to preferences or contact details.</li>
        <li>Ensure the accuracy of submitted materials like resumes or cover letters.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">5. LIMITATIONS</h2>
      <h3 className="font-semibold mt-2">5.1 Job Outcomes</h3>
      <p>We cannot guarantee job offers or interviews from applications. Employer decisions and the accuracy of job listings are beyond our control.</p>

      <h3 className="font-semibold mt-2">5.2 User Permissions</h3>
      <p>Applications will only be submitted with your explicit consent.</p>

      <h3 className="font-semibold mt-2">5.3 Third-Party Platforms</h3>
      <p>We are not liable for third-party platforms used during the application process.</p>

      <h2 className="text-xl font-semibold mt-6">6. SERVICE CREDITS</h2>
      <p>
        If the uptime guarantee or specified service levels are not met, contact us at <a href="mailto:corporate@neorag.com" className="text-blue-600 underline">corporate@neorag.com</a> within 30 days to request service credits.
      </p>

      <h2 className="text-xl font-semibold mt-6">7. TERMINATION</h2>
      <p>Your access may be suspended or terminated if this SLA or our User Agreement is violated.</p>

      <h2 className="text-xl font-semibold mt-6">8. GOVERNING LAW</h2>
      <p>This SLA is governed by the laws of Texas, USA.</p>

      <h2 className="text-xl font-semibold mt-6">9. DISPUTE RESOLUTION</h2>
      <p>Disputes are resolved through binding arbitration in Euless, Texas, under the American Arbitration Association.</p>

      <h2 className="text-xl font-semibold mt-6">10. CHANGES TO THIS SLA</h2>
      <p>Updates to this SLA are effective immediately upon posting on the Website. Continued use of our Services indicates acceptance of updates.</p>

      <h2 className="text-xl font-semibold mt-6">11. CONTACT INFORMATION</h2>
      <p>
        For queries, please reach out to:<br />
        Neorag Solutions LLC<br />
        Email: <a href="mailto:corporate@neorag.com" className="text-blue-600 underline">corporate@neorag.com</a><br />
        Phone: +91 7382624522<br />
        Website: <a href="https://www.neorag.com/contact" className="text-blue-600 underline">www.neorag.com/contact</a>
      </p>
    </div>
  );
}

export default Sla;
