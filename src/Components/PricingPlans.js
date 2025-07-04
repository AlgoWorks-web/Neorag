import React from 'react';
import Courses from './Student/Courses';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51RVbIMHKv8G6Dr0HV8vYvZ2bQux6APWVlcvCrgFIBFkrD6Ivga3ssrHYxOnApFQF3LJPg0s5JMBc0mM4YdNhdXKG00L77W7fp6'); // ✅ Use your publishable key

const plans = [
  {
    title: 'Interview Practice ',
    price: '$199',
    type: 'One-time payment',
    price_id: 'price_1RgK06HKv8G6Dr0HcUWEvedC',
    features: [
      '3 Realistic Mock Interviews (Role-specific)',
      '1-on-1 Personalized Feedback',
      'Customized Improvement Plan',
      'STAR Method Coaching (Behavioral Interview Framework)',
      'Resume Review',
      'Interview Etiquette & Body Language Tips',
    ],
    button: 'Start Practicing Today',
  },
  {
    title: 'Ultimate Bundle',
    price: '$899',
    type: 'One-time payment',
    price_id: 'price_1RgK83HKv8G6Dr0H8KDskYuk',
    popular: true,
    features: [
      '3000 Job Applications',
      '2+ Assistants',
      'Custom Cover Letters',
      'AI Custom Resumes',
      'Resume Review',
      'LinkedIn Makeover',
      'Personal Recruiter',
    ],
    button: 'Get Hired Faster with Premium Support',
  },
];

const PricingPlans = () => {
  const navigate = useNavigate();

  const handleCheckout = async (priceId) => {
    const student = JSON.parse(localStorage.getItem('studentUser'));
    const studentId = student?.student_id || student?.id;

    if (!studentId) {
      alert('Please login to enroll.');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/payments/creates-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${student.token}`,
        },
        body: JSON.stringify({ price_id: priceId }),
      });

      const data = await res.json();

      if (data.id) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        alert('Something went wrong during checkout');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout failed');
    }
  };

  return (
    <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-20">
      <div><Courses /></div>
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-4">
        Our Pricing Plans
      </h2>
      <p className="text-center text-gray-600 mb-12">
        Choose the plan that best supports your career growth.
      </p>
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-white p-6 rounded-xl shadow-md border ${plan.popular ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'
              }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-2 py-1 rounded-bl">
                POPULAR
              </div>
            )}
            <h3 className="text-xl font-semibold text-blue-800">{plan.title}</h3>
            <p className="text-3xl font-bold mt-4">{plan.price}</p>
            <p className="text-sm text-gray-500 mb-4">{plan.type}</p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-500 font-bold mr-2">✔</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className="w-full bg-blue-700 text-white font-semibold py-2 rounded hover:bg-blue-800 transition"
              onClick={() => handleCheckout(plan.price_id)}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
