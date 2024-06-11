import { atom } from 'jotai';

// Atom to store workout name, list of exercise IDs, and public/private status
export const workoutAtom = atom({
  name: '', // workout name
  exerciseIds: [], // generated ids
  isPublic: false // public/private status
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
