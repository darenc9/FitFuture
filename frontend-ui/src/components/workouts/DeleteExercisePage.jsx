'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // Import from 'next/navigation'
import { useAtom } from 'jotai';
import { editWorkoutAtom, removeExerciseAtom } from '../../../utility/editExerciseAtom'; // Import removeExerciseAtom

const DeleteExercisePage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Access the query parameter
  const workoutId = searchParams.get('wId');
  const router = useRouter();
  const [workout, setWorkout] = useAtom(editWorkoutAtom);

  useEffect(() => {
    if (id) {
      setWorkout((prevWorkout) => ({
        ...prevWorkout,
        exerciseIds: prevWorkout.exerciseIds.filter(exerciseId => exerciseId !== id),
      }));
      removeExerciseAtom(id); // Remove the exercise atom
      router.push(`/workouts/edit/${workoutId}`); // Navigate back to the previous page
    }
  }, [id, setWorkout, router]);

  return null; // Don't return a page
};

export default DeleteExercisePage;
