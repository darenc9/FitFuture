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

    useEffect(() => {
        const fetchData = async () => {
            try {
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
                    name: workoutData.name,
                    exerciseIds: exerciseData.map(ex => ex.exerciseId),
                    public: workoutData.public,
                });

                // Populate exercise atoms
                setEditExerciseAtoms(exerciseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [id, setWorkout]);

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center mt-8">Edit Workout</h1>
            <div className="mt-8 space-y-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Workout Name:</label>
                    <input
                        type="text"
                        value={workout.name}
                        readOnly
                        className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="flex items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700 mr-2">Public:</label>
                    <input
                        type="checkbox"
                        checked={workout.public}
                        readOnly
                        className="form-checkbox h-5 w-5 text-blue-600"
                    />
                </div>
                <div className="space-y-4">
                    {workout.exerciseIds.map((exerciseId) => (
                        <ExercisePanel key={exerciseId} id={exerciseId} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkoutEdit;
