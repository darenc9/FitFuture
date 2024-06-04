import React from 'react';

const WorkoutExercise = ({ workoutExercise, handlePanelClick }) => {
    const formatExerciseId = (name) => {
        return name.replace(/_/g, ' ');
    };

    return (
        <div
            key={workoutExercise._id}
            className="flex items-center p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
            onClick={() => handlePanelClick(workoutExercise)}
        >
            <div className="flex-shrink-0 w-16 h-16 bg-gray-300">
                {/* Placeholder for image */}
            </div>
            <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold">{formatExerciseId(workoutExercise.exerciseId)}</h3>
                <p className="text-gray-600">{workoutExercise.sets}x - {workoutExercise.reps} reps</p>
            </div>
            <div className="flex-shrink-0 ml-4">
                <button className="w-6 h-6 text-gray-500 hover:text-gray-700">
                    <i className="fas fa-info-circle"></i>
                </button>
            </div>
        </div>
    );
};

export default WorkoutExercise;
