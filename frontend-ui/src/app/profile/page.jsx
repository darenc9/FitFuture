// src/app/profile/page.jsx
"use client"
import ProfileDetails from "@/components/profile/ProfileDetails";
import Link from "next/link";
import {  useState } from "react";

const fetchProfileData = async () => {
  try {
    // TODO: this is hardcoded with the only profile in 
    // db for now - update to be flexible after user
    // register/login is complete
    const res = await fetch(`http://localhost:8080/profile/664e57bead1a759e11ade2e6`);
    if (!res.ok) {
      throw new Error('Failed to fetch profile data');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile data: ', error);
    return null;
  }
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const profileData = await fetchProfileData();
    setProfile(profileData);
    setLoading(false);
  };
  fetchData();

  return (
    <div className="container mx-auto px-4">
      {loading ? (
        <p>Loading profile...</p>   // wait until we fetch the profile
      ) : (
        <div className="flex flex-col">
          <ProfileDetails profile={profile}/>
          <div className="flex justify-end">
            <Link href={`profile/edit/${profile._id}`} className="bg-blue-500 text-white p-2 rounded">
              Edit Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
