// form for adding or editing a Profile
"use client"
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { profileIdAtom } from "../../../store";
import { useRouter } from "next/navigation";
import { GetToken } from "../AWS/GetToken";
import { useAuthenticator } from "@aws-amplify/ui-react";

const AddEdit = (props) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [profileId, setProfileId] = useAtom(profileIdAtom);
  const router = useRouter();
  const profile = props?.profile;   // will have a profile obj if we want to edit/update, empty if creating
  const isAddMode = !profile;       // to track if we are creating a new profile or updating existing
  const { user } = useAuthenticator((context) => [context.user]);

  const formOptions = { defaultValues: {
    userId: 'placeHolder',   // this will be changed to use the logged in user's id
    dob: new Date("1990/01/01").toISOString().split('T')[0],
    height: 175,
    weight: 95,
    sex: 'Male',
    fitnessLevel: 'Beginner',
    favourites: {
      exercises: [],
      workouts: [],
      routines: [],
    },
  }};

  if (!isAddMode) {
    // load form's values with values from existing profile
    formOptions.defaultValues = {
      _id: profile._id,
      userId: profile.userId,
      dob: new Date(profile.dob).toISOString().split('T')[0],
      height: profile.height,
      weight: profile.weight,
      sex: profile.sex,
      fitnessLevel: profile.fitnessLevel,
      favourites: profile.favourites,
    };
  }

  // get functions to build a form with useForm() hook
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm(formOptions);

  const handleMakeNewProfile = async (data) => {
    if (user && user.username) {
      data.userId = user.username;
      try {
        const authToken = await GetToken();
        const res = await fetch(`${API_URL}/profile/create`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${authToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          throw new Error('Failed to create new profile with given data');
        }
        const resData = await res.json();
        return resData;
      } catch (error) {
        console.error('Error creating new profile: ', error);
        return null;
      }
    }
  };

  const handleEditProfile = async (data) => {
    try {
      const authToken = await GetToken();
      const res = await fetch(`${API_URL}/profile/${data._id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error(`Failed to update profile with id: ${data._id}`);
      }
      const resData = await res.json();
      return resData;
    } catch (error) {
      console.error('Error updating profile: ', error);
      return null;
    }
  };

  const onSubmit = async (data) => {
    // parse the form data to correct formats
    data.dob = new Date(data.dob);
    data.height = parseInt(data.height);
    data.weight = parseInt(data.weight);

    // determine whether to make a new profile, or edit existing one
    if (isAddMode) {
      const result = await handleMakeNewProfile(data);
      if (result?._id) {  // new profile was successfully made
        setProfileId(result._id); // update the shared profile id to use newly created profile
        router.push('/');  // redirect to the home page after profile creation
      }
    } else {
      const result = await handleEditProfile(data);
      if (result) {
        router.push('/profile');  // redirect to the profile page after updated
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-semibold text-xl text-center">Enter your profile information</h1>
      <div className="mt-2 flex justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

          <div className="flex justify-between gap-x-4">
            <label>Date of Birth: </label>
            <input type="date" {...register("dob", {required: true})} className="text-right"/>
          </div>

          <div className="flex justify-between gap-x-4">
            <label>Height (cm): </label>
            <input type="number" name="height" {...register("height", {required: true})} className="text-right"/>
          </div>

          <div className="flex justify-between gap-x-4">
            <label>Weight (kgs): </label>
            <input type="number" name="weight" {...register("weight", {required: true})} className="text-right"/>
          </div>

          <div className="flex justify-between gap-x-4">
            <label>Sex: </label>
            <select name="selectedSex" {...register("sex", {required: true})}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Undisclosed">Undisclosed</option>
            </select>
          </div>

          <div className="flex justify-between gap-x-4">
            <label>Fitness Level: </label>
            <select name="fitnessLvl" {...register("fitnessLevel", {required: true})}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <button type="submit" className="bg-blue-500 text-white rounded py-1 px-2">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default AddEdit;
