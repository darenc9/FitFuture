"use client";
import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { workoutAtom, getExerciseAtom } from '../../../exerciseAtom';
import { viewAtom } from '../../../viewAtom'; // Import the view atom
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/solid';
import ExercisePanel from '../../components/build/ExercisePanel';
import { useAtomValue } from 'jotai';

const WorkoutBuilder = () => {
  const [workout, setWorkout] = useAtom(workoutAtom);
  const [view, setView] = useAtom(viewAtom); // Use the view atom
  const router = useRouter();

  const exercisesDetails = workout.exerciseIds.map(id => {
    const exerciseAtom = getExerciseAtom(id);
    return useAtomValue(exerciseAtom);
  });

  const handleAddExercise = () => {
    router.push('/build/exercises'); // Navigate to the exercises page
  };

  const handleSaveWorkout = async () => {
    const payload = {
      workout,
      exercises: exercisesDetails
    };

    // Log the payload
    console.log('Sending payload to backend:', payload);
 
    // Send the payload to the backend
    try {
      const response = await fetch('http://localhost:8080/workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Workout saved successfully:', responseData);
        setView(''); // Unset the view atom
      } else {
        console.error('Failed to save workout:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const renderContent = () => {
    switch(view) {
      case 'workout':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Build Workout</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Workout Name:</label>
              <input
                type="text"
                value={workout.name}
                onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
                className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleAddExercise}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Exercise
              </button>
            </div>
            <div className="space-y-4">
              {workout.exerciseIds.map((exerciseId) => (
                <ExercisePanel key={exerciseId} id={exerciseId} />
              ))}
            </div>
            <div className="mt-4">
              <button
                onClick={handleSaveWorkout}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save Workout
              </button>
            </div>
          </div>
        );
      case 'routine':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Build Routine</h2>
            {/* Add routine building UI components here */}
            <p>Routine building UI goes here...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={() => setView('workout')}
          className={`px-4 py-2 font-semibold rounded ${view === 'workout' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Build Workout
        </button>
        <button
          onClick={() => setView('routine')}
          className={`px-4 py-2 font-semibold rounded ${view === 'routine' ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Build Routine
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default WorkoutBuilder;
