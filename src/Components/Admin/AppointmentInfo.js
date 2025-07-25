import React, { useEffect, useState } from 'react';

function AppointmentInfo() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://hydersoft.com/api/appointments/all')
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          setAppointments(data.data);
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
      <h2 className="text-xl font-bold mb-4">Appointments</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Card View for Mobile */}
          <div className="space-y-4 lg:hidden">
            {appointments.map(appt => (
              <div key={appt.id} className="border rounded-lg p-4 shadow bg-white">
                <p><strong>Service:</strong> {appt.serviceType}</p>
                <p><strong>Date:</strong> {appt.date}</p>
                <p><strong>Time:</strong> {appt.timeSlot}</p>
                <p><strong>Name:</strong> {appt.fullName}</p>
                <p><strong>Email:</strong> {appt.email}</p>
                <p><strong>Phone:</strong> {appt.phone}</p>
                <p><strong>Message:</strong> {appt.msg || '-'}</p>
              </div>
            ))}
          </div>

          {/* Table View for Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Service</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Time</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">Message</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, index) => (
                  <tr key={appt.id}>
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{appt.serviceType}</td>
                    <td className="px-4 py-2 border">{appt.date}</td>
                    <td className="px-4 py-2 border">{appt.timeSlot}</td>
                    <td className="px-4 py-2 border">{appt.fullName}</td>
                    <td className="px-4 py-2 border">{appt.email}</td>
                    <td className="px-4 py-2 border">{appt.phone}</td>
                    <td className="px-4 py-2 border">{appt.msg || '-'}</td>
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

export default AppointmentInfo;
