import React from 'react';
import { useAtom } from 'jotai';
import { getExerciseAtom } from '../../../utility/exerciseAtom';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

const ExercisePanel = ({ id, handlePanelClick }) => {
  const [exercise] = useAtom(getExerciseAtom(id));
  const router = useRouter();

  const getImage = (id) => {
    // Assuming the images are stored locally in the public/images directory
    // Replace this logic with the actual path to your images
    return `/exercises/${id}/0.jpg`;
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    router.push(`/build/deleteExercise?id=${id}`);
  };

  return (
    <div className="flex items-center p-4 border rounded-md shadow-md bg-white mb-4"
      onClick={() => handlePanelClick(exercise)}>
      <img
        src={getImage(id)}
        alt={exercise.name}
        className="w-16 h-16 rounded mr-4"
      />
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-bold">{exercise.name}</h3>
        <p className="text-sm">{exercise.sets}x - {exercise.reps} reps</p>
      </div>
      <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ExercisePanel;
