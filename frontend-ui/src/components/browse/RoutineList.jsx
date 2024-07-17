// components/browse/RoutineList.js
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { useAtom } from 'jotai';
import React from 'react';
import { profileAtom } from '../../../store';
import { GetToken } from '../AWS/GetToken';

const RoutineList = ({ routines, handlePanelClick }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [profile, setProfile] = useAtom(profileAtom);

  const handleFavClick = async (routine) => {
    var favs = profile?.favourites;

    // either add or remove from the profile atom first
    if (profile?.favourites.routines.findIndex((rt) => rt._id == routine._id) !== -1) {
      // remove the routine from favs
      console.debug('remove routine from favs');
      favs.routines = favs.routines.filter(rt => rt._id !== routine._id);
    } else {
      // add routine to favs
      console.debug('add routine to favs');
      favs.routines.push(routine);
    }

    // then save it to the database
    try {
      const authToken = await GetToken();
      const res = await fetch(`${API_URL}/profile/favourites/${profile._id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(favs),
      });
      if (!res.ok) {
        throw new Error(`Failed to update profile favourites for id: ${profile._id}`);
      }
      const resData = await res.json();
      return resData;
    } catch (error) {
      console.error('Error updating profile favourites: ', error);
      return null;
    }
  }

  return (
    <div className="mt-4 space-y-4">
      {routines.map((routine) => (
        <div
          key={routine.routineId}
          className="flex items-center p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
          onClick={() => handlePanelClick(routine)}
        >
          <div className="flex-shrink-0 w-16 h-16 relative">
            <img
              src={`/category/${routine.category}.jpg`} // Update the path and extension as needed
              alt={routine.category}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{routine.routineName}</h3>
            <p className="text-gray-600">{routine.category}</p>
          </div>
          <button type='button'
          className='ml-auto rounded text-yellow-500'
          onClick={() => handleFavClick(routine)}
          >
            {profile?.favourites.routines.findIndex((rt) => rt._id == routine._id) !== -1 ? <StarIconSolid className='size-6' /> : <StarIconOutline className='size-6' />}
          </button>
        </div>
      ))}
    </div>
  );
};

export default RoutineList;
