// pages/browse/index.js
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter to handle routing 
import WorkoutList from '../../components/browse/WorkoutList';
import WorkoutFilter from '../../components/browse/WorkoutFilter';
import {profileIdAtom} from '../../../store'
const { useAtom } = require("jotai");

const BrowsePage = () => {
    const router = useRouter(); // Initialize useRouter
    const [selectedOption, setSelectedOption] = useState('workouts'); // Default to workouts
    const [workouts, setWorkouts] = useState([]);
    const [filteredWorkouts, setFilteredWorkouts] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [filter, setFilter] = useState('all'); // Default filter
    const [searchQuery, setSearchQuery] = useState(''); // Default search query
    const [profileId] = useAtom(profileIdAtom);
    useEffect(() => {
        const fetchData = async () => {
            if (selectedOption !== 'exercises') {
                try {
                    const res = await fetch(selectedOption === 'workouts' ? `http://localhost:8080/workouts?user=${profileId}` : 'http://localhost:8080/routines');
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
            } else {
                router.push('/exercises'); // Reroute to exercises page
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
        router.push(`/workouts/${item.workoutId}`); // Redirect to /workouts/[item._id]
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value); // Update filter state
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); // Update search query state
    };


    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center mt-5">Browse Page</h1>
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
                <button
                    onClick={() => setSelectedOption('exercises')}
                    className={`px-4 py-2 mx-2 font-semibold rounded ${selectedOption === 'exercises' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                    Exercises
                </button>
            </div>
            <div className="mt-8">
                {selectedOption === 'workouts' && (
                    <>
                        <WorkoutFilter 
                            filter={filter} 
                            searchQuery={searchQuery} 
                            handleFilterChange={handleFilterChange} 
                            handleSearchChange={handleSearchChange} 
                        />
                        <WorkoutList 
                            workouts={filteredWorkouts} 
                            handlePanelClick={handlePanelClick} 
                        />
                    </>
                )}
                 {/*if selected button option is routines, handle here*/}
                {selectedOption === 'routines' && (
                    <p className="text-center text-red-500">This feature is currently unavailable.</p>
                )}
                 {/*if selected button option is routines, handle here*/}
                {selectedOption === 'exercises' && (
                    <p className="text-center text-red-500">Exercises</p>
                )}
            </div>
        </div>
    );
}

export default BrowsePage;
