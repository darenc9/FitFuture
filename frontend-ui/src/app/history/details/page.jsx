// page to view a specific history entry's details
"use client"

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const HistoryDetailsPage = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [historyDetails, setHistoryDetails] = useState(null);
  const [intendedEx, setIntendedEx] = useState(null);
  const [loading, setLoading] = useState(true);


  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const fetchHistoryData = async (id) => {
    try {
      console.log(`API_URL is: ${API_URL}`);
      const res = await fetch(`${API_URL}/history/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch history data');
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching history data: ', error);
      return null;
    }
  };

  const fetchWorkoutExerciseData = async (id) => {
    try {
      console.log(`API_URL is: ${API_URL}`);
      const res = await fetch(`${API_URL}/we/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch workoutExercise data');
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching workoutExercise data: ', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const historyData = await fetchHistoryData(searchParams.get('id'));
      console.log(`fetched history data is: `, historyData);
      setHistoryDetails(historyData);
      console.log(`current history details is: `, historyDetails);
      const intendedExerciseData = await fetchWorkoutExerciseData(historyData.workoutExerciseId);
      setIntendedEx(intendedExerciseData);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto px-4 h-[calc(100vh-80px)]">
        {loading ? (
          <p>Loading history details...</p>
        ) : (
        <div>
          <h1 className="font-bold text-center text-xl">{historyDetails.exerciseName}</h1>
          <table className="min-w-full shadow-md rounded-lg mt-3">
            <thead className="bg-gray-800 text-white">
              <tr className="py-2">
                <th className="py-2">Completed</th>
                <th className="py-2">Suggested</th>
              </tr>
            </thead>
            <tbody>
              {intendedEx.reps ? 
              <tr>
                <td className="p-3 text-center">{historyDetails.reps} reps</td>
                <td className="p-3 text-center">{intendedEx.reps} reps</td>
              </tr>
              : null
              }
              {intendedEx.sets ? 
              <tr>
                <td className="p-3 text-center">{historyDetails.sets} sets</td>
                <td className="p-3 text-center">{intendedEx.sets} sets</td>
              </tr>
              : null
              }
              {intendedEx.weight ? 
              <tr>
                <td className="p-3 text-center">{historyDetails.weight} weight</td>
                <td className="p-3 text-center">{intendedEx.weight} weight</td>
              </tr>
              : null
              }
              {intendedEx.duration ?
              <tr>
                <td className="p-3 text-center">{Math.floor(historyDetails.duration / 60)} min {Math.floor(historyDetails.duration % 60)} sec</td>
                <td className="p-3 text-center">{Math.floor(intendedEx.duration / 60)} min {Math.floor(intendedEx.duration % 60)} sec</td>
              </tr>
              : null
              }
            </tbody>
          </table>
        </div>
        )}
      </div>
    </Suspense>
  )
};

export default HistoryDetailsPage;
