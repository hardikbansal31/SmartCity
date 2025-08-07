// src/components/SearchBar.jsx

import React, { useState } from 'react';

function SearchBar() {
  // State to hold and manage the input's value
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterClick = () => {
    // Add your filter logic here
    alert('Filter button clicked!');
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Icon (left side) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Input Field */}
      <input
        type="text"
        placeholder="search for places"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full h-[2rem] rounded-full border-2 border-gray-200 bg-white py-3 pl-11 pr-12 text-base text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
      />

      {/* Filter Icon Button (right side) */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
        <button onClick={handleFilterClick} className="focus:outline-none">
          <svg className="h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
            <path d="M240.2,43.2a15.9,15.9,0,0,0-17-1.4L136,83.1,48.8,41.8a15.9,15.9,0,0,0-17,1.4A15.8,15.8,0,0,0,24,57.8V192a16,16,0,0,0,27.2,11.2L128,144l76.8,59.2A16,16,0,0,0,232,192V57.8A15.8,15.8,0,0,0,240.2,43.2Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SearchBar;