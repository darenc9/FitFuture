
// function to calculate the user's age based on their profile's dob attribute
function calculateAge(dob) {
  var birthDate = new Date(dob);
  var currentDate = new Date();

  var numYears = (currentDate.getFullYear() - birthDate.getFullYear());

  if (currentDate.getMonth() < birthDate.getMonth() ||
      currentDate.getMonth() == birthDate.getMonth() && currentDate.getDate() < birthDate.getDate()) {
    numYears--;
  }

  return numYears;
}

// component to display Profile details
export default function ProfileDetails( {profile} ) {
  return (
    <div className="mx-auto p-4">
      <h1 className="text-xl font-bold text-center">{profile.userId}'s Profile</h1>
      <div className="flex flex-col space-y-2 mt-5">
        <p><span className="font-semibold">Age: </span>{calculateAge(profile.dob)}</p>
        <p><span className="font-semibold">Height: </span>{profile.height} cm</p>
        <p><span className="font-semibold">Weight: </span>{profile.weight[profile.weight.length - 1].weight} kgs</p>
        <p><span className="font-semibold">Sex: </span>{profile.sex}</p>
        <p><span className="font-semibold">Fitness Level: </span>{profile.fitnessLevel}</p>
      </div>
    </div>
  );
};
