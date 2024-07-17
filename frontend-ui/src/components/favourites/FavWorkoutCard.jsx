import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { useAtom } from "jotai";
import { profileAtom } from "../../../store";
import { GetToken } from '../AWS/GetToken';

// component to display Favourite Workout card
export default function FavWorkoutCard( {workout, handleFavWorkoutClicked, handleWorkoutPanelClicked} ) {
  const [profile, setProfile] = useAtom(profileAtom);

  return (
    <div className="p-4 flex items-center border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
    onClick={() => handleWorkoutPanelClicked(workout)}
    >
      <div className="">
        <h3 className="text-lg font-semibold">{workout.name}</h3>
        <p className="italic text-gray-600">Workout</p>
      </div>
      <div className="ml-auto">
        <button type='button'
        className='text-yellow-500 rounded'
        onClick={() => handleFavWorkoutClicked(workout)}
        >
          {profile?.favourites.workouts.findIndex((wo) => wo._id == workout._id) !== -1 ? <StarIconSolid className='size-6'/> : <StarIconOutline className='size-6'/>}
        </button>
      </div>
    </div>
  );
};
