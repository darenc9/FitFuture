"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { profileIdAtom } from '../../../store';
import ExercisePanel from './ExercisePanel';
import { editWorkoutAtom, setEditExerciseAtoms } from '../../../utility/editExerciseAtom';
import { useAtomValue } from 'jotai';

const WorkoutEdit = () => {
  const { id } = useParams();
  const [currentUser] = useAtom(profileIdAtom);
  const [workout, setWorkout] = useAtom(editWorkoutAtom);
  const router = useRouter();
  const currentWorkout = useAtomValue(editWorkoutAtom);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only fetch if currentWorkout isn't already populated
        if (!currentWorkout.workoutId) {
          console.log("fetching data");
          const res = await fetch(`http://localhost:8080/workout/${id}`);
          if (!res.ok) {
            throw new Error(`Failed to fetch workout with id: ${id}`);
          }
          const exerciseData = await res.json();

          const res2 = await fetch(`http://localhost:8080/workouts/${id}`);
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

  const handleSaveWorkout = async () => {
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

  const handleCheckboxChange = (e) => {
    setWorkout({ ...workout, public: e.target.checked });
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center mt-5">Edit Workout</h1>
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
        <div className="flex items-center mb-4">
          <label className="block text-sm font-medium text-gray-700 mr-2">Public:</label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={handleCheckboxChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div className="space-y-4">
          {workout.exerciseIds.map((exerciseId) => (
            <ExercisePanel key={exerciseId} id={exerciseId} workoutId={workout.workoutId} />
          ))}
        </div>
        <div className="mt-8 mb-4">
          <button
            onClick={handleSaveWorkout}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutEdit;
