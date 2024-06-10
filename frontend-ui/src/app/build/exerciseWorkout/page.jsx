'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';
import { getExerciseAtom, workoutAtom } from '../../../../exerciseAtom';

export default function WorkoutExercise() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');

  if (!id || !name) {
    return <p>Loading...</p>;
  }

  const exerciseAtom = getExerciseAtom(id);
  const [exerciseDetails, setExerciseDetails] = useAtom(exerciseAtom);
  const [workout, setWorkout] = useAtom(workoutAtom);

  const [localDetails, setLocalDetails] = useState({
    name: exerciseDetails.name || name,
    sets: exerciseDetails.sets || 0,
    reps: exerciseDetails.reps || 0,
    notes: exerciseDetails.notes || ''
  });

  const handleSave = () => {
    setExerciseDetails(localDetails);

    if (!workout.exerciseIds.includes(id)) {
      setWorkout((prevWorkout) => ({
        ...prevWorkout,
        exerciseIds: [...prevWorkout.exerciseIds, id],
      }));
    }

    router.push('/build'); // Navigate back to the build page
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalDetails({ ...localDetails, [name]: value });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Exercise Details</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Name:</label>
        <input
          type="text"
          name="name"
          value={localDetails.name}
          readOnly
          className="block w-full px-4 py-2 border rounded-md bg-gray-100 focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Sets:</label>
        <input
          type="number"
          name="sets"
          value={localDetails.sets}
          onChange={handleChange}
          className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Reps:</label>
        <input
          type="number"
          name="reps"
          value={localDetails.reps}
          onChange={handleChange}
          className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes:</label>
        <textarea
          name="notes"
          value={localDetails.notes}
          onChange={handleChange}
          className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          rows="4"
        />
      </div>
      <div className="mt-4">
        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save Exercise
        </button>
      </div>
    </div>
  );
}