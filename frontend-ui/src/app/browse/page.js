// pages/browse/index.js
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter to handle routing 

const BrowsePage = () => {
    const router = useRouter(); // Initialize useRouter
    const [selectedOption, setSelectedOption] = useState('workouts'); // Default to workouts
    const [workouts, setWorkouts] = useState([]);
    const [filteredWorkouts, setFilteredWorkouts] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [filter, setFilter] = useState('all'); // Default filter
    const [searchQuery, setSearchQuery] = useState(''); // Default search query

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(selectedOption === 'workouts' ? 'http://localhost:8080/workouts' : 'http://localhost:8080/routines');
                if (!res.ok) {
                    throw new Error(`Failed to fetch ${selectedOption === 'workouts' ? 'workouts' : 'routines'} data`);
                }
                const data = await res.json();
                if (selectedOption === 'workouts') {
                    setWorkouts(data);
                    setFilteredWorkouts(data); // Initially show all workouts
                } else {
                    setRoutines(data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [selectedOption]);

    useEffect(() => {
        if (selectedOption === 'workouts') {
            let filtered = workouts;

            if (filter !== 'all') {
                filtered = filtered.filter(workout => workout.category.toLowerCase() === filter.toLowerCase());
            }
    
            if (searchQuery) {
                filtered = filtered.filter(workout => workout.name.toLowerCase().includes(searchQuery.toLowerCase()));
            }
            setFilteredWorkouts(filtered);
        } else {
            //TODO: handle the routine filtering
        }
        //this use effect hook will run any time any value in dependency array changes
    }, [filter, workouts, selectedOption, searchQuery]);

    const handlePanelClick = (item) => {
        console.log(item);
        router.push(`/workouts/${item._id}`); // Redirect to /workouts/[item._id]
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value); // Update filter state
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); // Update search query state
    };


    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center mt-8">Browse Page</h1>
            <div className="flex justify-center mt-4">
                {/*Buttons for swapping between browsing routines and workouts */}
                <button
                    onClick={() => setSelectedOption('workouts')}
                    className={`px-4 py-2 mx-2 font-semibold rounded ${selectedOption === 'workouts' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                    Workouts
                </button>
                <button
                    onClick={() => setSelectedOption('routines')}
                    className={`px-4 py-2 mx-2 font-semibold rounded ${selectedOption === 'routines' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                    Routines
                </button>
            </div>
            <div className="mt-8">
                {selectedOption === 'workouts' && (
                    <>
                        <div className="flex justify-between items-center mb-4 relative">
                            <input 
                                type="text" 
                                value={searchQuery} 
                                onChange={handleSearchChange} 
                                placeholder="Search by name..." 
                                className="px-2 py-1 rounded border text-sm"
                            />

                            <select value={filter} onChange={handleFilterChange} className="absolute right-0 px-2 py-1 rounded border text-sm">
                                <option value="all">All</option>
                                <option value="cardio">Cardio</option>
                                <option value="strength">Strength</option>
                                <option value="flexibility">Flexibility</option>
                                <option value="yoga">Yoga</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>

                        <div className="mt-4 space-y-4">
                            {filteredWorkouts.map(workout => (
                                <div
                                    key={workout._id}
                                    className="flex items-center p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                                    //add event handler to each panel and pass it the workout object
                                    onClick={() => handlePanelClick(workout)}
                                >
                                    <div className="flex-shrink-0 w-16 h-16 bg-gray-300">
                                        {/* Placeholder for image */}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold">{workout.name}</h3>
                                        <p className="text-gray-600">{workout.category}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <p className="text-sm font-semibold">Time: {workout.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {/*if selected button option is routines, handle here*/}
                {selectedOption === 'routines' && (
                    <p className="text-center text-red-500">This feature is currently unavailable.</p>
                )}
            </div>
        </div>
    );
}

export default BrowsePage;
