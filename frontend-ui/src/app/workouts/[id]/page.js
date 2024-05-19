// app/workouts/[id]/page.js
"use client"
import { useParams } from 'next/navigation';

const WorkoutDetail = () => {
    const { id } = useParams(); // Access the dynamic route parameter

    return (
        //TODO: 
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-primary mb-4">Workout ID</h1>
            <p className="text-dark-gray">{id}</p>
        </div>
    );
};

export default WorkoutDetail;
