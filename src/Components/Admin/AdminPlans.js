import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaBars, FaChevronDown, FaChevronUp } from 'react-icons/fa';

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
  const [mobileView, setMobileView] = useState({});
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Toggle mobile view for each plan
  const toggleMobileView = (id) => {
    setMobileView(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Load sample data
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
    setShowMobileMenu(false);
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
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 rounded-md bg-gray-200"
        >
          <FaBars className="text-gray-700" />
        </button>
        <h2 className="text-xl font-bold">Plans</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-2 rounded-md bg-blue-600 text-white"
        >
          <FaPlus />
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center mb-6">
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {isEditing ? 'Edit Plan' : 'Add New Plan'}
            </h3>
            <button
              onClick={() => {
                setIsAdding(false);
                setIsEditing(null);
              }}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Plan Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div>
              <label className="block text-gray-700 mb-1">Features (one per line)</label>
              <textarea
                className="w-full p-2 border rounded"
                rows="4"
                value={editData.features}
                onChange={(e) => setEditData({...editData, features: e.target.value})}
                placeholder="Enter each feature on a new line"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => {
                setIsAdding(false);
                setIsEditing(null);
              }}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Plan
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
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
                    aria-label="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden space-y-4">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleMobileView(plan.id)}
            >
              <div>
                <h3 className="font-medium">
                  {plan.name}
                  {plan.isFeatured && (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600">${plan.price} / {plan.duration}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMobileView(plan.id);
                }}
                className="text-gray-500"
              >
                {mobileView[plan.id] ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            
            {mobileView[plan.id] && (
              <div className="p-4 border-t">
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Features</h4>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    {plan.features.split(',').map((feature, i) => (
                      <li key={i} className="text-sm">{feature.trim()}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      aria-label="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      aria-label="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPlans;