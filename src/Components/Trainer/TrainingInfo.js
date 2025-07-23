// src/components/Trainer/TrainingInfo.js
import React, { useState } from 'react';

const TrainingInfo = () => {
  const [newTraining, setNewTraining] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    students: 0
  });

  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTraining(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle submission logic here (e.g. API call)
    console.log("New Training Submitted:", newTraining);
    setNewTraining({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      students: 0
    });
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Training Programs</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Add New Class
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Create New Class</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTraining.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="students" className="block text-gray-700 text-sm font-medium mb-2">Max Students</label>
                <input
                  type="number"
                  id="students"
                  name="students"
                  value={newTraining.students}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="startDate" className="block text-gray-700 text-sm font-medium mb-2">Start Date *</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={newTraining.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-gray-700 text-sm font-medium mb-2">End Date *</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={newTraining.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={newTraining.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Training
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TrainingInfo;
