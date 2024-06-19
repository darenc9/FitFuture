"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { profileIdAtom } from '../../../store';
import ExercisePanel from './ExercisePanel';
import { editWorkoutAtom, setEditExerciseAtoms } from '../../../utility/editExerciseAtom';
import { useAtomValue } from 'jotai';
import { PlusIcon } from '@heroicons/react/24/solid';
import { GetToken } from '../AWS/GetToken';

const WorkoutEdit = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { id } = useParams();
  const [currentUser] = useAtom(profileIdAtom);
  const [workout, setWorkout] = useAtom(editWorkoutAtom);
  const router = useRouter();
  const currentWorkout = useAtomValue(editWorkoutAtom);
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null); // State for error message

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only fetch if currentWorkout isn't already populated
        const authToken = await GetToken();
        if (!currentWorkout.workoutId) {
          console.log("fetching data");
          const res = await fetch(`${API_URL}/workout/${id}`, {headers: {'Authorization': `Bearer ${authToken}`}});
          if (!res.ok) {
            throw new Error(`Failed to fetch workout with id: ${id}`);
          }
          const exerciseData = await res.json();

          const res2 = await fetch(`${API_URL}/workouts/${id}`, {headers: {'Authorization': `Bearer ${authToken}`}});
          if (!res2.ok) {
            throw new Error(`Failed to fetch workout with id: ${id}`);
          }
          const workoutData = await res2.json();

          // Populate editWorkoutAtom
          setWorkout({
            workoutId: workoutData.workoutId,
            name: workoutData.name,
            exerciseIds: exerciseData.map(ex => ex.exerciseId),
            public: workoutData.public,
          });

          // Populate exercise atoms
          setEditExerciseAtoms(exerciseData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id, setWorkout, currentWorkout]);

  useEffect(() => {
    // Update isPublic whenever workout is updated
    if (workout.public !== undefined) {
      setIsPublic(workout.public);
    }
  }, [workout]);

  const handleUpdateWorkout = async () => {
    if (!workout.name) {
      setError('Please enter a workout name.');
      return;
    }

    if (workout.exerciseIds.length === 0) {
      setError('Please add at least one exercise to the workout.');
      return;
    }

    router.push('/workouts/edit/updateWorkout?workoutId=' + workout.workoutId);
  };

  const handleAddExercise = () => {
    router.push('/build/exercises?from=edit&workoutId='+ workout.workoutId); // Navigate to the exercises page
  };

  const handleCheckboxChange = (e) => {
    setWorkout({ ...workout, public: e.target.checked });
  };

  const handlePanelClick = (item) => {
    console.log(item);
    router.push(`/build/exerciseWorkout?from=edit&id=${item.id}&exists=true&workoutId=${workout.workoutId}`); // Navigate to the exercises page
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center mt-5">Edit Workout</h1>
      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}
      <div className="mt-6 space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Workout Name:</label>
          <input
            type="text"
            value={workout.name}
            onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
            className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">Public:</label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
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
            <ExercisePanel key={exerciseId} id={exerciseId} workoutId={workout.workoutId} handlePanelClick={handlePanelClick}/>
          ))}
        </div>
        <div className="mt-8 mb-4">
          <button
            onClick={handleUpdateWorkout}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Update Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutEdit;
