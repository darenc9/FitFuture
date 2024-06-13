import { useSetAtom } from 'jotai';
import { editWorkoutAtom, getEditExerciseAtom } from './editExerciseAtom';

const useResetEditExerciseAtoms = () => {
  const setWorkout = useSetAtom(editWorkoutAtom);

  const resetAtoms = () => {
    setWorkout({ name: '', exerciseIds: [] });

    // Clear the exercise atoms map
    getEditExerciseAtom.clearExerciseAtoms();
  };

  return resetAtoms;
};

export default useResetEditExerciseAtoms;
