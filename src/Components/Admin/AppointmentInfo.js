import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppointmentInfo() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    setLoading(true);
    fetch('https://hydersoft.com/api/connectingwires/appointments/all')
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          setAppointments(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        toast.error('Failed to load appointments');
        setLoading(false);
      });
  };

  const deleteAppointment = (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    fetch(`https://hydersoft.com/api/connectingwires/appointment/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          toast.success(data.statusMsg || 'Appointment deleted successfully');
          // Remove the deleted appointment from state
          setAppointments((prev) => prev.filter(appt => appt.id !== id));
        } else {
          toast.error(data.statusMsg || 'Failed to delete appointment');
        }
      })
      .catch(err => {
        console.error('Delete error:', err);
        toast.error('Error deleting appointment');
      });
  };

  return (
    <div className="p-4">
      <ToastContainer />
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
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => deleteAppointment(appt.id)}
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
                  <th className="px-4 py-2 border text-left">Service</th>
                  <th className="px-4 py-2 border text-left">Date</th>
                  <th className="px-4 py-2 border text-left">Time</th>
                  <th className="px-4 py-2 border text-left">Name</th>
                  <th className="px-4 py-2 border text-left">Email</th>
                  <th className="px-4 py-2 border text-left">Phone</th>
                  <th className="px-4 py-2 border text-left">Message</th>
                  <th className="px-4 py-2 border text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appt, index) => (
                    <tr key={appt.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{appt.serviceType}</td>
                      <td className="px-4 py-2 border">{appt.date}</td>
                      <td className="px-4 py-2 border">{appt.timeSlot}</td>
                      <td className="px-4 py-2 border">{appt.fullName}</td>
                      <td className="px-4 py-2 border">{appt.email}</td>
                      <td className="px-4 py-2 border">{appt.phone}</td>
                      <td className="px-4 py-2 border">{appt.msg || '-'}</td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => deleteAppointment(appt.id)}
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
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                      No appointments found
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

export default AppointmentInfo;
