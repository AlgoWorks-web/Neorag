const RecentUsers = () => {
  const users = [
    { name: "Mike" },
    { name: "Jill" },
    { name: "Jane" }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h5 className="font-bold text-lg mb-4">Recent Users</h5>
      <ul>
        {users.map((user, index) => (
          <li key={index} className={`p-4 flex items-center ${index < users.length - 1 ? "border-b" : ""}`}>
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
            <span className="text-xl">{user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentUsers;