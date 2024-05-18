
// pages/browse/index.js
"use client"
import { useState, useEffect } from 'react';

const BrowsePage = () => {
    const [selectedOption, setSelectedOption] = useState('workouts'); // Default to workouts
    const [workouts, setWorkouts] = useState([]);
    const [routines, setRoutines] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                //TODO: add handling page display for routines
                const res = await fetch(selectedOption === 'workouts' ? 'http://localhost:8080/workouts' : 'http://localhost:8080/routines');
                if (!res.ok) {
                    throw new Error(`Failed to fetch ${selectedOption === 'workouts' ? 'workouts' : 'routines'} data`);
                }
                const data = await res.json();
                console.log(data);
                if (selectedOption === 'workouts') {
                    setWorkouts(data);
                } else {
                    setRoutines(data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [selectedOption]);

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center mt-8">Browse Page</h1>
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setSelectedOption('workouts')}
                    className={`px-4 py-2 mx-2 font-semibold rounded ${selectedOption === 'workouts' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                    Workouts
                </button>
                <button
                    onClick={() => setSelectedOption('routines')}
                    className={`px-4 py-2 mx-2 font-semibold rounded ${selectedOption === 'routines' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                    Routines
                </button>
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-center">{selectedOption === 'workouts' ? 'Workouts' : 'Routines'}</h2>
                <div className="mt-4 space-y-4">
                    {selectedOption === 'workouts' && workouts.map(workout => (
                        <div key={workout._id} className="flex items-center p-4 border rounded-lg shadow-md">
                            <div className="flex-shrink-0 w-16 h-16 bg-gray-300">
                                {/* Placeholder for image */}
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">{workout.name}</h3>
                                <p className="text-gray-600">{workout.category}</p>
                            </div>
                            <div className="ml-auto">
                                {/* TODO: figure out how to calculate time for workout */}
                                <p className="text-sm font-semibold">Time: {workout.time}</p>
                            </div>
                        </div>
                    ))}
                    {selectedOption === 'routines' && (
                        <p className="text-center text-red-500">This feature is currently unavailable.</p>
                    )}
                </div>
            </div>
        </div>
    );

}

export default BrowsePage;
