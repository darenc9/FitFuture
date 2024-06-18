import React, { Suspense } from 'react';
import UpdateWorkoutPage from '../../../../components/workouts/UpdateWorkoutPage';

const UpdateWorkoutPageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdateWorkoutPage />
    </Suspense>
  );
};

export default UpdateWorkoutPageWrapper;
