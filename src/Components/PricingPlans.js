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
      const res = await fetch('https://hydersoft.com/api/payments/creates-checkout-session', {
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
      
    </div>
  );
};

export default PricingPlans;
