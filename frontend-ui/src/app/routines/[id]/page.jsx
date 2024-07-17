"use client";
// Import necessary modules and components
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { GetToken } from '@/components/AWS/GetToken';
import WorkoutList from '@/components/browse/WorkoutList'; // Update the path as per your project structure

const RoutineDetails = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const { id } = useParams(); // Access the dynamic route parameter
    const [routineName, setRoutineName] = useState('');
    const [workoutDetails, setWorkoutDetails] = useState([]); // State to store detailed workout information
    const [showEditButton, setShowEditButton] = useState(false);
    const { user } = useAuthenticator((context) => [context.user]);
    const router = useRouter();

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
                <WorkoutList workouts={workoutDetails} handlePanelClick={handlePanelClick} />
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
