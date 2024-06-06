"use client"
import React, { useState } from 'react';
import BuildWorkout from '../../components/build/BuildWorkout'; 

// import BuildWorkout from './BuildWorkout';
// import BuildRoutine from './BuildRoutine';

const BuildPage = () => {
  const [view, setView] = useState(null);

  const renderContent = () => {
    switch(view) {
      case 'workout':
        //return <p>build workout</p>
        return <BuildWorkout />;
      case 'routine':
        return <p>build routine</p>
        //return <BuildRoutine />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="content flex flex-col items-center">
        <div className="flex justify-center mb-4">
          <button 
            onClick={() => setView('workout')}
            className={`px-4 py-2 mx-2 font-semibold rounded ${view === 'workout' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
            Build Workout
          </button>
          <button 
            onClick={() => setView('routine')}
            className={`px-4 py-2 mx-2 font-semibold rounded ${view === 'routine' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
            Build Routine
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default BuildPage;
