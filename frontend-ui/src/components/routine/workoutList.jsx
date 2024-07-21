import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

const WorkoutList = ({ workouts, handlePanelClick, currentWorkoutIndex, completedWorkouts }) => {
  return (
    <div className="mt-4 space-y-4">
      {workouts.map((workout, index) => (
        <div key={workout.workoutId}>
          <div
            className={`flex items-center p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100 ${index === currentWorkoutIndex ? 'bg-blue-100' : ''}`}
            onClick={() => handlePanelClick(workout)}
          >
            <div className="flex-shrink-0 w-16 h-16 relative">
              <img
                src={`/category/${workout.category}.jpg`} // Update the path and extension as needed
                alt={workout.category}
                className="w-full h-full object-cover rounded-lg"
              />
              {index === currentWorkoutIndex && (
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-bl-lg">
                  Current
                </div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold">{workout.name}</h3>
              <p className="text-gray-600">{workout.category}</p>
            </div>
            {completedWorkouts.includes(workout.workoutId) && (
              <CheckIcon className="w-6 h-6 text-green-500 ml-auto" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkoutList;
