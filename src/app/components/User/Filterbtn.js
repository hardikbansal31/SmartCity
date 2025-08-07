// src/components/FilterButtons.jsx

import React, { useState } from 'react';

// Define filter options in an array for easy management
const filterOptions = [
  'Accident',
  'Construction',
  'Diversion',
  'Congestion',
  'Only Active Alerts',
];

function FilterButtons() {
  // 'useState' hook to track the active filter. 'Accident' is the default.
  const [activeFilter, setActiveFilter] = useState('Accident');

  return (
    <div className="flex flex-wrap items-center gap-3">
      {filterOptions.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`
            rounded-full px-3 py-1 text-[0.7rem] font-semibold text-gray-300 transition-colors duration-200 
            focus:outline-none focus:ring-2 
            ${
              activeFilter === filter
                ? 'bg-blue-600 text-white' // Style for the active button
                : 'bg-zinc-700 hover:bg-zinc-600' // Style for inactive buttons
            }
          `}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;