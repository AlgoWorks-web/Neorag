import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DateTime } from 'luxon';

const services = [
  "Web Solutions",
  "Mobility Solutions",
  "Digital Solutions",
  "Branding & Creative",
  "Hosting Solutions",
  "Start-Up Consulting"
];

const AppointmentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentCSTTime, setCurrentCSTTime] = useState(DateTime.now().setZone('America/Chicago'));

  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    fullName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    notes: ''
  });

  // Live CST clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCSTTime(DateTime.now().setZone('America/Chicago'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const onlyNums = value.replace(/\D/g, '');
      if (onlyNums.length <= 10) {
        setFormData(prev => ({ ...prev, phone: onlyNums }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits.");
      setLoading(false);
      return;
    }

    try {
      const cstDateTime = DateTime.fromFormat(
        `${formData.date} ${formData.time}`,
        'yyyy-MM-dd HH:mm',
        { zone: 'America/Chicago' }
      );

      const formattedDateCST = cstDateTime.toFormat('yyyy-MM-dd');
      const formattedTimeCST = `${cstDateTime.toFormat('hh:mm a')} - ${cstDateTime.plus({ hours: 1 }).toFormat('hh:mm a')}`;

      const payload = {
        serviceType: formData.service,
        date: formattedDateCST,
        timeSlot: formattedTimeCST,
        fullName: formData.fullName,
        email: formData.email,
        countryCode: formData.countryCode,
        phone: formData.phone,
        msg: formData.notes,
      };

      const response = await fetch('http://localhost:8000/api/bookanappointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      if (response.status === 302 || text.startsWith('<!DOCTYPE html')) {
        throw new Error('Invalid API endpoint or received an HTML response.');
      }

      const data = JSON.parse(text);
      if (response.ok && data.statusCode === 200) {
        toast.success(data.statusMsg || 'Appointment booked successfully!');
        setFormData({
          service: '',
          date: '',
          time: '',
          fullName: '',
          email: '',
          countryCode: '+91',
          phone: '',
          notes: ''
        });
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error(data.statusMsg || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('API Error:', error.message);
      toast.error('Could not connect to the server.\n' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <ToastContainer />
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-customBlue mb-2">Book Your Slot Now</h1>
          <p className="text-lg text-gray-600 mb-2">Fill out the form below to schedule your appointment</p>
          <p className="text-sm text-gray-500">
            ⏰ Current CST Time: <span className="font-semibold">{currentCSTTime.toFormat('yyyy-MM-dd hh:mm:ss a')}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className={`bg-white shadow-sm rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-200 ${loading ? 'cursor-wait' : ''}`}>
          <div className="mb-6">
            <select name="service" value={formData.service} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent">
              <option value="" disabled>Select a service...</option>
              {services.map((service, index) => (
                <option key={index} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-2">
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
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-6 italic">Note: All times are in CST (Central Standard Time)</p>

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
            <div className="flex gap-2">
              <input
                type="text"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                placeholder="+91"
                required
                className="w-24 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
                maxLength={10}
                pattern="\d{10}"
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
              disabled={loading}
              className={`flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {loading ? 'Submitting...' : 'Submit Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
