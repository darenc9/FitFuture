'use client';
import { useSearchParams } from 'next/navigation';

const StartWorkoutPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Access the query parameter
  
  return (
    <div>
      <p>Start workout {id}</p>
    </div>
  );
};

export default StartWorkoutPage;
