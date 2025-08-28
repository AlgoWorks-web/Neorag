// src/pages/AdminFAQ.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminFAQ() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [faqs, setFaqs] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ['General', 'Courses', 'Certification', 'Payment', 'Technical Support'];

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  };

  useEffect(() => {
    fetchFAQs();
  }, [refresh]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://hydersoft.com/api/secure/faqs/getfaqs', { headers: getAuthHeaders() });
      
      // Handle different response structures
      let faqsData = [];
      if (res.data.success && res.data.data) {
        // If paginated response
        faqsData = Array.isArray(res.data.data.data) ? res.data.data.data : [];
        // If direct array
        if (faqsData.length === 0 && Array.isArray(res.data.data)) {
          faqsData = res.data.data;
        }
      } else if (Array.isArray(res.data)) {
        // If direct array response
        faqsData = res.data;
      }
      
      setFaqs(faqsData);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Error fetching FAQs');
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      return toast.error('Please enter both question and answer');
    }

    try {
      setLoading(true);
      const faqData = {
        question: question.trim(),
        answer: answer.trim(),
        category,
        is_active: true
      };

      if (editingFAQ) {
        // Update existing FAQ
        await axios.put(`https://hydersoft.com/api/secure/faqs/editoption/${editingFAQ.id}`, faqData, { headers: getAuthHeaders() });
        toast.success('FAQ updated successfully');
      } else {
        // Create new FAQ
        await axios.post('https://hydersoft.com/api/secure/faqs/save', faqData, { headers: getAuthHeaders() });
        toast.success('FAQ created successfully');
      }
      
      resetModal();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      if (error.response?.status === 422) {
        // Handle validation errors
        const errors = error.response.data.errors;
        if (errors) {
          const firstError = Object.values(errors)[0];
          toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
        } else {
          toast.error('Validation failed');
        }
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to save FAQ');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq) => {
    setEditingFAQ(faq);
    setQuestion(faq.question || '');
    setAnswer(faq.answer || '');
    setCategory(faq.category || 'General');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`https://hydersoft.com/api/secure/faqs/${id}`, { headers: getAuthHeaders() });
      toast.success('FAQ deleted successfully');
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to delete FAQ');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setEditingFAQ(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setShowModal(false);
    setRefresh(!refresh);
  };

  const handleModalClose = (e) => {
    // Prevent closing when clicking inside the modal content
    if (e.target === e.currentTarget) {
      resetModal();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">FAQ Management</h2>
          <p className="text-gray-600 mt-1">Manage frequently asked questions</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold w-full sm:w-auto justify-center"
        >
          <FaPlus /> Add FAQ
        </button>
      </div>

      {/* Loading State */}
      {loading && !showModal ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading FAQs...</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {/* <th className="p-4 text-left font-semibold text-gray-700">ID</th> */}
                    <th className="p-4 text-left font-semibold text-gray-700">Q&As</th>
                    <th className="p-4 text-left font-semibold text-gray-700">Category</th>
                    <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                    <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        No FAQs found. Click "Add FAQ" to create your first FAQ.
                      </td>
                    </tr>
                  ) : (
                    faqs.map((faq) => (
                      <tr key={faq.id} className="border-t hover:bg-gray-50">
                        {/* <td className="p-4">{faq.id}</td> */}
                        <td className="p-4">
                          <div className="max-w-md">
                            <p className="font-medium text-gray-900 truncate">{faq.question}</p>
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {faq.answer ? faq.answer.slice(0, 100) + '...' : 'No answer'}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {faq.category || 'General'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            faq.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {faq.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(faq)} 
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Edit FAQ"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDelete(faq.id)} 
                              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete FAQ"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View - Hidden on desktop */}
          <div className="md:hidden space-y-4">
            {faqs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No FAQs found</h3>
                <p className="text-gray-500 text-sm">Click "Add FAQ" to create your first FAQ.</p>
              </div>
            ) : (
              faqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {/* <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                        ID: {faq.id}
                      </span> */}
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {faq.category || 'General'}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      faq.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {faq.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Question */}
                  <h3 className="font-semibold text-gray-900 mb-2 leading-tight">
                    {faq.question}
                  </h3>

                  {/* Answer Preview */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {faq.answer ? faq.answer.slice(0, 120) + '...' : 'No answer available'}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => handleEdit(faq)} 
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <FaEdit size={14} />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(faq.id)} 
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      <FaTrash size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          onClick={handleModalClose}
        >
          <div 
            className="bg-white p-4 md:p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button 
                onClick={resetModal} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Question Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your question"
                  maxLength="500"
                />
                <p className="text-xs text-gray-500 mt-1">{question.length}/500 characters</p>
              </div>

              {/* Answer Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Enter your answer"
                  minLength="10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {answer.length} characters (minimum 10 required)
                </p>
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                <button
                  onClick={resetModal}
                  type="button"
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || question.length < 1 || answer.length < 10}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    editingFAQ ? 'Update FAQ' : 'Add FAQ'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminFAQ;
