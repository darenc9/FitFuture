import { atom } from 'jotai';

// Atom to store workout name, list of exercise IDs, and public/private status
export const editWorkoutAtom = atom({
  workoutId: '',
  name: '', // workout name
  exerciseIds: [], // generated ids
  public: false // public/private status
});

// Map to store exercise atoms
const editExerciseAtoms = new Map();

export const getEditExerciseAtom = (id) => {
  if (!editExerciseAtoms.has(id)) {
    editExerciseAtoms.set(
      id, //exerciseId
      atom({
        id,
        workoutExerciseId, //for updating in db
        name: '', // exercise name
        sets: 0,
        reps: 0
      })
    );
  }
  return editExerciseAtoms.get(id);
};

getEditExerciseAtom.clearExerciseAtoms = () => {
  editExerciseAtoms.clear();
};

export const removeExerciseAtom = (id) => {
  editExerciseAtoms.delete(id);
};

// New function to populate the map with a list of exercises
export const setEditExerciseAtoms = (exercises) => {
  exercises.forEach(exercise => {
    editExerciseAtoms.set(
      exercise.exerciseId,
      atom({
        id: exercise.exerciseId,
        workoutExerciseId: exercise.workoutExerciseId,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        notes: exercise.notes,
        weight: exercise.weight
      })
    );
  });
};
