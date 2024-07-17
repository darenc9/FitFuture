// components/browse/RoutineFilter.js
import React from 'react';

const RoutineFilter = ({ filter, searchQuery, handleFilterChange, handleSearchChange }) => {
    return (
        <div className="flex justify-between items-center mb-4 relative">
            <input 
                type="text" 
                value={searchQuery} 
                onChange={handleSearchChange} 
                placeholder="Search by name..." 
                className="px-2 py-1 rounded border text-sm"
            />
            <select value={filter} onChange={handleFilterChange} className="absolute right-0 px-2 py-1 rounded border text-sm">
            <option value="all">All</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="flexibility">Flexibility</option>
            <option value="yoga">Yoga</option>
            <option value="custom">Custom</option>
                {/* Add more options as needed */}
            </select>
        </div>
    );
};

export default RoutineFilter;
