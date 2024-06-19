"use client";
import React from 'react';
import { useAtom } from 'jotai';
import { viewAtom } from '../../../utility/viewAtom'; // Import the view atom
import WorkoutBuilderContent from '../../components/build/WorkoutBuilderContent';
import RoutineBuilderContent from '../../components/build/RoutineBuilderContent';
import { withAuthenticator } from "@aws-amplify/ui-react";

const WorkoutBuilder = () => {
  const [view, setView] = useAtom(viewAtom); // Use the view atom

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={() => setView('workout')}
          className={`px-4 py-2 font-semibold rounded ${view === 'workout' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Build Workout
        </button>
        <button
          onClick={() => setView('routine')}
          className={`px-4 py-2 font-semibold rounded ${view === 'routine' ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Build Routine
        </button>
      </div>
      {view === 'workout' && <WorkoutBuilderContent setView={setView} />}
      {view === 'routine' && <RoutineBuilderContent />}
    </div>
  );
};

export default withAuthenticator(WorkoutBuilder);
