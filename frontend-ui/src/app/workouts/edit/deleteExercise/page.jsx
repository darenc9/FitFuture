import React, { Suspense } from 'react';
import DeleteExercisePage from '../../../../components/workouts/DeleteExercisePage';

const DeleteExercisePageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeleteExercisePage />
    </Suspense>
  );
};

export default DeleteExercisePageWrapper;
