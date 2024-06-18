import React, { Suspense } from 'react';
import DeleteExercisePage from '../../../components/build/DeleteExercisePage'; // Adjust the import path

const DeleteExercisePageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeleteExercisePage />
    </Suspense>
  );
};

export default DeleteExercisePageWrapper;
