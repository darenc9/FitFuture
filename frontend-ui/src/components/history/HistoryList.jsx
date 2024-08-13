import React from 'react';

const HistoryList = ({ histories, handlePanelClick }) => {
  
  return (
    <div className="mt-4 space-y-4">
      {(Array.isArray(histories) && !histories.length) && 
        <p className='text-center text-sm'>No history results! Try changing your filters.</p>
      }
      {histories.map(history => (
        <div
          key={history._id}
          className="flex items-center p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
          onClick={() => handlePanelClick(history)}
        >

          <div className="ml-4">
            <h3 className="text-lg font-semibold">{history.exerciseName}</h3>
            <p className="text-gray-600">{new Date(history.date).toISOString().split('T')[0]}</p>
          </div>
          <div className="ml-auto">
            {history.info && <p className='text-sm font-semibold'>{history.info.length} sets</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
