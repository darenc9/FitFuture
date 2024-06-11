import React from 'react';
import { useAtom } from 'jotai';
import { getExerciseAtom } from '../../../utility/exerciseAtom';

const ExercisePanel = ({ id }) => {
  const [exercise] = useAtom(getExerciseAtom(id));

  const getImage = (id) => {
    // Assuming the images are stored locally in the public/images directory
    // Replace this logic with the actual path to your images
    return `/exercises/${id}/0.jpg`;
  };

  return (
    <div className="flex items-center p-4 border rounded-md shadow-md bg-white mb-4">
      <img
        src={getImage(id)}
        alt={exercise.name}
        className="w-16 h-16 rounded mr-4"
      />
      <div className="ml-4">
        <h3 className="text-lg font-bold">{exercise.name}</h3>
        <p className="text-sm">{exercise.sets}x - {exercise.reps} reps</p>
      </div>
    </div>
  );
};

export default ExercisePanel;
