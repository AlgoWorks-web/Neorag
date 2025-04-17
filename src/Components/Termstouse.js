import React from 'react';

function Termstouse() {
  return (
    <div className="w-full px-4 py-8 md:px-12 lg:px-24 text-gray-800">
      {/* Removed max-w-7xl and mx-auto to allow full width */}
      <div>
        <h1 className="text-3xl font-bold mb-4">USER AGREEMENT</h1>
        <p><strong>Last updated:</strong> March 16, 2025</p>

        <p className="mt-4">
          This User Agreement (“Agreement”) is a legally binding agreement between Neorag Solutions LLC, a limited liability company registered in Euless, Texas, USA (“Company,” “we,” “us,” or “our”), and you (“User,” “you,” or “your”). This Agreement governs your use of our online job application services (“Services”) provided through our website <a href="https://www.neorag.com" className="text-blue-600 underline">www.neorag.com</a> (“Website”).
        </p>

        <p className="mt-4">
          By accessing, browsing, or using our Services, you acknowledge that you have read, understood, and agree to be bound by the terms and conditions of this Agreement. If you do not agree to these terms, you must not use our Services.
        </p>

        <h2 className="text-xl font-semibold mt-8">1. SERVICES PROVIDED</h2>
        <p className="mt-2">Neorag Solutions LLC provides an online platform that allows job seekers to apply for job opportunities through our Website. Users may purchase a one-time payment plan (“Payment Plan”) to access these Services. The Services include, but are not limited to:</p>
        <ul className="list-disc list-inside ml-6 mt-2">
          <li>Job application submission tools.</li>
          <li>Access to job listings.</li>
          <li>Resume optimization and submission assistance.</li>
        </ul>
        <p className="mt-2">The Company reserves the right to modify, suspend, or discontinue any part of the Services at any time without prior notice.</p>

        <h2 className="text-xl font-semibold mt-8">2. ELIGIBILITY</h2>
        <p className="mt-2">To use our Services, you must:</p>
        <ul className="list-disc list-inside ml-6 mt-2">
          <li>Be at least 18 years old.</li>
          <li>Have the legal capacity to enter into a binding agreement.</li>
          <li>Provide accurate and complete information during registration and payment.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">3. PAYMENT TERMS</h2>
        <h3 className="font-semibold mt-4">3.1 Payment Plan</h3>
        <ul className="list-disc list-inside ml-6 mt-2">
          <li>Users must purchase a one-time Payment Plan to access the Services.</li>
          <li>The Payment Plan is non-refundable under any circumstances, except as required by applicable law.</li>
          <li>All payments are processed through a secure third-party payment gateway.</li>
        </ul>

        <h3 className="font-semibold mt-4">3.2 No Return Policy</h3>
        <ul className="list-disc list-inside ml-6 mt-2">
          <li>Due to the nature of the Services, all payments are final. No refunds, returns, or exchanges will be provided once the Payment Plan is purchased.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">4. USER RESPONSIBILITIES</h2>
        <p className="mt-2">By using our Services, you agree to:</p>
        <ul className="list-disc list-inside ml-6 mt-2">
          <li>Provide accurate, current, and complete information.</li>
          <li>Use the Services only for lawful purposes.</li>
          <li>Not engage in any activity that disrupts or interferes with the Services.</li>
          <li>Not share your account credentials with any third party.</li>
        </ul>

        <h3 className="font-semibold mt-4">4.1 Prohibited Activities</h3>
        <ul className="list-disc list-inside ml-6 mt-2">
          <li>Use the Services for any illegal or unauthorized purpose.</li>
          <li>Harass, intimidate, or harm other users or Company personnel.</li>
          <li>Upload or transmit viruses, malware, or any other malicious code.</li>
          <li>Reverse engineer, decompile, or attempt to extract the source code of the Website or Services.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">5. INTELLECTUAL PROPERTY</h2>
        <p className="mt-2">
          All content, trademarks, logos, and software provided through the Services are the property of Neorag Solutions LLC or its licensors. You are granted a limited, non-exclusive, non-transferable license to use the Services for personal, non-commercial purposes only.
        </p>

        <h2 className="text-xl font-semibold mt-8">6. DATA PRIVACY AND SECURITY</h2>
        <h3 className="font-semibold mt-4">6.1 Data Privacy</h3>
        <p className="mt-2">
          Neorag Solutions LLC is committed to protecting your privacy. By using our Services, you agree to the collection, use, and disclosure of your personal information as described in our <a href="#" className="text-blue-600 underline">Privacy Policy</a>. We implement reasonable security measures to protect your data; however, we cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-semibold mt-8">7. THIRD-PARTY LINKS AND SERVICES</h2>
        <p className="mt-2">
          The Services may contain links to third-party websites or services that are not owned or controlled by Neorag Solutions LLC. We are not responsible for the content, privacy policies, or practices of any third-party websites. Your use of third-party websites is at your own risk.
        </p>

        <h2 className="text-xl font-semibold mt-8">8–20. Additional Terms</h2>
        <p className="mt-2">
          For brevity, we’ve summarized sections 8–20. These include important terms on disclaimers, limitations of liability, termination, governing law (Texas), arbitration, and your agreement to indemnify us. Please refer to the full agreement on our website for complete details.
        </p>

        <h2 className="text-xl font-semibold mt-8">Contact Information</h2>
        <p className="mt-2">
          Neorag Solutions LLC<br />
          Address: Euless, Texas, USA<br />
          Email: <a href="mailto:support@neorag.com" className="text-blue-600 underline">support@neorag.com</a><br />
          Phone: +1 (945) 998-4657
        </p>
      </div>
    </div>
  );
}

export default Termstouse;
