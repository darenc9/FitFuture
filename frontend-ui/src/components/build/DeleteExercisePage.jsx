"use client"
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { workoutAtom, removeExerciseAtom } from '../../../utility/exerciseAtom';

const DeleteExercisePage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const [workout, setWorkout] = useAtom(workoutAtom);

  useEffect(() => {
    if (id) {
      setWorkout((prevWorkout) => ({
        ...prevWorkout,
        exerciseIds: prevWorkout.exerciseIds.filter(exerciseId => exerciseId !== id),
      }));
      removeExerciseAtom(id);
      router.push('/build');
    }
  }, [id, setWorkout, router]);

  return null; // Don't return anything for display
};

export default DeleteExercisePage;
