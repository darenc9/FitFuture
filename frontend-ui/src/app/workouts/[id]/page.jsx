"use client"
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { profileIdAtom } from '../../../../store'; 
import WorkoutExercise from '../../../components/workouts/WorkoutExercise'; 
import useResetEditExerciseAtoms from '../../../../utility/useResetEditExerciseAtoms';


const WorkoutDetails = () => {
    const resetAtoms = useResetEditExerciseAtoms(); // Get the reset function
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const { id } = useParams(); // Access the dynamic route parameter
    const searchParams = useSearchParams();
    const [name, setName] = useState(''); 
    const [workoutExercises, setWorkoutExercises] = useState([]);
    const [showEditButton, setShowEditButton] = useState(false);
    const [currentUser] = useAtom(profileIdAtom);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/workout/${id}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch for workout id: ${id}`);
                }
                const data = await res.json();
                setWorkoutExercises(data);

                const res2 = await fetch(`${API_URL}/workouts/${id}`)
                const tempData = await res2.json();
                console.log(tempData);    
                setName(tempData.name);
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
        router.push(`/exercises/${item.exerciseId}`); 
        //TODO: logic may need to change and have other route parameters based on back button
        //logic in /exercises/[exerciseId]
    };

    const handleEditClick = () => {
        resetAtoms();
        router.push(`/workouts/edit/${id}`);
    };

    const handleStartWorkout = () => {
        //TODO:
        router.push(`/workouts/start?id=${id.toString()}`);
    }

    const handleBackClick = () => {
        router.push('/browse'); // Navigate to the previous page
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center mt-5">{name}</h1>
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

export default WorkoutDetails;
