import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { getEditExerciseAtom } from '../utility/editExerciseAtom';

const useExerciseDetails = (exerciseIds) => {
  const [exerciseDetails, setExerciseDetails] = useState([]);

  useEffect(() => {
    const fetchExerciseDetails = () => {
      const details = exerciseIds.map(id => {
        const exerciseAtom = getEditExerciseAtom(id);
        return { ...useAtomValue(exerciseAtom), id };
      });
      setExerciseDetails(details);
    };

    fetchExerciseDetails();
  }, [exerciseIds]);

  return exerciseDetails;
};

export default useExerciseDetails;
