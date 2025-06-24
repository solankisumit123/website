import React from 'react';

const Database: React.FC = () => {
  // Example collections
  const collections = ['Movies', 'Users', 'Categories', 'Downloads'];
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Database</h2>
      <ul className="list-disc pl-6 text-slate-200">
        {collections.map((col, idx) => (
          <li key={idx} className="mb-2">{col}</li>
        ))}
      </ul>
    </div>
  );
};

export default Database; 