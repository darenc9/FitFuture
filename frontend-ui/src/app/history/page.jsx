"use client"
import { PlusIcon } from '@heroicons/react/24/solid';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handleMakeNewHistory = async () => {
  const data = {
    userId: 'devTester', 
    workoutExerciseId: '664b993747d3cc9934f7eb87',
    exerciseName: 'test exercise',
    category: 'strength',
    date: new Date(), 
    reps: 10,
    sets: 3,
    weight: 15,     // in lbs
    duration: 0,   // in sec
  }
  try {
    const res = await fetch(`${API_URL}/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error('Failed to create new history with given data');
    }
    const resData = await res.json();
    return resData;
  } catch (error) {
    console.error('Error creating new history: ', error);
    return null;
  }
};

const HistoryPage = () => {
  return (
    <div className="container mx-auto px-4 h-[calc(100vh-80px)]">
      <h1 className="font-bold">History Testing Page</h1>
      <button type="button" className="bg-blue-500 text-white p-2 rounded" onClick={() => handleMakeNewHistory()}>
        <PlusIcon className="size-6"/>
      </button>
    </div>
  )
};

export default HistoryPage;
