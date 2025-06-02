// src/components/Trainer/TrainingInfo.js
import React, { useState } from 'react';

const TrainingInfo = () => {
  const [trainings, setTrainings] = useState([
    {
      id: 1,
      title: 'React Fundamentals',
      description: 'Learn the core concepts of React including components, state, props, and hooks',
      startDate: '2023-06-01',
      endDate: '2023-06-15',
      students: 42,
      status: 'active'
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      description: 'Deep dive into advanced JavaScript concepts like closures, promises, and async/await',
      startDate: '2023-07-01',
      endDate: '2023-07-15',
      students: 28,
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Node.js Backend Development',
      description: 'Build robust backend services using Node.js, Express, and MongoDB',
      startDate: '2023-05-01',
      endDate: '2023-05-15',
      students: 35,
      status: 'completed'
    }
  ]);

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
    const newTrainingWithId = {
      ...newTraining,
      id: trainings.length + 1,
      status: 'upcoming'
    };
    setTrainings([...trainings, newTrainingWithId]);
    setNewTraining({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      students: 0
    });
    setShowForm(false);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      upcoming: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Training Programs</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Add New Training
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Create New Training</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map(training => (
          <div key={training.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-800">{training.title}</h3>
                {getStatusBadge(training.status)}
              </div>
              <p className="mt-2 text-gray-600">{training.description}</p>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Date</p>
                  <p className="text-gray-900">{new Date(training.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">End Date</p>
                  <p className="text-gray-900">{new Date(training.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Students</p>
                  <p className="text-gray-900">{training.students}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="text-gray-900">2 weeks</p>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded">
                  View Details
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                  Manage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingInfo;