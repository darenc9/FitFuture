import React, { Suspense } from 'react';
import ResetAtomsPage from '../../../../../components/workouts/ResetAtomsPage';

const ResetAtomsPageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetAtomsPage />
    </Suspense>
  );
};

export default ResetAtomsPageWrapper;
