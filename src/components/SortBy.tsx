import React from 'react';
import { ChevronDown, SortAsc, SortDesc } from 'lucide-react';

export type SortOption = 'latest' | 'rating' | 'title' | 'year' | 'quality';
export type SortOrder = 'asc' | 'desc';

interface SortByProps {
  sortBy: SortOption;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortOption, sortOrder: SortOrder) => void;
  className?: string;
}

const SortBy: React.FC<SortByProps> = ({ 
  sortBy, 
  sortOrder, 
  onSortChange, 
  className = '' 
}) => {
  const handleSortChange = (newSortBy: SortOption) => {
    // If clicking the same sort option, toggle order
    if (newSortBy === sortBy) {
      onSortChange(newSortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to desc for most options, asc for title
      const defaultOrder: SortOrder = newSortBy === 'title' ? 'asc' : 'desc';
      onSortChange(newSortBy, defaultOrder);
    }
  };

  const getSortIcon = (option: SortOption) => {
    if (sortBy !== option) return null;
    return sortOrder === 'asc' ? 
      <SortAsc className="h-4 w-4" /> : 
      <SortDesc className="h-4 w-4" />;
  };

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'rating', label: 'Rating' },
    { value: 'title', label: 'Title' },
    { value: 'year', label: 'Year' },
    { value: 'quality', label: 'Quality' }
  ] as const;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-gray-300 text-sm font-medium">Sort by:</span>
      <div className="relative">
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [newSortBy, newSortOrder] = e.target.value.split('-') as [SortOption, SortOrder];
            onSortChange(newSortBy, newSortOrder);
          }}
          className="appearance-none bg-gray-700 text-white rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-colors"
        >
          {sortOptions.map((option) => (
            <React.Fragment key={option.value}>
              <option value={`${option.value}-asc`}>
                {option.label} (A-Z)
              </option>
              <option value={`${option.value}-desc`}>
                {option.label} (Z-A)
              </option>
            </React.Fragment>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      
      {/* Quick sort buttons */}
      <div className="flex items-center gap-1 ml-2">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
              sortBy === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
          >
            {option.label}
            {getSortIcon(option.value)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortBy; 