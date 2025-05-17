import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    price: '',
    duration: '',
    features: '',
    isFeatured: false
  });
  const [isAdding, setIsAdding] = useState(false);

  // Load sample data (replace with API call)
  useEffect(() => {
    setPlans([
      {
        id: 1,
        name: 'Basic Plan',
        price: 9.99,
        duration: 'monthly',
        features: 'Access to basic courses, Limited support',
        isFeatured: false
      },
      {
        id: 2,
        name: 'Pro Plan',
        price: 29.99,
        duration: 'monthly',
        features: 'All courses, Priority support, Certificates',
        isFeatured: true
      }
    ]);
  }, []);

  const handleEdit = (plan) => {
    setIsEditing(plan.id);
    setEditData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: plan.features,
      isFeatured: plan.isFeatured
    });
  };

  const handleSave = () => {
    if (isEditing) {
      setPlans(plans.map(plan => 
        plan.id === isEditing ? { ...plan, ...editData } : plan
      ));
    } else {
      const newPlan = {
        id: plans.length + 1,
        ...editData
      };
      setPlans([...plans, newPlan]);
    }
    setIsEditing(null);
    setIsAdding(false);
    setEditData({
      name: '',
      price: '',
      duration: '',
      features: '',
      isFeatured: false
    });
  };

  const handleDelete = (id) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Plans</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Plan
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? 'Edit Plan' : 'Add New Plan'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Plan Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={editData.price}
                onChange={(e) => setEditData({...editData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Duration</label>
              <select
                className="w-full p-2 border rounded"
                value={editData.duration}
                onChange={(e) => setEditData({...editData, duration: e.target.value})}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="lifetime">Lifetime</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                className="mr-2"
                checked={editData.isFeatured}
                onChange={(e) => setEditData({...editData, isFeatured: e.target.checked})}
              />
              <label htmlFor="featured">Featured Plan</label>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 mb-1">Features (comma separated)</label>
            <textarea
              className="w-full p-2 border rounded"
              rows="3"
              value={editData.features}
              onChange={(e) => setEditData({...editData, features: e.target.value})}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => {
                setIsAdding(false);
                setIsEditing(null);
              }}
              className="px-4 py-2 border rounded"
            >
              <FaTimes className="inline mr-1" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <FaSave className="inline mr-1" /> Save
            </button>
          </div>
        </div>
      )}

      {/* Plans Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Duration</th>
              <th className="px-6 py-3 text-left">Features</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {plan.name}
                  {plan.isFeatured && (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">${plan.price}</td>
                <td className="px-6 py-4 capitalize">{plan.duration}</td>
                <td className="px-6 py-4">
                  <ul className="list-disc list-inside text-sm">
                    {plan.features.split(',').map((feature, i) => (
                      <li key={i}>{feature.trim()}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPlans;