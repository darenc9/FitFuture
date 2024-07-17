import { useAtom } from "jotai";
import FavWorkoutCard from "./FavWorkoutCard";
import { profileAtom } from "../../../store";
import { GetToken } from "../AWS/GetToken";
import { useRouter } from "next/navigation";

// component to display list of user's favourites
export default function FavouritesList( {favWorkouts, favRoutines} ) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [profile, setProfile] = useAtom(profileAtom);
  const router = useRouter();

  const handleFavWorkoutClicked = async (workout) => {
    var favs = profile?.favourites;

    // either add or remove from the profile atom first
    if (profile?.favourites.workouts.findIndex((wo) => wo._id == workout._id) !== -1) {
      // remove the workout from favs
      console.debug('remove workout from favs');
      favs.workouts = favs.workouts.filter(wo => wo._id !== workout._id);
    } else {
      // add workout to favs
      console.debug('add workout to favs');
      favs.workouts.push(workout);
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
  };

  const handleWorkoutPanelClicked = (workout) => {
    router.push(`/workouts/${workout.workoutId}`);
  };

  return (
    <div className="w-screen mx-auto p-4 flex flex-col gap-2">
      {favWorkouts.map(workout => <FavWorkoutCard key={workout._id} workout={workout} handleFavWorkoutClicked={handleFavWorkoutClicked} handleWorkoutPanelClicked={handleWorkoutPanelClicked}/>)}
    </div>
  );
};