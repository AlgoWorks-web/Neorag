import React from 'react';

function Getintouch() {
  return (
    <div className="flex flex-col items-center px-4 py-12 bg-white">
      <h1 className="text-3xl font-bold mb-2">GET IN TOUCH</h1>
      <p className="text-gray-600 mb-8 text-center">We help our clients renew their business</p>

      <form className="w-full max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            placeholder="Name"
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            placeholder="Phone"
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <input
            type="text"
            placeholder="Company"
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Enter your comment</label>
          <textarea
            placeholder="Message"
            rows="4"
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-600 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Getintouch;
