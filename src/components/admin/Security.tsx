import React from 'react';

const Security: React.FC = () => {
  // Example security settings
  const settings = ['2FA Enabled', 'Password Policy: Strong', 'Admin Approval Required'];
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Security Settings</h2>
      <ul className="list-disc pl-6 text-slate-200">
        {settings.map((s, idx) => (
          <li key={idx} className="mb-2">{s}</li>
        ))}
      </ul>
    </div>
  );
};

export default Security; 