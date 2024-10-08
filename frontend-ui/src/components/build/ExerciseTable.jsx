import React from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { PlusIcon } from "@heroicons/react/24/solid";
import { workoutAtom } from "../../../utility/exerciseAtom";
import { editWorkoutAtom } from "../../../utility/editExerciseAtom";

const ExerciseTable = ({ exercises, from, workoutId }) => {
  const router = useRouter();
  const [workout] = useAtom(workoutAtom);
  const [editWorkout] = useAtom(editWorkoutAtom);

  const handleAddExercise = (exercise) => {
    const newExerciseId = exercise.id;
    if (from == 'build'){
      if (workout.exerciseIds.includes(newExerciseId)) {
        alert('Exercise is already added to the workout.');
        return;
      }
      const exerciseName = encodeURIComponent(exercise.name);
      router.push(`/build/exerciseWorkout?id=${newExerciseId}&name=${exerciseName}&from=${from}`);

    } else if (from == 'edit'){
      if (editWorkout.exerciseIds.includes(newExerciseId)) {
        alert('Exercise is already in the workout.');
        return;
      }
      const exerciseName = encodeURIComponent(exercise.name);
      router.push(`/build/exerciseWorkout?id=${newExerciseId}&name=${exerciseName}&from=${from}&workoutId=${workoutId}`);
    }

  };

  const handleExerciseClick = (exerciseId) => {
    router.push(`/exercises/${encodeURIComponent(exerciseId)}`);
  };
  

  return (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="w-1/5 text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
          <th className="w-1/5 text-left py-3 px-4 uppercase font-semibold text-sm hidden md:table-cell">Force</th>
          <th className="w-1/5 text-left py-3 px-4 uppercase font-semibold text-sm hidden md:table-cell">Level</th>
          <th className="w-1/5 text-left py-3 px-4 uppercase font-semibold text-sm hidden md:table-cell">Mechanic</th>
          <th className="w-1/5 text-left py-3 px-4 uppercase font-semibold text-sm hidden md:table-cell">Equipment</th>
          <th className="w-1/5 text-left py-3 px-4 uppercase font-semibold text-sm">Primary Muscle Group</th>
          <th className="w-1/5 text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {exercises.map((exercise) => (
          <tr key={exercise.id} className="border-t">
            <td className="w-1/5 text-left py-3 px-4">
            <a
                onClick={() => handleExerciseClick(exercise.id)}
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
              >
                {exercise.name}
              </a>
            </td>
            <td className="w-1/5 text-left py-3 px-4 hidden md:table-cell">{exercise.force}</td>
            <td className="w-1/5 text-left py-3 px-4 hidden md:table-cell">{exercise.level}</td>
            <td className="w-1/5 text-left py-3 px-4 hidden md:table-cell">{exercise.mechanic}</td>
            <td className="w-1/5 text-left py-3 px-4 hidden md:table-cell">{exercise.equipment}</td>
            <td className="w-1/5 text-left py-3 px-4">{exercise.primaryMuscles.join(', ')}</td>
            <td className="w-1/5 text-left py-3 px-4">
              <button
                onClick={() => handleAddExercise(exercise)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-1" />
                <span className="hidden md:inline">Add</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExerciseTable;
