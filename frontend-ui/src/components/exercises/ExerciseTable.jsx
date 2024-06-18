// src/components/exercises/ExerciseTable.jsx
import React from "react";
import Link from 'next/link';
import { useAtom } from 'jotai';
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa';
import { selectedExercisesAtom } from '@/atoms/exercisesPageAtoms';

const ExerciseTable = ({ exercises, selectedExercises, setSelectedExercises}) => {

  const handleSelectExercise = (exercise) => {
    setSelectedExercises((prevSelected) => {
      if (prevSelected.includes(exercise)) {
        return prevSelected.filter((e) => e !== exercise);
      } else {
        return [...prevSelected, exercise];
      }
    });
  };

  const isSelected = (exercise) => {
    return selectedExercises.some(e => e.id === exercise.id)
  };

  const handleSendButtonClick = () => {
    // Implement send button functionality here
    console.log("Send button clicked");
    // You can perform any action here, such as submitting selected exercises
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
          <th className="w-1/5 text-left py-3 px-4 uppercase font-semibold text-sm"></th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {exercises.map((exercise) => (
          <tr key={exercise.id} className={`${isSelected(exercise) ? 'bg-blue-100' : ''}`} >
            <td className="w-1/5 text-left py-3 px-4">
              <Link href={`/exercises/${encodeURIComponent(exercise.id)}`}>
                {exercise.name}
              </Link>
            </td>
            <td className="w-1/5 text-left py-3 px-4 hidden md:table-cell" onClick={() => handleSelectExercise(exercise)}>{exercise.force}</td>
            <td className="w-1/5 text-left py-3 px-4 hidden md:table-cell" onClick={() => handleSelectExercise(exercise)}>{exercise.level}</td>
            <td className="w-1/5 text-left py-3 px-4 hidden md:table-cell" onClick={() => handleSelectExercise(exercise)}>{exercise.mechanic}</td>
            <td className="w-1/5 text-left py-3 px-4 hidden md:table-cell" onClick={() => handleSelectExercise(exercise)}>{exercise.equipment}</td>
            <td className="w-1/5 text-left py-3 px-4"  onClick={() => handleSelectExercise(exercise)}>{exercise.primaryMuscles.join(', ')}</td>
            <td className="py-2 text-center cursor-pointer" onClick={() => handleSelectExercise(exercise)}>
              {isSelected(exercise) ? <FaCheckSquare className="text-blue-500 icon" /> : <FaRegSquare className="text-gray-500 icon" />}
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan="7" className="text-right py-3 px-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleSendButtonClick}>
              Confirm
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ExerciseTable;
