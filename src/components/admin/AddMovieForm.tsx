import React from 'react';

type Props = {
  theme: 'dark' | 'light';
};

const AddMovieForm: React.FC<Props> & { StickyActions?: React.FC } = ({ theme }) => {
  return (
    <form className="space-y-6">
      {/* Movie search, form fields, etc. will go here */}
      <div className="text-gray-400">Movie form coming soon...</div>
    </form>
  );
};

const StickyActions: React.FC = () => (
  <div className="sticky top-24 flex flex-col gap-4">
    {/* Save/Publish buttons, validation, etc. */}
    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Save</button>
    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Publish</button>
  </div>
);

AddMovieForm.StickyActions = StickyActions;

export default AddMovieForm; 