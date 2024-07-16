// page to view a specific history entry's details
"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GetToken } from "../AWS/GetToken";

const HistoryDetails = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [historyDetails, setHistoryDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const fetchHistoryData = async (id) => {
    try {
      const authToken = await GetToken();
      const res = await fetch(`${API_URL}/history/${id}`, {headers: {'Authorization': `Bearer ${authToken}`}});
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

  useEffect(() => {
    const fetchData = async () => {
      const historyData = await fetchHistoryData(searchParams.get('id'));
      console.log(`fetched history data is: `, historyData);
      setHistoryDetails(historyData);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return (
    <div className="container mx-auto px-4 h-[calc(100vh-80px)]">
      {loading ? (
        <p>Loading history details...</p>
      ) : (
      <div className="mx-auto p-4">
        <h1 className="text-xl font-bold text-center">{historyDetails.exerciseName}</h1>
        <h3 className="text-gray-600 text-center font-semibold m-2">{new Date(historyDetails.date).toISOString().split('T')[0]}</h3>
        <div className="flex flex-col gap-2 my-4">
          {historyDetails.info.map((entry, index) => (
            <div key={index} className={`flex items-center p-4 border rounded-lg shadow-md ${entry.completed ? 'bg-green-200' : 'bg-yellow-200'}`}>
              <div className="ml-4">
                {entry.weight && <p><b>Weight:</b> {entry.weight}</p>}
                {entry.reps && <p><b>Reps:</b> {entry.reps}</p>}
                {entry.duration && <p><b>Duration:</b> {Math.floor(entry.duration / 60)} min {Math.floor(entry.duration % 60)} sec</p>}
              </div>
              <div className="ml-auto">
                <h3>{entry.completed ? 'Complete' : 'Incomplete'}</h3>
              </div>
            </div>
          ))}
        </div>
        {historyDetails.notes && <p><b>Notes:</b> {historyDetails.notes}</p>}
      </div>
      )}
    </div>
  )
};

export default HistoryDetails;
