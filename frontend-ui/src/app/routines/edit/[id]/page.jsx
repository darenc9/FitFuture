"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RoutineEdit from '@/components/edit/RoutineEdit';
import { GetToken } from '@/components/AWS/GetToken';

export default function EditRoutinePage() {
  const router = useRouter();
  const { id } = useParams();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [routineData, setRoutineData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutineData = async () => {
      try {
        // Fetch routine data using the id parameter
        const authToken = await GetToken();
        const res = await fetch(`${API_URL}/routine/${id}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          });
        if (!res.ok) {
          throw new Error('Failed to fetch routine data');
        }
        const data = await res.json();
        setRoutineData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching routine data:', error);
      }
    };

    if (id) {
      fetchRoutineData();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!routineData) {
    return <p>Routine not found</p>; // Handle scenario where routine with given id does not exist
  }

  return <RoutineEdit routine={routineData} />;
}
