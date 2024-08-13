"use client"
import { GetToken } from '@/components/AWS/GetToken';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const HistoryPage = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  
  const [historyData, setHistoryData] = useState({
    userId: 'devTester', 
    workoutExerciseId: '664baf292c0b8b98fbafe9b5',
    exerciseName: 'Upright Barbell Row',
    category: 'strength',
    date: new Date(), 
    reps: 0,
    sets: 0,
    weight: 0,     // in lbs
    duration: 0,   // in sec
  });
  
  const handleMakeNewHistory = async (data) => {
    try {
      const authToken = await GetToken();
      const res = await fetch(`${API_URL}/history`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${authToken}`,
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
  
  const handleRepChange = (event) => {
    if (parseInt(event.target.value)) {
      setHistoryData(prevState => ({
        ...prevState,
        reps: parseInt(event.target.value)
      }));
    }
  };
  
  const handleSetChange = (event) => {
    if (parseInt(event.target.value)) {
      setHistoryData(prevState => ({
        ...prevState,
        sets: parseInt(event.target.value)
      }));
    }
  };
  
  const handleWeightChange = (event) => {
    if (parseInt(event.target.value)) {
      setHistoryData(prevState => ({
        ...prevState,
        weight: parseInt(event.target.value)
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 h-[calc(100vh-80px)]">
      <h1 className="text-center text-lg">History Testing Page</h1>
      <hr />
      <div className=''>
        <h1 className='text-center text-xl font-bold'>{historyData.exerciseName}</h1>
        <div className='flex flex-col px-2 py-4'>
          <p>Enter the number of reps and sets you did, and enter the weight you used:</p>
          <div className='flex flex-col gap-4 mt-4'>
            <div className='flex justify-between'>
              <label className='font-semibold'>Reps:</label>
              <input type="number" name="reps" id="reps" value={historyData.reps} 
                  onChange={handleRepChange}/>
            </div>
            <div className='flex justify-between'>
              <label className='font-semibold'>Sets:</label>
              <input type="number" name="sets" id="sets" value={historyData.sets}
                  onChange={handleSetChange}/>
            </div>
            <div className='flex justify-between'>
              <label className='font-semibold'>Weight:</label>
              <input type="number" name="sets" id="sets" value={historyData.weight}
                  onChange={handleWeightChange}/>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="bg-blue-500 text-white p-2 rounded" onClick={() => {
        handleMakeNewHistory(historyData);
        router.push(`/profile`);
        }}>
        <PlusIcon className="size-6"/>
      </button>
    </div>
  )
};

export default HistoryPage;
