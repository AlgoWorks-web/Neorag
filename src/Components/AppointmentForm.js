import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const services = [
  "Web Solutions",
  "Mobility Solutions",
  "Digital Solutions",
  "Branding & Creative",
  "Hosting Solutions",
  "Start-Up Consulting"
];

const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM"
];

const AppointmentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    fullName: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    serviceType: formData.service,
    date: formData.date,
    timeSlot: formData.time,
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    msg: formData.notes,
  };

  try {
    const response = await fetch('https://hydersoft.com/api/bookanappointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (response.status === 302 || text.startsWith('<!DOCTYPE html')) {
      throw new Error('Invalid API endpoint or received an HTML response. Check if the path is correct.');
    }

    const data = JSON.parse(text);

    if (response.ok && data.statusCode === 200) {
      alert(`✅ ${data.statusMsg || 'Appointment booked successfully!'}`);
      navigate('/');
    } else {
      alert(`❌ ${data.statusMsg || 'Something went wrong. Please try again.'}`);
    }
  } catch (error) {
    console.error('API Error:', error.message);
    alert('⚠️ Could not connect to the server.\n' + error.message);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-customBlue mb-4">Book Your Slot Now</h1>
          <p className="text-lg text-gray-600">Fill out the form below to schedule your appointment</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-200">
          <div className="mb-6">
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
            >
              <option value="" disabled>Select a service...</option>
              {services.map((service, index) => (
                <option key={index} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
              />
            </div>
            <div>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
              >
                <option value="" disabled>Select time slot...</option>
                {timeSlots.map((time, index) => (
                  <option key={index} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-8">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes (optional)"
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Submit Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
