// src/app/profile/page.jsx
"use client"
import ProfileDetails from "@/components/profile/ProfileDetails";
import Link from "next/link";
import {  useEffect, useState } from "react";

const fetchProfileData = async (id) => {
  try {
    const res = await fetch(`http://localhost:8080/profile/${id}`);
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
  const [currentId, setCurrentId] = useState('664e57bead1a759e11ade2e6'); // use only profile in db for now by default

  useEffect(() => {
    const fetchData = async () => {
      const profileData = await fetchProfileData(currentId);
      setProfile(profileData);
      setLoading(false);
    };
    fetchData();
  }, [currentId]);

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
