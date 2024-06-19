// src/components/exercises/ExerciseTable.jsx
import React from "react";
import Link from 'next/link';

const ExerciseTable = ({ exercises }) => {

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
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {exercises.map((exercise) => (
          <tr key={exercise.id} >
            <td className="w-1/5 text-left py-3 px-4">
              <Link href={`/exercises/${encodeURIComponent(exercise.id)}`}>
                {exercise.name}
              </Link>
            </td>
            <td className="w-1/5 text-left py-3 px-4 hidden md:table-cell" >{exercise.force}</td>
            <td className="w-1/5 text-left py-3 px-4 hidden md:table-cell" >{exercise.level}</td>
            <td className="w-1/5 text-left py-3 px-4 hidden md:table-cell" >{exercise.mechanic}</td>
            <td className="w-1/5 text-left py-3 px-4 hidden md:table-cell" >{exercise.equipment}</td>
            <td className="w-1/5 text-left py-3 px-4" >{exercise.primaryMuscles.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExerciseTable;
