import { atom } from 'jotai';

// Atom to store workout name and list of exercise IDs
export const workoutAtom = atom({
  name: '', // workout name
  exerciseIds: [] // generated ids
});

// Map to store exercise atoms
const exerciseAtoms = new Map();

export const getExerciseAtom = (id) => {
  if (!exerciseAtoms.has(id)) {
    exerciseAtoms.set(
      id,
      atom({
        id,
        name: '', // exercise name
        sets: 0,
        reps: 0
      })
    );
  }
  return exerciseAtoms.get(id);
};

getExerciseAtom.clearExerciseAtoms = () => {
  exerciseAtoms.clear();
};
