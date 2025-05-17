const AdminUsers = () => {
  // This would come from your API in a real app
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', joined: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', joined: '2023-02-20' },
    // More users...
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Joined</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.joined}</td>
                <td className="p-2">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                  <button className="text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;