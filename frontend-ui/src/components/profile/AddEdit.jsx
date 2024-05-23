// form for adding or editing a Profile
"use client"
import { useForm } from "react-hook-form";

const AddEdit = (props) => {
  const profile = props?.profile;   // will have a profile obj if we want to edit/update, empty if creating
  const isAddMode = !profile;       // to track if we are creating a new profile or updating existing

  const formOptions = { defaultValues: {
    age: '25',
    height: '175',
    weight: '180',
    sex: 'Male',
    fitnessLevel: 'Beginner'
  }};

  if (!isAddMode) {
    formOptions.defaultValues = profile;    // load form's values with values from existing profile
  }

  // get functions to build a form with useForm() hook
  const { register, handleSubmit, reset, formState: { errors } } = useForm(formOptions);

  // TODO: adjust this to call backend-api for either new profile or update profile, depending on value of 'isAddMode'
  const onSubmit = (data) => {console.log(data)};

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
