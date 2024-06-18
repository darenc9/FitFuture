import React, { Suspense } from 'react';
import WorkoutExercise from '../../../components/build/WorkoutExercise';

const WorkoutExerciseWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkoutExercise />
    </Suspense>
  );
};

export default WorkoutExerciseWrapper;
