// app/workouts/[id]/page.js
"use client"
import { useState, useEffect } from 'react';
import { useParams, useSearchParams  } from 'next/navigation';

const WorkoutDetails = () => {
    const { id } = useParams(); // Access the dynamic route parameter
    const searchParams = useSearchParams();
    const name = searchParams.get('name'); // Access the query parameter
    const [workoutExercises, setWorkoutExercises] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8080/workouts/${id}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch for workout id: ${id}`);
                }
                const data = await res.json();
                setWorkoutExercises(data);

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // Function to replace underscores with spaces
    //convert exercise id to exercise name
    const formatExerciseId = (name) => {
        return name.replace(/_/g, ' ');
    };

    const handlePanelClick = (item) => {
        console.log(item);
        //TODO: implement once exercise route by id is done (to display more info on exercise)
        //router.push(`/exercise/${item.exerciseId}`); // Redirect to /exercise/[item.exerciseId]
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center mt-8">{name}</h1>
            <div className="mt-8">
                <div className="space-y-4">
                    {workoutExercises.map(workoutExercise => (
                        <div
                            key={workoutExercise._id}
                            className="flex items-center p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                            onClick={() => handlePanelClick(workoutExercise)}
                        >
                            <div className="flex-shrink-0 w-16 h-16 bg-gray-300">
                                {/* TODO: Placeholder for image */}
                            </div>
                            <div className="ml-4 flex-grow">
                                <h3 className="text-lg font-semibold">{formatExerciseId(workoutExercise.exerciseId)}</h3>
                                <p className="text-gray-600">{workoutExercise.sets}x - {workoutExercise.reps} reps</p>
                            </div>
                            <div className="flex-shrink-0 ml-4">
                                <button className="w-6 h-6 text-gray-500 hover:text-gray-700">
                                    <i className="fas fa-info-circle"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    

};

export default WorkoutDetails;
