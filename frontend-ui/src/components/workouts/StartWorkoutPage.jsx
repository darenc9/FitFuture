'use client';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { GetToken } from '@/components/AWS/GetToken';
import { useAuthenticator } from '@aws-amplify/ui-react';

const StartWorkoutPage = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const workoutId = searchParams.get('id'); // Access the query parameter

  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sets, setSets] = useState([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(120);
  const [recentHistory, setRecentHistory] = useState([]);

  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    // Fetch exercises based on workoutId
    const fetchExercises = async () => {
      try {
        const authToken = await GetToken();
        const res = await fetch(`${API_URL}/workout/${workoutId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        console.log('Fetched exercises:', data);
        setExercises(data);
        setCurrentExerciseIndex(0);
        setSets(Array(data[0].sets).fill({ weight: '', reps: '', completed: false }));
        setIsRunning(true); // Start the timer
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    if (workoutId) {
      fetchExercises();
    }
  }, [workoutId]);

  useEffect(() => {
    // Fetch recent history for the current exercise
    const fetchRecentHistory = async () => {
      try {
        const authToken = await GetToken();
        const currentExercise = exercises[currentExerciseIndex];
        if (currentExercise) {
          const res = await fetch(`${API_URL}/workout/history/recent?userId=${user.username}&exerciseId=${currentExercise.exerciseId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          });
          const data = await res.json();
          setRecentHistory(data);
        }
      } catch (error) {
        console.error('Error fetching recent history:', error);
      }
    };

    if (exercises.length > 0 && user) {
      fetchRecentHistory();
    }
  }, [exercises, currentExerciseIndex, user]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    let restTimer;
    if (isResting && restTime > 0) {
      restTimer = setInterval(() => {
        setRestTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (isResting && restTime === 0) {
      setIsResting(false);
      setRestTime(120); // Reset rest time for the next rest period
    }
    return () => clearInterval(restTimer);
  }, [isResting, restTime]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleInputChange = (field, value) => {
    if (field === 'weight') {
      setWeight(value);
    } else if (field === 'reps') {
      setReps(value);
    }
  };

  const handleCompleteSet = () => {
    let weightValue = parseFloat(weight);
    let repsValue = parseInt(reps, 10);

    if (weight === '' || isNaN(weightValue)) {
      alert('Please enter a valid weight.');
      return;
    }

    if (reps === '' || isNaN(repsValue) || repsValue.toString() !== reps) {
      alert('Please enter a valid number of reps.');
      return;
    }

    const updatedSets = sets.map((set, i) => (
      i === currentSetIndex ? { ...set, weight, reps, completed: true } : set
    ));
    setSets(updatedSets);
    setCurrentSetIndex(currentSetIndex + 1);
    setWeight('');
    setReps('');

    if (currentSetIndex + 1 >= sets.length) {
      handleNextExercise(updatedSets);
    } else {
      setIsResting(true);
    }
  };

  const handleNextExercise = (completedSets) => {
    const currentExercise = exercises[currentExerciseIndex];
    const completedExercise = {
      ...currentExercise,
      sets: completedSets,
      notes,
    };

    if (exercises.length === 1) {
      // If there's only one exercise, add it to completedExercises and mark workout complete
      const allCompletedExercises = [completedExercise];
      setCompletedExercises(allCompletedExercises);
      console.log("Final Completed workout (one exercise):", allCompletedExercises);
      setWorkoutComplete(true);
      setIsRunning(false);
      handleFinishWorkout(allCompletedExercises); // Call handleFinishWorkout
    } else {
      // For multiple exercises
      const allCompletedExercises = [...completedExercises, completedExercise];
      setCompletedExercises(allCompletedExercises);
      console.log('Completed Exercises:', allCompletedExercises);

      if (currentExerciseIndex + 1 < exercises.length) {
        const nextExerciseIndex = currentExerciseIndex + 1;
        setCurrentExerciseIndex(nextExerciseIndex);
        setSets(Array(exercises[nextExerciseIndex].sets).fill({ weight: '', reps: '', completed: false }));
        setCurrentSetIndex(0);
        setShowNotes(false);
        setNotes('');
      } else {
        console.log("Final Completed workout:", allCompletedExercises);
        setWorkoutComplete(true);
        setIsRunning(false);
        handleFinishWorkout(allCompletedExercises); // Call handleFinishWorkout
      }
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTime(120); // Reset rest time for the next rest period
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };

  const handleFinishWorkout = async (completedExercises) => {
    const workoutData = {
      workoutId,
      totalTime: time,
      exercises: completedExercises,
      userId: user
    };
    console.log("Workout data prepared for POST request:", JSON.stringify(workoutData, null, 2));
    try {
      const authToken = await GetToken();
      const response = await fetch(`${API_URL}/workout/finish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(workoutData),
      });

      if (response.ok) {
        console.log('Workout history saved successfully');
      } else {
        console.error('Failed to save workout history:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving workout history: ', error);
    }
  };

  const addSet = () => {
    setSets([...sets, { weight: '', reps: '', completed: false }]);
  };

  const removeLastSet = () => {
    if (sets.length > 0) {
      setSets(sets.slice(0, -1));
      if (currentSetIndex > sets.length - 1) {
        setCurrentSetIndex(sets.length - 1);
      }
    }
  };

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 pt-0">
      {workoutComplete ? (
        <div className="bg-white shadow-md rounded-lg p-4 mt-0 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Workout Summary</h2>
          <p>Total Time: {formatTime(time)}</p>
          <ul className="mb-4">
            {completedExercises.map((exercise, index) => (
              <li key={index} className="mb-2">
                <strong>{exercise.name}</strong>
                <ul className="ml-4">
                  {exercise.sets.map((set, i) => (
                    <li key={i}>
                      Set {i + 1}: {set.weight} Lb x {set.reps} reps
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <div className="flex w-full justify-center p-4 bg-white shadow-md mb-4">
            <div className="flex space-x-8 items-center">
              <div>{formatTime(time)}</div>
            </div>
          </div>
          {currentExercise && (
            <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-2xl">
              <h2 className="text-2xl font-semibold mb-4">{currentExercise.name}</h2>
              <p className="text-gray-600 mb-4">{currentExercise.sets} sets</p>
              {sets.map((set, index) => (
                <div key={index} className="mb-4 flex items-center">
                  <div className="flex-1">
                    {set.completed ? (
                      <p className="text-lg">Set {index + 1}: {set.weight} Lb x {set.reps} reps</p>
                    ) : (
                      <p className="text-lg text-gray-400">Set {index + 1}: </p>
                    )}
                  </div>
                  {set.completed && (
                    <div className="ml-4 px-4 py-2 rounded-lg bg-green-500 text-white">
                      ✔
                    </div>
                  )}
                </div>
              ))}
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={addSet}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Add Set
                </button>
                <button
                  onClick={removeLastSet}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  disabled={sets.length === 0}
                >
                  Remove Last Set
                </button>
              </div>
              {isResting && (
                <div className="mt-4 bg-yellow-100 p-4 rounded-lg shadow-md w-full text-center">
                  <p className="text-xl mb-4">Rest Time: {formatTime(restTime)}</p>
                  <button
                    onClick={skipRest}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                  >
                    Skip Rest
                  </button>
                </div>
              )}
              {showNotes && (
                <div className="mt-4">
                  <textarea
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
              )}
              {recentHistory.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2">Recent History</h3>
                  {recentHistory.map((entry, index) => (
                    <div key={index} className="bg-gray-200 p-4 mb-2 rounded-lg">
                      <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      {entry.info.map((info, i) => (
                        <p key={i}>Set {i + 1}: {info.reps} reps x {info.weight} Lbs </p>
                      ))}
                      <p><strong>Notes:</strong> {entry.notes}</p>
                    </div>
                  ))}
                  <div className="h-32"></div> {/* Increased Buffer */}
                </div>
              )}
            </div>
          )}
          {currentSetIndex < sets.length && !isResting && (
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex flex-col items-center">
              <div className="flex w-full mb-4">
                <input
                  type="text"
                  placeholder="Weight (Lb)"
                  value={weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="border rounded p-2 w-1/2 mr-2"
                />
                <input
                  type="text"
                  placeholder="Repetitions"
                  value={reps}
                  onChange={(e) => handleInputChange('reps', e.target.value)}
                  className="border rounded p-2 w-1/2"
                />
              </div>
              <div className="flex w-full justify-between">
                <button
                  onClick={handleCompleteSet}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg w-1/2 mr-2"
                >
                  Complete
                </button>
                <button
                  onClick={toggleNotes}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg w-1/2"
                >
                  Notes
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StartWorkoutPage;
