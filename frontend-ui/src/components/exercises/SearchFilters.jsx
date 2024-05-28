import React, { useState } from "react";
import { force, level, mechanic, equipment, muscle, category } from "@/data/exerciseschema";

const SearchFilters = ({ filters, handleFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters((prevShowFilters) => !prevShowFilters);
  };

  const renderDropdown = (name, options) => (
    <select
      name={name}
      value={filters[name]}
      onChange={handleFilterChange}
      className="px-4 py-2 mb-2 md:mb-0 border rounded-lg w-full md:w-auto"
    >
      <option value="">{`Select ${name}`}</option>
      {options.enum && options.enum.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  return (
    <div className="mb-4">
      <button
        onClick={toggleFilters}
        className="w-full px-4 py-2 mb-2 bg-blue-500 text-white rounded-lg"
      >
        Filter
      </button>
      {showFilters && (
        <div className="flex flex-wrap justify-between">
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Name"
            className="px-4 py-2 mb-2 md:mb-0 border rounded-lg w-full md:w-auto"
          />
          {renderDropdown("muscle", muscle)}
          {renderDropdown("category", category)}
          {renderDropdown("force", force)}
          {renderDropdown("level", level)}
          {renderDropdown("mechanic", mechanic)}
          {renderDropdown("equipment", equipment)}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
