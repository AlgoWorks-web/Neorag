
import React, { useState } from "react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'NeoRAG LMS',
    maintenanceMode: false,
    registrationOpen: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings logic here
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">System Settings</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Site Name</label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="maintenanceMode"
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="maintenanceMode">Maintenance Mode</label>
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="registrationOpen"
              id="registrationOpen"
              checked={settings.registrationOpen}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="registrationOpen">Allow New Registrations</label>
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;