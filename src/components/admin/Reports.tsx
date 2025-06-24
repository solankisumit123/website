import React from 'react';

const Reports: React.FC = () => {
  // Example reports
  const reports = [
    { id: 1, title: 'Monthly Report', date: '2024-06-01' },
    { id: 2, title: 'User Activity', date: '2024-06-02' },
  ];
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Reports</h2>
      <ul className="text-slate-200">
        {reports.map((r) => (
          <li key={r.id} className="mb-2">
            <span className="font-semibold">{r.title}</span> <span className="text-xs text-slate-400">({r.date})</span>
          </li>
        ))}
      </ul>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Report</button>
    </div>
  );
};

export default Reports; 