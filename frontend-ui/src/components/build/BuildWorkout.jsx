import React from 'react';
import { useAtom } from 'jotai';
import { workoutAtom, getExerciseAtom } from '../../../exerciseAtom';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon } from '@heroicons/react/24/solid';

const WorkoutBuilder = () => {
  const [workout, setWorkout] = useAtom(workoutAtom);
  const router = useRouter();

  const handleAddExercise = () => {
    const newExerciseId = uuidv4(); // Generate a unique ID for the new exercise
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      exerciseIds: [...prevWorkout.exerciseIds, newExerciseId] // Add the new exercise ID to the workout
    }));
    router.push(`/build/exercises`); // Navigate to the exercise details page
  };

  const handleSaveWorkout = () => {
    // Implement save workout logic here
    console.log('Workout saved:', workout);
  };

  return (
    <div className="container mx-auto p-4">
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
};

const ExercisePanel = ({ id }) => {
  const [exercise] = useAtom(getExerciseAtom(id)); // Access the exercise atom using its unique ID

  return (
    <div className="p-4 border rounded-md">
      <p className="text-lg font-medium">{exercise.name}</p>
    </div>
  );
};

export default WorkoutBuilder;
