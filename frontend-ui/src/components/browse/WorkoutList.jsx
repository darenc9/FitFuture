import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { useAtom } from 'jotai';
import { profileAtom } from '../../../store';
import { GetToken } from '../AWS/GetToken';


const WorkoutList = ({ workouts, handlePanelClick }) => {
  const router = useRouter(); // Initialize useRouter
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [profile, setProfile] = useAtom(profileAtom);
  const [changed, setChanged] = useState(false);

  const handleFavClick = async (workout, e) => {
    e.stopPropagation();
    var favs = profile?.favourites;

    // either add or remove from the profile atom first
    if (profile?.favourites.workouts.findIndex((wo) => wo._id == workout._id) !== -1) {
      // remove the workout from favs
      favs.workouts = favs.workouts.filter(wo => wo._id !== workout._id);
    } else {
      // add workout to favs
      favs.workouts.push(workout);
    }
    setChanged(!changed);

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
            {workouts.map(workout => (
              <div key={workout._id}>
                <div
                    className="flex items-center p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                    onClick={() => handlePanelClick(workout)}
                >
                    <div className="flex-shrink-0 w-16 h-16 relative">
                        <img
                            src={`/category/${workout.category}.jpg`} // Update the path and extension as needed
                            alt={workout.category}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold">{workout.name}</h3>
                        <p className="text-gray-600">{workout.category}</p>
                    </div>
                    { profile ? 
                    (<button type='button' 
                    className='ml-auto rounded text-yellow-500'
                    onClick={(e) => handleFavClick(workout, e)}
                    >
                      {profile?.favourites.workouts.findIndex((wo) => wo._id == workout._id) !== -1 ? <StarIconSolid className='size-6'/> : <StarIconOutline className='size-6'/>}
                    </button>)
                    :
                    (null)
                    }
                </div>

              </div>
            ))}
        </div>
    );
};

export default WorkoutList;
