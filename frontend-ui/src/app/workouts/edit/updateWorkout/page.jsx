"use client";
import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { profileIdAtom } from '../../../../../store';
import { editWorkoutAtom, getEditExerciseAtom } from '../../../../../utility/editExerciseAtom';
import { useAtomValue } from 'jotai';

const UpdateWorkoutPage = () => {
  const searchParams = useSearchParams();
  const workoutId = searchParams.get('workoutId');
  const router = useRouter();
  const [currentUser] = useAtom(profileIdAtom);
  const [workout] = useAtom(editWorkoutAtom);
  
  const exerciseDetails = workout.exerciseIds.map(id => {
    const exerciseAtom = getEditExerciseAtom(id);
    return useAtomValue(exerciseAtom);
  });

  // Use a ref to ensure the effect runs only once
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;

    const saveWorkout = async () => {
      const payload = {
        workout: { ...workout, user: currentUser },
        exercises: exerciseDetails.map((exercise, index) => ({
          ...exercise,
          id: workout.exerciseIds[index],
        })),
      };

      try {
        const response = await fetch('http://localhost:8080/workout', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log('Workout saved successfully');
          router.push(`/workouts/edit/updateWorkout/resetAtom?workoutId=${payload.workout.workoutId}`);
        } else {
          console.error('Failed to save workout:', response.statusText);
          router.push(`/workouts/edit/${workoutId}`);
        }
      } catch (error) {
        console.error('Error saving workout:', error);
        router.push(`/workouts/edit/${workoutId}`);
      }
    };

    saveWorkout();
  }, [workout, exerciseDetails, router, workoutId, currentUser]);

  return null;
};

export default UpdateWorkoutPage;
