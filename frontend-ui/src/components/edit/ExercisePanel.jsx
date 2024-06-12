import React from 'react';
import { useAtom } from 'jotai';
import { getEditExerciseAtom } from '../../../utility/editExerciseAtom';

const ExercisePanel = ({ id }) => {
    const exerciseAtom = getEditExerciseAtom(id);
    const [exercise] = useAtom(exerciseAtom);

    const getImage = (id) => {
        return `/exercises/${id}/0.jpg`;
    };

    return (
        <div className="flex items-center p-4 border rounded-md shadow-md bg-white mb-4">
            <img
                src={getImage(exercise.id)}
                alt={exercise.name}
                className="w-16 h-16 rounded mr-4"
            />
            <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold">{exercise.name}</h3>
                <p className="text-sm">{exercise.sets}x - {exercise.reps} reps</p>
            </div>
        </div>
    );
};

export default ExercisePanel;
