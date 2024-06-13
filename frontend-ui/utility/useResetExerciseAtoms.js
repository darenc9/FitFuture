import { useSetAtom } from 'jotai';
import { workoutAtom, getExerciseAtom } from './exerciseAtom';

const useResetExerciseAtoms = () => {
  const setWorkout = useSetAtom(workoutAtom);

  const resetAtoms = () => {
    // Reset the workout atom
    setWorkout({ name: '', exerciseIds: [] });

    // Clear the exercise atoms map
    getExerciseAtom.clearExerciseAtoms();
  };

  return resetAtoms;
};

export default useResetExerciseAtoms;
