"use client"
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // Import from 'next/navigation'
import { useAtom } from 'jotai';
import { workoutAtom, removeExerciseAtom } from '../../../../utility/exerciseAtom'; // Import removeExerciseAtom

const DeleteExercisePage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Access the query parameter
  const router = useRouter();
  const [workout, setWorkout] = useAtom(workoutAtom);

  useEffect(() => {
    if (id) {
      setWorkout((prevWorkout) => ({
        ...prevWorkout,
        exerciseIds: prevWorkout.exerciseIds.filter(exerciseId => exerciseId !== id),
      }));
      removeExerciseAtom(id); // Remove the exercise atom
      router.push('/build'); // Navigate back to the previous page
    }
  }, [id, setWorkout, router]);

  return (
    <div>
      <h1>Deleting exercise...</h1>
    </div>
  );
};

export default DeleteExercisePage;
