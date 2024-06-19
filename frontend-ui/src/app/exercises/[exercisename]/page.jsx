"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import ExerciseDetails from '@/components/exercises/ExerciseDetails'
import { GetToken } from '@/components/AWS/GetToken';

export default function Page( { params }) {
    const router = useRouter();
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
  
    useEffect(() => {
      const fetchExerciseData = async () => {
        try {
          const authToken = await GetToken();
          const response = await fetch(`${process.env.API_URL}/exercise/${params.exercisename}`
            , {headers: {'Authorization': `Bearer ${authToken}`}}
          );
          if (!response.ok) {
            throw new Error('Failed to fetch exercise data');
          }
          const data = await response.json();
          setExercise(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching exercise data:', error);
          setError(error.message);
          setLoading(false);
        }
      };
      fetchExerciseData();
    }, [params.exercisename]);

    const handleGoBack = () => {
      router.back(); // Navigate back using Next.js router
    };
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!exercise) return <p>No exercise data available</p>;
  
    return (
      <section>
        <button onClick={handleGoBack}>Go Back</button>
        <ExerciseDetails exercise={exercise} />
      </section>
    );
  }