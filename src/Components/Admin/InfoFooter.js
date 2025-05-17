const InfoFooter = () => {
  const sections = [
    {
      title: "Demographic",
      borderColor: "border-green-500",
      items: ["Language", "Country", "City"]
    },
    {
      title: "System",
      borderColor: "border-red-500",
      items: ["Browser", "OS", "More"]
    },
    {
      title: "Target",
      borderColor: "border-orange-500",
      items: ["Users", "Active", "Geo", "Interests"]
    }
  ];

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <div key={index}>
            <h5 className={`border-b-2 ${section.borderColor} pb-2 mb-3 font-bold`}>{section.title}</h5>
            {section.items.map((item, idx) => (
              <p key={idx}>{item}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoFooter;