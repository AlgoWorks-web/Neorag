import { FaComment, FaEye, FaShareAlt, FaUsers } from 'react-icons/fa';

const StatsCards = () => {
  const stats = [
    { icon: <FaComment className="text-3xl" />, value: 52, label: "Messages", color: "bg-red-500" },
    { icon: <FaEye className="text-3xl" />, value: 99, label: "Views", color: "bg-blue-500" },
    { icon: <FaShareAlt className="text-3xl" />, value: 23, label: "Shares", color: "bg-teal-500" },
    { icon: <FaUsers className="text-3xl" />, value: 50, label: "Users", color: "bg-orange-500" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.color} text-white p-4 rounded-lg shadow`}>
          <div className="flex justify-between items-center">
            {stat.icon}
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </div>
          <h4 className="mt-2">{stat.label}</h4>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;