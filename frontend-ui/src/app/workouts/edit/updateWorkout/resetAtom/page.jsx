"use client";
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useResetEditExerciseAtoms from '../../../../../../utility/useResetEditExerciseAtoms';

//this page is needed to reset the atom after saving to db
const ResetAtomsPage = () => {
  const searchParams = useSearchParams();
  const workoutId = searchParams.get('workoutId');
  const router = useRouter();
  const resetAtoms = useResetEditExerciseAtoms();

  useEffect(() => {
    resetAtoms();
    router.push(`/workouts/${workoutId}`); // Navigate to the desired page after resetting atoms
  }, [resetAtoms, router, workoutId]);

  return null; // Return null to render nothing
};

export default ResetAtomsPage;
