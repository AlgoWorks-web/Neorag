import { useState } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const AdminUsers = () => {
  const [expandedUser, setExpandedUser] = useState(null);
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', joined: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', joined: '2023-02-20' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', joined: '2023-03-10' },
  ]);

  const toggleUserExpand = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add User
        </button>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Joined</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.joined}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (visible on mobile) */}
      <div className="md:hidden space-y-4">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleUserExpand(user.id)}
            >
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleUserExpand(user.id);
                }}
                className="text-gray-500"
              >
                {expandedUser === user.id ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            
            {expandedUser === user.id && (
              <div className="p-4 border-t">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">User ID</h4>
                    <p>{user.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Joined</h4>
                    <p>{user.joined}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded"
                  >
                    <FaEdit className="inline mr-1" /> Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-600 rounded"
                  >
                    <FaTrash className="inline mr-1" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;