"use client"
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { profileIdAtom } from '../../../../store'; // Adjust the import path as necessary
import WorkoutExercise from '../../../components/workouts/WorkoutExercise'; // Adjust the import path as necessary

const WorkoutDetails = () => {
    const { id } = useParams(); // Access the dynamic route parameter
    const searchParams = useSearchParams();
    const name = searchParams.get('name'); // Access the query parameter
    const [workoutExercises, setWorkoutExercises] = useState([]);
    const [showEditButton, setShowEditButton] = useState(false);
    const [currentUser] = useAtom(profileIdAtom);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8080/workout/${id}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch for workout id: ${id}`);
                }
                const data = await res.json();
                setWorkoutExercises(data);

                const res2 = await fetch(`http://localhost:8080/workouts/${id}`)
                const tempData = await res2.json();
                // Check if the current user is allowed to edit
                if (tempData.userId === currentUser) {
                    setShowEditButton(true);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [id, currentUser]);

    const handlePanelClick = (item) => {
        console.log(item);
        //router.push(`/exercises/${item.exerciseId}`); 
        //TODO: logic may need to change and have other route parameters based on back button
        //logic in /exercises/[exerciseId]
    };

    const handleEditClick = () => {
        //TODO:
        //router.push(`/workouts/edit/${id}`);
    };

    const handleStartWorkout = () => {
        //TODO:
        //router.push(``);
    }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center mt-8">{name}</h1>
            <div className="mt-8">
                <div className="space-y-4">
                    {workoutExercises.map(workoutExercise => (
                        <WorkoutExercise
                            key={workoutExercise._id}
                            workoutExercise={workoutExercise}
                            handlePanelClick={handlePanelClick}
                        />
                    ))}
                </div>
                <div className="flex justify-center mt-8 space-x-4">
                    {showEditButton && (
                        <button
                            onClick={handleEditClick}
                            className="px-4 py-2 text-white bg-blue-500 rounded"
                        >
                            Edit Workout
                        </button>
                    )}
                    <button 
                        className="px-4 py-2 text-white bg-blue-500 rounded" 
                        onClick={handleStartWorkout}
                    >
                        Start Workout
                    </button>
                </div>

            </div>
        </div>
    );
};

export default WorkoutDetails;
