import { useState } from 'react';
import { FaPlay, FaDownload, FaTrash, FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const AdminReports = () => {
  const [expandedReport, setExpandedReport] = useState(null);
  const [reports] = useState([
    { id: 1, name: 'User Growth', lastRun: '2023-05-10', frequency: 'Monthly' },
    { id: 2, name: 'Course Completion', lastRun: '2023-05-15', frequency: 'Weekly' },
    { id: 3, name: 'Revenue Analytics', lastRun: '2023-05-20', frequency: 'Quarterly' },
  ]);

  const toggleReportExpand = (reportId) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reports Dashboard</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
          <FaPlus className="mr-2" /> New Report
        </button>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Report Name</th>
              <th className="px-6 py-3 text-left">Last Run</th>
              <th className="px-6 py-3 text-left">Frequency</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map(report => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{report.id}</td>
                <td className="px-6 py-4 font-medium">{report.name}</td>
                <td className="px-6 py-4">{report.lastRun}</td>
                <td className="px-6 py-4 capitalize">{report.frequency}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 p-1">
                    <FaPlay className="inline mr-1" /> Run
                  </button>
                  <button className="text-green-600 hover:text-green-800 p-1">
                    <FaDownload className="inline mr-1" /> Download
                  </button>
                  <button className="text-red-600 hover:text-red-800 p-1">
                    <FaTrash className="inline mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (visible on mobile) */}
      <div className="md:hidden space-y-4">
        {reports.map(report => (
          <div key={report.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleReportExpand(report.id)}
            >
              <div>
                <h3 className="font-medium">{report.name}</h3>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-sm text-gray-600">Last: {report.lastRun}</span>
                  <span className="text-sm px-2 py-0.5 bg-gray-100 rounded-full">
                    {report.frequency}
                  </span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleReportExpand(report.id);
                }}
                className="text-gray-500"
              >
                {expandedReport === report.id ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            
            {expandedReport === report.id && (
              <div className="p-4 border-t">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Report ID</h4>
                    <p>{report.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Frequency</h4>
                    <p className="capitalize">{report.frequency}</p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 flex items-center"
                  >
                    <FaPlay className="mr-1" /> Run
                  </button>
                  <button
                    className="text-green-600 hover:text-green-800 px-3 py-1 flex items-center"
                  >
                    <FaDownload className="mr-1" /> Download
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 px-3 py-1 flex items-center"
                  >
                    <FaTrash className="mr-1" /> Delete
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

export default AdminReports;