import React, { Suspense } from 'react';
import ResetAtomsPage from '../../../../../components/workouts/ResetAtomPage';

const ResetAtomsPageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetAtomsPage />
    </Suspense>
  );
};

export default ResetAtomsPageWrapper;
