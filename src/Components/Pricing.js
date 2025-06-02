// src/Components/Pricing.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [annualBilling, setAnnualBilling] = useState(true);
  
  const plans = [
    {
      name: "Starter",
      price: annualBilling ? "$29" : "$39",
      period: annualBilling ? "/year" : "/month",
      description: "Perfect for beginners exploring new skills",
      features: [
        "Access to 5 basic courses",
        "Community support",
        "Weekly Q&A sessions",
        "Certificate of completion"
      ],
      cta: "Get Started",
      popular: false,
      color: "from-blue-500 to-indigo-500"
    },
    {
      name: "Professional",
      price: annualBilling ? "$99" : "$129",
      period: annualBilling ? "/year" : "/month",
      description: "Best for serious career builders",
      features: [
        "All courses unlocked",
        "1:1 mentorship sessions",
        "Project reviews",
        "Career coaching",
        "Job placement assistance",
        "Professional certification"
      ],
      cta: "Most Popular",
      popular: true,
      color: "from-purple-500 to-indigo-700"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For teams and organizations",
      features: [
        "Unlimited seats",
        "Custom learning paths",
        "Dedicated success manager",
        "Team progress analytics",
        "Integration support",
        "Custom workshops"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "from-indigo-600 to-blue-800"
    }
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-5">Simple, Transparent Pricing</h1>
          <p className="text-md text-blue-200 max-w-3xl mx-auto">
            Choose the plan that works best for you. All plans include a 14-day free trial.
          </p>
        </div>
      </div>

      {/* Toggle */}
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="bg-white rounded-full p-1 shadow-lg flex">
          <button
            className={`px-6 py-3 rounded-full font-medium ${
              !annualBilling 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                : "text-gray-700"
            }`}
            onClick={() => setAnnualBilling(false)}
          >
            Monthly Billing
          </button>
          <button
            className={`px-6 py-3 rounded-full font-medium ${
              annualBilling 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                : "text-gray-700"
            }`}
            onClick={() => setAnnualBilling(true)}
          >
            Annual Billing
            <span className="ml-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
              Save 25%
            </span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 ${
                plan.popular ? "scale-105" : "hover:scale-103"
              }`}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-center py-2 font-bold text-gray-900">
                  MOST POPULAR
                </div>
              )}
              <div className="p-8 bg-white">
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                  {plan.name}
                </h3>
                <div className="my-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.name === "Enterprise" ? "/contact" : "/signup"}
                  className={`block text-center py-3 rounded-lg font-bold ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white hover:from-purple-700 hover:to-indigo-800"
                      : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 hover:from-blue-200 hover:to-indigo-200"
                  } transition-all shadow hover:shadow-lg`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              question: "Can I switch plans later?",
              answer: "Yes, you can upgrade, downgrade, or cancel your plan at any time."
            },
            {
              question: "Do you offer student discounts?",
              answer: "We offer a 50% discount for verified students. Contact our support team with your student ID."
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans."
            },
            {
              question: "Is there a free trial?",
              answer: "Yes, all plans come with a 14-day free trial with full access to all features."
            },
            {
              question: "Can I get a refund?",
              answer: "We offer a 30-day money-back guarantee if you're not satisfied with our courses."
            }
          ].map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button className="w-full text-left p-6 bg-white hover:bg-gray-50 font-medium text-lg flex justify-between items-center">
                {item.question}
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="p-6 bg-gray-50 text-gray-700">
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Plan for Your Team?</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Our enterprise solutions provide customized learning paths, group discounts, and dedicated support.
          </p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg"
          >
            Contact Enterprise Team
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;