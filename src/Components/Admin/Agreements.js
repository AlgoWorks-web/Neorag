// ✅ FRONTEND (React) Full Code Update (Agreements.js)
// Replaces PDF upload with long text textarea

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../config';

function Agreements() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [agreementText, setAgreementText] = useState('');
  const [agreements, setAgreements] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  };

  useEffect(() => {
    fetchCourses();
    fetchAgreements();
  }, [refresh]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/courses/titles`, { headers: getAuthHeaders() });
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error('Error fetching courses');
    }
  };

  const fetchAgreements = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/agreementpaper/showagreements`, { headers: getAuthHeaders() });
      setAgreements(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (error) {
      toast.error('Error fetching agreements');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!agreementText || !selectedCourse) return toast.error('Enter agreement text and select course');
    try {
      await axios.post(`${API_BASE_URL}/agreementpaper/agreements`, {
        course_master_id: selectedCourse,
        user_agreement: agreementText
      }, { headers: getAuthHeaders() });
      toast.success('Agreement saved');
      resetModal();
    } catch {
      toast.error('Upload failed');
    }
  };

  const handleEdit = (agreement) => {
    setEditingAgreement(agreement);
    setSelectedCourse(agreement.course_master_id);
    setAgreementText(agreement.user_agreement);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!agreementText || !selectedCourse) return toast.error('Enter text and select course');
    try {
      await axios.put(`${API_BASE_URL}/agreementpaper/agreements/${editingAgreement.agreement_id}`, {
        course_master_id: selectedCourse,
        user_agreement: agreementText
      }, { headers: getAuthHeaders() });
      toast.success('Updated successfully');
      resetModal();
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete agreement?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/agreementpaper/agreements/${id}`, { headers: getAuthHeaders() });
      toast.success('Deleted');
      setRefresh(!refresh);
    } catch {
      toast.error('Delete failed');
    }
  };

  const resetModal = () => {
    setEditingAgreement(null);
    setSelectedCourse('');
    setAgreementText('');
    setShowModal(false);
    setRefresh(!refresh);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Course Agreements</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded">
          <FaPlus /> Upload Agreement
        </button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">Course</th>
            <th className="p-2">Agreement Text</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agreements.map((ag) => (
            <tr key={ag.agreement_id} className="border-t">
              <td className="p-2">{ag.agreement_id}</td>
              <td className="p-2">{courses.find(c => c.course_id === ag.course_master_id)?.title || 'Unknown'}</td>
              <td className="p-2 max-w-sm overflow-hidden text-ellipsis">{ag.user_agreement.slice(0, 80)}...</td>
              <td className="p-2">
                <button onClick={() => handleEdit(ag)} className="text-blue-600 mx-1"><FaEdit /></button>
                <button onClick={() => handleDelete(ag.agreement_id)} className="text-red-600 mx-1"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingAgreement ? 'Edit' : 'Upload'} Agreement</h2>
            <form onSubmit={editingAgreement ? handleUpdate : handleUpload} className="space-y-4">
              <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required className="w-full border p-2 rounded">
                <option value=''>-- Select Course --</option>
                {courses.map(course => <option key={course.course_id} value={course.course_id}>{course.title}</option>)}
              </select>
              <textarea value={agreementText} onChange={(e) => setAgreementText(e.target.value)} rows={10} required className="w-full border p-2 rounded" />
              <div className="flex justify-end gap-4">
                <button onClick={resetModal} type="button" className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingAgreement ? 'Update' : 'Upload'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agreements;
