import { FaUser, FaBell, FaUsers, FaComment, FaBookmark, FaLaptop, FaShareAlt } from 'react-icons/fa';

const RegionsFeeds = () => {
  const feeds = [
    { icon: <FaUser className="text-blue-500 text-xl" />, text: "New record, over 90 views.", time: "10 mins" },
    { icon: <FaBell className="text-red-500 text-xl" />, text: "Database error.", time: "15 mins" },
    { icon: <FaUsers className="text-yellow-500 text-xl" />, text: "New record, over 40 users.", time: "17 mins" },
    { icon: <FaComment className="text-red-500 text-xl" />, text: "New comments.", time: "25 mins" },
    { icon: <FaBookmark className="text-blue-500 text-xl" />, text: "Check transactions.", time: "28 mins" },
    { icon: <FaLaptop className="text-red-500 text-xl" />, text: "CPU overload.", time: "35 mins" },
    { icon: <FaShareAlt className="text-green-500 text-xl" />, text: "New shares.", time: "39 mins" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
        <h5 className="font-bold text-lg mb-3">Regions</h5>
        <div className="bg-gray-200 h-48 flex items-center justify-center">
          <p>Map Placeholder</p>
        </div>
      </div>
      
      <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
        <h5 className="font-bold text-lg mb-3">Feeds</h5>
        <table className="w-full">
          <tbody>
            {feeds.map((feed, index) => (
              <tr key={index} className={index < feeds.length - 1 ? "border-b" : ""}>
                <td className="py-2">{feed.icon}</td>
                <td className="py-2">{feed.text}</td>
                <td className="py-2 text-gray-500">{feed.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegionsFeeds;