// pages/browse/index.js
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter to handle routing 
import WorkoutList from '../../components/browse/WorkoutList';
import WorkoutFilter from '../../components/browse/WorkoutFilter';
import RoutineList from '@/components/browse/RoutineList'
import RoutineFilter from '@/components/browse/RoutineFilter'
import { GetToken } from '@/components/AWS/GetToken';
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useAuthenticator } from '@aws-amplify/ui-react';
//import {profileIdAtom} from '../../../store'
//const { useAtom } = require("jotai");

const BrowsePage = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter(); // Initialize useRouter
    const [selectedOption, setSelectedOption] = useState(); // Default to workouts
    const [workouts, setWorkouts] = useState([]);
    const [filteredWorkouts, setFilteredWorkouts] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [filteredRoutines, setFilteredRoutines] = useState([]);
    const [filter, setFilter] = useState('all'); // Default filter
    const [searchQuery, setSearchQuery] = useState(''); // Default search query
    const tab = router.query;
    //const [profileId] = useAtom(profileIdAtom);
    const { user } = useAuthenticator((context) => [context.user]);

useEffect(() => {
        const fetchData = async () => {
            if (user && user.username) {
                console.log('User object:', user);
                const userId = user.username;
                console.log("tab: ", tab);
                if (tab) {
                    console.log("if (tab): ", tab);
                    setSelectedOption(tab);
                }
                else if (!selectedOption) {
                    setSelectedOption('workouts');
                } 
                if (selectedOption !== 'exercises') {
                    try {
                        const authToken = await GetToken();
                        const res = await fetch(selectedOption === 'workouts' ? `${API_URL}/workouts?user=${userId}` : `${API_URL}/routines?user=${userId}`, {
                            headers: {'Authorization': `Bearer ${authToken}`},
                            method: 'GET' 
                        });
                        if (!res.ok) {
                            throw new Error(`Failed to fetch ${selectedOption === 'workouts' ? 'workouts' : 'routines'} data`);
                        }
                        const data = await res.json();
                        console.log("fetched data: ", data);
                        if (selectedOption === 'workouts') {
                            setWorkouts(data);
                            setFilteredWorkouts(data); // Initially show all workouts
                        } else {
                            setRoutines(data);
                            setFilteredRoutines(data);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    router.push('/exercises'); // Reroute to exercises page
                }
            } else {
                console.log('User is not defined yet.');
            }
        };

        fetchData();
    }, [selectedOption, user]);

    useEffect(() => {
        if (tab) {
            setSelectedOption(tab);
        }
    }, [tab]);


    useEffect(() => {
        if (selectedOption === 'workouts') {
            let filtered = workouts;

            if (filter !== 'all' && filter != 'myWorkouts') {
                filtered = filtered.filter(workout => workout.category.toLowerCase() === filter.toLowerCase());
            } else if (filter == 'myWorkouts'){
                filtered = filtered.filter(workout => workout.userId === user.username);
            }
    
            if (searchQuery) {
                filtered = filtered.filter(workout => workout.name.toLowerCase().includes(searchQuery.toLowerCase()));
            }
            setFilteredWorkouts(filtered);
        } else if (selectedOption === 'routines') {
            let filtered = routines;

            if (filter !== 'all') {
                filtered = filtered.filter(routine => routine.category.toLowerCase() === filter.toLowerCase());
            }

            if (searchQuery) {
                filtered = filtered.filter(routine => routine.routineName.toLowerCase().includes(searchQuery.toLowerCase()));
            }
            setFilteredRoutines(filtered);
        }
    }, [filter, workouts, routines, selectedOption, searchQuery]);

    const handlePanelClick = (item) => {
        console.log(item);
        if (selectedOption === 'workouts') {
            router.push(`/workouts/${item.workoutId}`); // Redirect to /workouts/[item.workoutId]
        } else if (selectedOption === 'routines') {
            router.push(`/routines/${item.routineId}`); // Redirect to /routines/[item.routineId]
        }
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
                {selectedOption === 'routines' && (
                    <>
                        <RoutineFilter
                            filter={filter}
                            searchQuery={searchQuery}
                            handleFilterChange={handleFilterChange}
                            handleSearchChange={handleSearchChange}
                        />
                        <RoutineList
                            routines={filteredRoutines}
                            handlePanelClick={handlePanelClick}
                        />
                    </>
                )}
                 {/*if selected button option is routines, handle here*/}
                {selectedOption === 'routines' && (
                    <p className="text-center text-red-500">Routines</p>
                )}
                 {/*if selected button option is routines, handle here*/}
                {selectedOption === 'exercises' && (
                    <p className="text-center text-red-500">Exercises</p>
                )}
            </div>
        </div>
    );
}

export default withAuthenticator(BrowsePage);
