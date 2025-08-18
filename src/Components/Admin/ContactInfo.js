import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContactInfo() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = () => {
    setLoading(true);
    fetch('https://hydersoft.com/api/connectingwires/contact/all')
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          setContacts(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        toast.error('Failed to load contacts');
        setLoading(false);
      });
  };

  const deleteContact = (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    fetch(`https://hydersoft.com/api/connectingwires/contact/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          toast.success(data.statusMsg || 'Contact deleted successfully');
          // Remove the deleted contact from state
          setContacts((prev) => prev.filter(contact => contact.id !== id));
        } else {
          toast.error(data.statusMsg || 'Failed to delete contact');
        }
      })
      .catch(err => {
        console.error('Delete error:', err);
        toast.error('Error deleting contact');
      });
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">Contact Submissions</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Card View for Mobile */}
          <div className="space-y-4 lg:hidden">
            {contacts.map(contact => (
              <div key={contact.id} className="border rounded-lg p-4 shadow bg-white">
                <p><strong>Name:</strong> {contact.name}</p>
                <p><strong>Email:</strong> {contact.email}</p>
                <p><strong>Subject:</strong> {contact.subject}</p>
                <p><strong>Message:</strong> {contact.message}</p>
                <p><strong>Submitted At:</strong> {new Date(contact.created_at).toLocaleString()}</p>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="flex items-center gap-1 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Table View for Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left">#</th>
                  <th className="px-4 py-2 border text-left">Name</th>
                  <th className="px-4 py-2 border text-left">Email</th>
                  <th className="px-4 py-2 border text-left">Subject</th>
                  <th className="px-4 py-2 border text-left">Message</th>
                  <th className="px-4 py-2 border text-left">Submitted At</th>
                  <th className="px-4 py-2 border text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length > 0 ? (
                  contacts.map((contact, index) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{contact.name}</td>
                      <td className="px-4 py-2 border">{contact.email}</td>
                      <td className="px-4 py-2 border">{contact.subject}</td>
                      <td className="px-4 py-2 border max-w-xs truncate">{contact.message}</td>
                      <td className="px-4 py-2 border">{new Date(contact.created_at).toLocaleString()}</td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => deleteContact(contact.id)}
                          className="flex items-center gap-1 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-200 text-sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      No contacts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default ContactInfo;
