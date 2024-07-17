"use client";
import React, { useState, useEffect } from 'react';
import { useAuthenticator } from "@aws-amplify/ui-react";
import { GetToken } from '@/components/AWS/GetToken';
import { PlusIcon } from '@heroicons/react/24/solid';
import WorkoutExercise from '../../components/workouts/WorkoutExercise';
import WorkoutFilter from '@/components/browse/WorkoutFilter';

const RoutineEdit = ({ routine }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [routineName, setRoutineName] = useState(routine.routineName || '');
  const [isPublic, setIsPublic] = useState(routine.public || false);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // Add filter state

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (user && user.username) {
        try {
          const authToken = await GetToken();
          const res = await fetch(`${API_URL}/workouts`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          });
          const data = await res.json();
          setAllWorkouts(data);
        } catch (error) {
          console.error('Failed to fetch workouts:', error);
        }
      }
    };

    fetchWorkouts();
  }, [user]);

  useEffect(() => {
    // Populate selected workouts based on routine data
    if (routine.workoutIds && routine.workoutIds.length > 0) {
      const selectedWorkoutData = allWorkouts.filter(workout => routine.workoutIds.includes(workout.workoutId));
      setSelectedWorkouts(selectedWorkoutData);
    }
  }, [routine, allWorkouts]);

  const handleAddWorkout = (workout) => {
    setSelectedWorkouts([...selectedWorkouts, workout]);
  };

  const handleRemoveWorkout = (workoutId) => {
    setSelectedWorkouts(selectedWorkouts.filter(w => w._id !== workoutId));
  };

  const handleSaveRoutine = async () => {
    try {
      const workoutIds = selectedWorkouts.map(w => w.workoutId); 
      const authToken = await GetToken();
      const routineData = {
        routineName: routineName,
        public: isPublic,
        workoutIds: workoutIds,
        userId: user.username,
        category: 'Custom',
      };

      const res = await fetch(`${API_URL}/routines/${routine.routineId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(routineData)
      });

      if (!res.ok) {
        throw new Error('Failed to save routine');
      }

      // Handle success, e.g., show a message, redirect, etc.
      console.log('Routine updated successfully');
    } catch (error) {
      console.error('Failed to update routine:', error);
    }
  };

  const handleShowModal = async (workout) => {
    try {
      const authToken = await GetToken();
      const res = await fetch(`${API_URL}/workout/${workout.workoutId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch workout details');
      }

      const data = await res.json();
      setWorkoutExercises(data);
      setModalContent(workout);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch workout details:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent(null);
    setWorkoutExercises([]);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Filter workouts based on search query and filter
  const filteredWorkouts = allWorkouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || workout.category.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Routine Name</label>
          <input
            type="text"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
              className="form-checkbox"
            />
            <span className="ml-2">Public</span>
          </label>
        </div>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowWorkoutSelector(!showWorkoutSelector)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Workout
          </button>
        </div>
        {showWorkoutSelector && (
          <div className="mb-4 flex-1">
            <h3 className="font-semibold">Select Workouts</h3>
            <WorkoutFilter
              filter={filter}
              searchQuery={searchQuery}
              handleFilterChange={handleFilterChange}
              handleSearchChange={handleSearchChange}
            />
            <div className="overflow-y-auto">
              {filteredWorkouts.map(workout => (
                <div key={workout._id} className="flex items-center justify-between p-2 border-b">
                  <div>
                    <h4
                      className="font-bold cursor-pointer text-blue-500"
                      onClick={() => handleShowModal(workout)}
                    >
                      {workout.name}
                    </h4>
                    <p className="text-sm">{workout.description}</p>
                  </div>
                  <button
                    onClick={() => handleAddWorkout(workout)}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mb-4">
          <h3 className="font-semibold">Selected Workouts</h3>
          {selectedWorkouts.map(workout => (
            <div key={workout._id} className="flex items-center justify-between p-2 border-b">
              <div>
                <h4 className="font-bold">{workout.name}</h4>
                <p className="text-sm">{workout.description}</p>
              </div>
              <button
                onClick={() => handleRemoveWorkout(workout._id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <button
            onClick={handleSaveRoutine}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save Routine
          </button>
        </div>
      </div>
      {showModal && modalContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-3/4 max-w-lg">
            <h3 className="text-xl font-bold mb-4">{modalContent.name}</h3>
            <p>{modalContent.description}</p>
            <p><strong>Category:</strong> {modalContent.category}</p>
            <p><strong>Time:</strong> {modalContent.time}</p>
            <h4 className="font-semibold mt-4">Exercises</h4>
            <div className="space-y-4">
              {workoutExercises.map(exercise => (
                <WorkoutExercise
                  key={exercise._id}
                  workoutExercise={exercise}
                  handlePanelClick={() => {}}
                />
              ))}
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineEdit;
