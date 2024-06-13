import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { workoutAtom, getExerciseAtom } from '../../../utility/exerciseAtom';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/solid';
import ExercisePanel from './ExercisePanel';
import { useAtomValue } from 'jotai';
import useResetExerciseAtoms from '../../../utility/useResetExerciseAtoms'; // Import the reset hook
import { profileIdAtom } from '../../../store';

const WorkoutBuilderContent = ({ setView }) => {
  const [workout, setWorkout] = useAtom(workoutAtom);
  const router = useRouter();
  const resetAtoms = useResetExerciseAtoms(); // Get the reset function
  const [error, setError] = useState(null); // State for error message
  const [currentUser] = useAtom(profileIdAtom);

  // Initialize the public state from the workout atom
  const [isPublic, setIsPublic] = useState(workout.public);

  const exercisesDetails = workout.exerciseIds.map(id => {
    const exerciseAtom = getExerciseAtom(id);
    return { ...useAtomValue(exerciseAtom), id }; // Ensure id is included
  });

  const handleAddExercise = () => {
    router.push('/build/exercises?from=build'); // Navigate to the exercises page
  };

  const handleSaveWorkout = async () => {
    if (!workout.name) {
      setError('Please enter a workout name.');
      return;
    }

    if (workout.exerciseIds.length === 0) {
      setError('Please add at least one exercise to the workout.');
      return;
    }

    const payload = {
      workout: { ...workout, public: isPublic, user: currentUser }, // Include public/private status and user in the payload
      exercises: exercisesDetails // Each exercise will include its id
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
        resetAtoms(); // Reset the atoms
      } else {
        console.error('Failed to save workout:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const handleCheckboxChange = (e) => {
    setIsPublic(e.target.checked);
    setWorkout({ ...workout, public: e.target.checked });
  };

  const handlePanelClick = (item) => {
    console.log(item);
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Build Workout</h2>
      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Workout Name:</label>
        <input
          type="text"
          value={workout.name}
          onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
          className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="flex items-center mb-4">
        <label className="block text-sm font-medium text-gray-700 mr-2">Public:</label>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={handleCheckboxChange}
          className="form-checkbox h-5 w-5 text-blue-600"
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
          <ExercisePanel key={exerciseId} id={exerciseId} handlePanelClick={handlePanelClick} />
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
};

export default WorkoutBuilderContent;
