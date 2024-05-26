// form for adding or editing a Profile
"use client"
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { profileIdAtom } from "../../../store";
import { useRouter } from "next/navigation";

const AddEdit = (props) => {
  const [profileId, setProfileId] = useAtom(profileIdAtom);
  const router = useRouter();
  const profile = props?.profile;   // will have a profile obj if we want to edit/update, empty if creating
  const isAddMode = !profile;       // to track if we are creating a new profile or updating existing

  const formOptions = { defaultValues: {
    userId: '664e57d81605f3f66ef74179',   // TODO: change this to use the logged in user's id
    age: 25,
    height: 175,
    weight: 180,
    sex: 'Male',
    fitnessLevel: 'Beginner',
    favourites: {
      exercises: [],
      workouts: [],
      routines: [],
    },
  }};

  if (!isAddMode) {
    formOptions.defaultValues = profile;    // load form's values with values from existing profile
  }

  // get functions to build a form with useForm() hook
  const { register, handleSubmit, reset, formState: { errors } } = useForm(formOptions);

  const handleMakeNewProfile = async (data) => {
    try {
      const res = await fetch(`http://localhost:8080/profile/create`, {
        method: "POST",
        headers: {
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
  };

  // TODO: adjust this to call backend-api for update profile once update route is complete
  const onSubmit = async (data) => {
    // parse the form data to correct formats
    data.age = parseInt(data.age);
    data.height = parseInt(data.height);
    data.weight = parseInt(data.weight);
    // determine whether to make a new profile, or edit existing one
    if (isAddMode) {
      const result = await handleMakeNewProfile(data);
      if (result?._id) {  // new profile was successfully made, redirect to the profile page for the newly created profile
        setProfileId(result._id);
        router.push('/profile');
      }
    } else {
      // TODO: fix me
      console.log(`make call to backend api for updating a profile with _id: ${profile._id}...`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-semibold text-xl text-center">Enter your profile information</h1>
      <div className="mt-2 flex justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex justify-between gap-x-4">
            <label>Age: </label>
            <input type="number" {...register("age", {required: true})} className="text-right"/>
          </div>
          <div className="flex justify-between gap-x-4">
            <label>Height (cm): </label>
            <input type="number" {...register("height", {required: true})} className="text-right"/>
          </div>
          <div className="flex justify-between gap-x-4">
            <label>Weight (lbs): </label>
            <input type="number" {...register("weight", {required: true})} className="text-right"/>
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
