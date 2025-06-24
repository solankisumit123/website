import React from 'react';

const Settings: React.FC = () => {
  // Example settings
  const settings = [
    { name: 'Site Title', value: 'Movie Hub' },
    { name: 'Theme', value: 'Dark' },
    { name: 'Notifications', value: 'Enabled' },
  ];
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">System Settings</h2>
      <table className="w-full text-left text-slate-200 mb-4">
        <tbody>
          {settings.map((s, idx) => (
            <tr key={idx} className="border-t border-slate-700">
              <td className="py-2 font-semibold">{s.name}</td>
              <td className="py-2">{s.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Settings</button>
    </div>
  );
};

export default Settings; 