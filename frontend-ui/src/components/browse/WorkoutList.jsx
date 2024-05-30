import React from 'react';
import { useRouter } from 'next/navigation';

const WorkoutList = ({ workouts, handlePanelClick }) => {
    const router = useRouter(); // Initialize useRouter
    return (
        <div className="mt-4 space-y-4">
            {workouts.map(workout => (
                <div
                    key={workout._id}
                    className="flex items-center p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                    onClick={() => handlePanelClick(workout)}
                >
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-300">
                        {/* Placeholder for image */}
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold">{workout.name}</h3>
                        <p className="text-gray-600">{workout.category}</p>
                    </div>
                    <div className="ml-auto">
                        <p className="text-sm font-semibold">Time: {workout.time}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WorkoutList;
