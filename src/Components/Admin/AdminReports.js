const AdminReports = () => {
  // Sample report data
  const reports = [
    { id: 1, name: 'User Growth', lastRun: '2023-05-10', frequency: 'Monthly' },
    { id: 2, name: 'Course Completion', lastRun: '2023-05-15', frequency: 'Weekly' },
    // More reports...
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reports</h2>
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg">Available Reports</h3>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Generate New Report
          </button>
        </div>
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Report Name</th>
              <th className="text-left p-2">Last Run</th>
              <th className="text-left p-2">Frequency</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} className="border-b">
                <td className="p-2">{report.id}</td>
                <td className="p-2">{report.name}</td>
                <td className="p-2">{report.lastRun}</td>
                <td className="p-2">{report.frequency}</td>
                <td className="p-2">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">Run</button>
                  <button className="text-green-500 hover:text-green-700 mr-2">Download</button>
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

export default AdminReports;