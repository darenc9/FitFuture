// component to display Profile details
export default function ProfileDetails( {profile} ) {
  return (
    <div className="mx-auto p-4">
      <h1 className="text-xl font-bold text-center">Your Profile Information</h1>
      <div className="flex flex-col space-y-2 mt-5">
        <p><span className="font-semibold">Age: </span>{profile.age}</p>
        <p><span className="font-semibold">Height: </span>{profile.height} cm</p>
        <p><span className="font-semibold">Weight: </span>{profile.weight} lbs</p>
        <p><span className="font-semibold">Sex: </span>{profile.sex}</p>
        <p><span className="font-semibold">Fitness Level: </span>{profile.fitnessLevel}</p>
      </div>
    </div>
  );
};
