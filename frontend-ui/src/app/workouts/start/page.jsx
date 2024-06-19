import React, { Suspense } from 'react';
import StartWorkoutPage from '../../../components/workouts/StartWorkoutPage';

const StartWorkoutPageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StartWorkoutPage />
    </Suspense>
  );
};

export default StartWorkoutPageWrapper;
