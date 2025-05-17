const GeneralStats = () => {
  const stats = [
    { label: "New Visitors", value: "25%", width: "25%", color: "bg-green-500" },
    { label: "New Users", value: "50%", width: "50%", color: "bg-orange-500" },
    { label: "Bounce Rate", value: "75%", width: "75%", color: "bg-red-500" }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h5 className="font-bold text-lg mb-4">General Stats</h5>
      {stats.map((stat, index) => (
        <div key={index}>
          <p className="mb-1">{stat.label}</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className={`${stat.color} h-4 rounded-full text-center text-white text-xs`} 
              style={{width: stat.width}}
            >
              {stat.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GeneralStats;