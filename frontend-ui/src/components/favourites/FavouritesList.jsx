import { useAtom } from "jotai";
import FavWorkoutCard from "./FavWorkoutCard";
import { profileAtom } from "../../../store";
import { GetToken } from "../AWS/GetToken";
import { useRouter } from "next/navigation";
import FavRoutineCard from "./FavRoutineCard";
import { useState } from "react";

// component to display list of user's favourites
export default function FavouritesList( {favWorkouts, favRoutines, showWorkouts, showRoutines} ) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [profile, setProfile] = useAtom(profileAtom);
  const router = useRouter();
  const [changed, setChanged] = useState(false);

  const handleFavWorkoutClicked = async (workout, e) => {
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
  };

  const handleFavRoutineClicked = async (routine, e) => {
    e.stopPropagation();
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
  };

  const handleWorkoutPanelClicked = (workout) => {
    router.push(`/workouts/${workout.workoutId}`);
  };

  const handleRoutinePanelClicked = (routine) => {
    router.push(`/routines/${routine.routineId}`);
  };

  return (
    <div className="w-screen mx-auto p-4 flex flex-col gap-2">
      {showRoutines && favRoutines.map(routine =>
        <FavRoutineCard key={routine._id}
        routine={routine}
        handleFavRoutineClicked={handleFavRoutineClicked}
        handleRoutinePanelClicked={handleRoutinePanelClicked}
        />
      )}
      {showWorkouts && favWorkouts.map(workout => 
        <FavWorkoutCard key={workout._id}
        workout={workout}
        handleFavWorkoutClicked={handleFavWorkoutClicked} 
        handleWorkoutPanelClicked={handleWorkoutPanelClicked}
        />
      )}
    </div>
  );
};