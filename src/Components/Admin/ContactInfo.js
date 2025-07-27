import React, { useEffect, useState } from 'react';

function ContactInfo() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://hydersoft.com/api/contact/all')
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          setContacts(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
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
              </div>
            ))}
          </div>

          {/* Table View for Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Subject</th>
                  <th className="px-4 py-2 border">Message</th>
                  <th className="px-4 py-2 border">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, index) => (
                  <tr key={contact.id}>
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{contact.name}</td>
                    <td className="px-4 py-2 border">{contact.email}</td>
                    <td className="px-4 py-2 border">{contact.subject}</td>
                    <td className="px-4 py-2 border">{contact.message}</td>
                    <td className="px-4 py-2 border">{new Date(contact.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default ContactInfo;
