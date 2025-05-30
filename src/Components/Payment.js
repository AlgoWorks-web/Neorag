import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;

  const [selectedUPI, setSelectedUPI] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Payment successful for ${plan.name} plan!`);
    navigate('/');
  };

  const upiOptions = [
    {
      name: 'Google Pay',
      logo: 'https://telecomtalk.info/wp-content/uploads/2022/12/gpay-how-to-create-or-find-upi.jpg.webp',
    },
    {
      name: 'PhonePe',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv7C7cl9ufztQRxoH-y_biXvwoAf5bynbtnA&s',
    },
    {
      name: 'BHIM',
      logo: 'https://www.presentations.gov.in/wp-content/uploads/2020/06/BHIM_Preview.png',
    },
    {
      name: 'Paytm',
      logo: 'https://play-lh.googleusercontent.com/IWU8HM1uQuW8wVrp6XpyOOJXvb_1tDPUDAOfkrl83RZPG9Ww3dCY9X1AV6T1atSvgXc',
    },
    {
      name: 'Amazon Pay UPI',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0NrHT4rEeertzPwN7CT7V6DSYqxNq0cWv8g&s',
    },
    {
      name: 'Scan QR Code',
      logo: 'https://cdn-icons-png.flaticon.com/512/833/833472.png', // QR icon
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_right,#8F87F1,#C68EFD,#E9A5F1,#FED2E2)]">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>

        {plan && (
          <div className="text-center mb-6">
            <p className="text-gray-600">Plan: <strong>{plan.name}</strong></p>
            <p className="text-gray-600">Amount: <strong>${plan.price}</strong></p>
          </div>
        )}

        {/* Card Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Cardholder Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="text"
            placeholder="Card Number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              className="w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="text"
              placeholder="CVC"
              className="w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-600 transition"
          >
            Pay ${plan?.price}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t text-center text-sm text-gray-500 relative">
          <span className="absolute left-1/2 transform -translate-x-1/2 -top-3 bg-white px-3">or pay using UPI</span>
        </div>

        {/* UPI Options */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {upiOptions.map((option) => (
            <label
              key={option.name}
              className={`border p-3 rounded-lg flex items-center gap-3 cursor-pointer transition hover:shadow ${
                selectedUPI === option.name ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="upi"
                value={option.name}
                checked={selectedUPI === option.name}
                onChange={() => setSelectedUPI(option.name)}
                className="accent-purple-600"
              />
              <img src={option.logo} alt={option.name} className="h-6 w-6 object-contain" />
              <span className="text-sm text-gray-700">{option.name}</span>
            </label>
          ))}
        </div>

        {/* Terms */}
        {/* <p className="text-xs text-center text-gray-400 mt-6">
          By clicking "Make Payment" you agree to the <span className="underline cursor-pointer">terms and conditions</span>.
        </p> */}
      </div>
    </div>
  );
}

export default Payment;
