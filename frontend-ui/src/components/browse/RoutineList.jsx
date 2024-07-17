// components/browse/RoutineList.js
import React from 'react';

const RoutineList = ({ routines, handlePanelClick }) => {
    return (
        <div className="mt-4 space-y-4">
            {routines.map((routine) => (
                <div
                    key={routine.routineId}
                    className="flex items-center p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                    onClick={() => handlePanelClick(routine)}
                >
                <div className="flex-shrink-0 w-16 h-16 relative">
                        <img
                            src={`/category/${routine.category}.jpg`} // Update the path and extension as needed
                            alt={routine.category}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold">{routine.routineName}</h3>
                        <p className="text-gray-600">{routine.category}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RoutineList;
