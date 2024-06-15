"use client"
//build/exercises/[exercisename]
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import ExerciseDetails from '@/components/exercises/ExerciseDetails'


export default function Page( { params }) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchExerciseData = async () => {
        try {
          const response = await fetch(`${API_URL}/exercise/${params.exercisename}`);
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
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!exercise) return <p>No exercise data available</p>;
  
    return (
      <section>
        <ExerciseDetails exercise={exercise} />
      </section>
    );
  }