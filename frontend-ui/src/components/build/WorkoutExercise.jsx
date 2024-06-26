'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';
import { getExerciseAtom, workoutAtom, updateExerciseAtom } from '../../../utility/exerciseAtom';
import { getAddEditExerciseAtom, editWorkoutAtom, updateEditExerciseAtom } from '../../../utility/editExerciseAtom';

const WorkoutExercise = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const from = searchParams.get('from');
  const exists = searchParams.get('exists');
  const workoutId = searchParams.get('workoutId');

  const exerciseAtom = from === 'build' ? getExerciseAtom(id) : getAddEditExerciseAtom(id);
  const [exerciseDetails, setExerciseDetails] = useAtom(exerciseAtom);
  const [workout, setWorkout] = useAtom(from === 'build' ? workoutAtom : editWorkoutAtom);

  const [localDetails, setLocalDetails] = useState({
    id: exerciseDetails.id,
    name: exerciseDetails.name || name,
    sets: exerciseDetails.sets || 3,
    reps: exerciseDetails.reps || 10,
    notes: exerciseDetails.notes || '',
    workoutId: workoutId || ''
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    setLocalDetails({
      id: exerciseDetails.id,
      name: exerciseDetails.name || name,
      sets: exerciseDetails.sets || 0,
      reps: exerciseDetails.reps || 0,
      notes: exerciseDetails.notes || '',
      workoutId: workoutId || ''
    });
  }, [exerciseDetails, name, workoutId]);

  const handleSave = () => {
    if (localDetails.sets <= 0 || isNaN(localDetails.sets)) {
      setError('Number of sets must be a number greater than 0.');
      return;
    }
    if (localDetails.reps <= 0 || isNaN(localDetails.reps)) {
      setError('Number of reps must be a number greater than 0.');
      return;
    }

    if (exists) {
      if (from === 'build') {
        updateExerciseAtom(id, { sets: localDetails.sets, reps: localDetails.reps, notes: localDetails.notes });
      } else {
        updateEditExerciseAtom(id, { sets: localDetails.sets, reps: localDetails.reps, notes: localDetails.notes });
      }
    } else {
      setExerciseDetails(localDetails);
      if (!workout.exerciseIds.includes(id)) {
        setWorkout((prevWorkout) => ({
          ...prevWorkout,
          exerciseIds: [...prevWorkout.exerciseIds, id],
        }));
      }
    }

    if (from === 'build') {
      router.push('/build'); // Navigate back to the build page
    } else if (from === 'edit') {
      router.push(`/workouts/edit/${workoutId}`); // Navigate back to the edit page
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalDetails({ ...localDetails, [name]: value });
    setError(null); // Clear error message on change
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Exercise Details</h2>
      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}
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
};

export default WorkoutExercise;
