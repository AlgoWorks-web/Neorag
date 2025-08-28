import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://hydersoft.com/api/secure/faqs/getfaqs');
      
      console.log('API Response:', response.data); // Debug log
      
      // Handle different response structures with proper type checking
      let faqData = [];
      
      if (response.data) {
        // Case 1: Direct array response
        if (Array.isArray(response.data)) {
          faqData = response.data;
        }
        // Case 2: Response with success flag
        else if (response.data.success && response.data.data) {
          if (Array.isArray(response.data.data)) {
            faqData = response.data.data;
          } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
            // Paginated response
            faqData = response.data.data.data;
          }
        }
        // Case 3: Response with data property
        else if (response.data.data && Array.isArray(response.data.data)) {
          faqData = response.data.data;
        }
      }
      
      // Ensure faqData is always an array
      if (!Array.isArray(faqData)) {
        console.warn('FAQ data is not an array:', faqData);
        faqData = [];
      }
      
      console.log('Processed FAQ Data:', faqData); // Debug log
      
      setFaqs(faqData);
      
      // Extract unique categories only if we have valid FAQ data
      if (faqData.length > 0) {
        const uniqueCategories = [...new Set(faqData.map(faq => faq.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } else {
        setCategories([]);
      }
      
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setFaqs([]); // Ensure faqs is always an array
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs = faqs.filter(faq => {
    if (!faq || typeof faq !== 'object') return false;
    
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = (faq.question && faq.question.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (faq.answer && faq.answer.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <div className="container mx-auto px-4 max-w-4xl">
        
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our courses and services.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-10">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                }`}
              >
                All ({faqs.length})
              </button>
              {categories.map((category) => {
                const count = faqs.filter(faq => faq.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                    }`}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                {faqs.length === 0 ? 'No FAQs Available' : 'No FAQs Found'}
              </h3>
              <p className="text-gray-500">
                {faqs.length === 0 
                  ? 'Check back later for frequently asked questions.' 
                  : 'Try adjusting your search or category filter.'}
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                        {faq.category || 'General'}
                      </span>
                      {faq.is_active && (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                      {faq.question || 'No question available'}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div className={`transform transition-transform duration-200 ${openFAQ === faq.id ? 'rotate-180' : ''}`}>
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                {/* Answer Section */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFAQ === faq.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6">
                    <div className="border-t pt-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {faq.answer || 'No answer available'}
                      </p>
                      {faq.updated_at && (
                        <p className="text-xs text-gray-400 mt-3">
                          Last updated: {new Date(faq.updated_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Help Section */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-4xl mb-4">💡</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Can't find the answer you're looking for? Our support team is here to help you.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
            support@neorag.com
          </button>
        </div>
      </div>
    </div>
  );
}

export default Faqs;
