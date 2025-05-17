const RecentComments = () => {
  const comments = [
    {
      name: "John",
      date: "Sep 29, 2014, 9:12 PM",
      text: "Keep up the GREAT work! I am cheering for you!! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      name: "Bo",
      date: "Sep 28, 2014, 10:15 PM",
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h5 className="font-bold text-lg mb-4">Recent Comments</h5>
      {comments.map((comment, index) => (
        <div key={index} className={`flex mb-4 ${index < comments.length - 1 ? "pb-4 border-b" : ""}`}>
          <div className="flex-shrink-0 mr-4">
            <div className="w-16 h-16 rounded-full bg-gray-300"></div>
          </div>
          <div>
            <h4 className="font-bold">
              {comment.name} <span className="text-gray-500 text-sm">{comment.date}</span>
            </h4>
            <p className="mt-1">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentComments;