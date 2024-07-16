import React from 'react';

const HistoryFilter = ({ catFilter, startDate, endDate, order, handleFilterChange, handleStartDateChange, handleEndDateChange, handleOrderChange }) => {
    return (
    <div className='mx-auto p-2'>
      <div className="flex items-center justify-evenly">
        <div className='space-x-2'>
          <input type="date" 
              value={startDate}
              onChange={handleStartDateChange}
              className='rounded ring m-1'/>
          <span>to</span>
          <input type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className='rounded ring'/>
        </div>
      </div>
      <div className='flex justify-end gap-2 py-2'>
        {/* <label>Category: </label>
        <select value={catFilter} onChange={handleFilterChange} className="right-0 px-2 py-1 rounded border text-sm">
            <option value="all">All</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="flexibility">Flexibility</option>
            <option value="yoga">Yoga</option>
        </select> */}
        <label>Sort: </label>
        <select value={order} onChange={handleOrderChange} className="right-0 px-2 py-1 rounded border text-sm">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
    );
};

export default HistoryFilter;
