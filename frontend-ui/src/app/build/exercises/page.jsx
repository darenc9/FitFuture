import React, { Suspense } from 'react';
import ExercisesPage from '../../../components/build/ExercisesPage';

const ExercisesPageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExercisesPage />
    </Suspense>
  );
};

export default ExercisesPageWrapper;
