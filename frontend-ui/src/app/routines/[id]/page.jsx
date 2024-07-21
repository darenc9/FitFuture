"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { GetToken } from '@/components/AWS/GetToken';
import WorkoutList from '@/components/routine/WorkoutList'; 

const RoutineDetails = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const { id } = useParams(); // Access the dynamic route parameter
    const [routineName, setRoutineName] = useState('');
    const [workoutDetails, setWorkoutDetails] = useState([]); // State to store detailed workout information
    const [showEditButton, setShowEditButton] = useState(false);
    const { user } = useAuthenticator((context) => [context.user]);
    const router = useRouter();
    const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
    const [completedWorkouts, setCompletedWorkouts] = useState([]);
    const [routineHistoryId, setRoutineHistoryId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (user && user.username) {
                const currentUser = user.username;
                try {
                    const authToken = await GetToken();
                    const res = await fetch(`${API_URL}/routine/${id}`, {
                        headers: { 'Authorization': `Bearer ${authToken}` }
                    });
                    if (!res.ok) {
                        throw new Error(`Failed to fetch routine details for id: ${id}`);
                    }
                    const data = await res.json();
                    setRoutineName(data.routineName);
                    
                    // Fetch detailed information for each workout in the routine
                    const workoutDetailsPromises = data.workoutIds.map(async (workoutId) => {
                        const res = await fetch(`${API_URL}/workouts/${workoutId}`, {
                            headers: { 'Authorization': `Bearer ${authToken}` }
                        });
                        if (!res.ok) {
                            throw new Error(`Failed to fetch workout details for id: ${workoutId}`);
                        }
                        return await res.json();
                    });
                    
                    const detailedWorkouts = await Promise.all(workoutDetailsPromises);
                    setWorkoutDetails(detailedWorkouts);
                    console.log(detailedWorkouts);
    
                    // TODO: Fetch routine history to get completed workouts
                    const historyRes = await fetch(`${API_URL}/routine/start/${currentUser}/${data.routineId}`, {
                         headers: { 'Authorization': `Bearer ${authToken}` }
                    });
                    if (!historyRes.ok) {
                        throw new Error(`Failed to fetch routine history for id: ${id} and user: ${currentUser}`);
                    }
                    const historyData = await historyRes.json();
                    console.log(historyData);
                    
                    const completedWorkouts = historyData.completed || [];
                    setCompletedWorkouts(completedWorkouts);
                    setRoutineHistoryId(historyData.routineHistoryId);
    
                    // Determine the current workout index
                    const nextWorkoutIndex = data.workoutIds.findIndex(workoutId => !completedWorkouts.includes(workoutId));
                    console.log(nextWorkoutIndex);
                    setCurrentWorkoutIndex(nextWorkoutIndex !== -1 ? nextWorkoutIndex : 0);
    
                    // Check if the current user is allowed to edit
                    if (data.userId === currentUser) {
                        setShowEditButton(true);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        };
    
        fetchData();
    }, [id, user]);

    //for updating routine history to keep track of current workout
    useEffect(() => {
        const updateRoutineHistory = async () => {
            try {
                const authToken = await GetToken();
                const res = await fetch(`${API_URL}/routine/start/${routineHistoryId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(completedWorkouts)
                });
                if (!res.ok) {
                    throw new Error(`Failed to update routine history for id: ${routineHistoryId}`);
                }
            } catch (error) {
                console.error(error);
            }
        };
    
        // Call the API to update the routine history whenever completedWorkouts changes
        if (completedWorkouts.length > 0 || currentWorkoutIndex === 0) {
            updateRoutineHistory();
        }
    }, [completedWorkouts]);

    const handleStartWorkout = () => {
        if (workoutDetails.length === 0) return;
    
        const currentWorkout = workoutDetails[currentWorkoutIndex];
    
        // Update the completed workouts state
        const newCompletedWorkouts = [...completedWorkouts, currentWorkout.workoutId];
        setCompletedWorkouts(newCompletedWorkouts);
        console.log(newCompletedWorkouts);
    
        // Determine the new current workout index
        let newIndex = currentWorkoutIndex + 1;
        if (newIndex >= workoutDetails.length) {
            newIndex = 0;
            console.log("All workouts completed");
            setCompletedWorkouts([]); // Reset completed workouts
        }
    
        // Update the current workout index state
        setCurrentWorkoutIndex(newIndex);
    
        //TODO: reroute to start workout page and pass id
    };
    


    const handleEditClick = () => {
        router.push(`/routines/edit/${id}`);
    };

    const handleBackClick = () => {
        router.push('/browse?tab=routines'); // Navigate to the browse page
    };

    const handlePanelClick = (workout) => {
        console.log("workout: ", workout);
        router.push(`/workouts/${workout.workoutId}`); // Navigate to workout detail page
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center mt-5">{routineName}</h1>
            <div className="mt-8">
                <WorkoutList
                    workouts={workoutDetails}
                    handlePanelClick={handlePanelClick}
                    currentWorkoutIndex={currentWorkoutIndex}
                    completedWorkouts={completedWorkouts}
                />
                <div className="flex justify-center mt-8 space-x-4">
                    {showEditButton && (
                        <button
                            onClick={handleEditClick}
                            className="px-4 py-2 text-white bg-blue-500 rounded"
                        >
                            Edit Routine
                        </button>
                    )}
                    <button 
                        className="px-4 py-2 text-white bg-blue-500 rounded" 
                        onClick={handleStartWorkout}
                    >
                        Start Workout
                    </button>
                    <button
                        className="px-4 py-2 text-white bg-gray-500 rounded"
                        onClick={handleBackClick}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoutineDetails;
