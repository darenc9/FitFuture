import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { useAtom } from "jotai";
import { profileAtom } from "../../../store";

// component to display Favourite Routine card
export default function FavRoutineCard( {routine, handleFavRoutineClicked, handleRoutinePanelClicked} ) {
  const [profile, setProfile] = useAtom(profileAtom);

  return (
    <div className="p-4 flex items-center border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
    onClick={() => handleRoutinePanelClicked(routine)}
    >
      <div className="">
        <h3 className="text-lg font-semibold">{routine.routineName}</h3>
        <p className="italic text-gray-600">Routine</p>
      </div>
      <div className="ml-auto">
        <button type='button'
        className='text-yellow-500 rounded'
        onClick={() => handleFavRoutineClicked(routine)}
        >
          {profile?.favourites.routines.findIndex((rt) => rt._id == routine._id) !== -1 ? 
          <StarIconSolid className='size-6'/> 
          : <StarIconOutline className='size-6'/>}
        </button>
      </div>
    </div>
  );
};
