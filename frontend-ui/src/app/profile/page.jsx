// src/app/profile/page.jsx
"use client"
import ProfileDetails from "@/components/profile/ProfileDetails";
import { useAtom } from "jotai";
import Link from "next/link";
import {  useEffect, useState } from "react";
import { profileIdAtom } from "../../../store";
import { TrashIcon } from '@heroicons/react/24/solid';

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

// TODO: update this function to create a delete confirmation dialog and handle accordingly
const handleDeleteProfile = async (id, resetId) => {
  console.log('Confirm deletion and handle it here...');
  try {
    const res = await fetch(`http://localhost:8080/profile/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Failed to delete profile with id: ${id}`);
    }
    const resData = await res.json();
    resetId('664e57bead1a759e11ade2e6');    // TODO: this is hardcoded for example (app functionality would delete the whole user and log you out)
    return resData;
  } catch (error) {
    console.error('Error deleting profile: ', error);
    return null;
  }
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useAtom(profileIdAtom);   // use shared profile id state

  useEffect(() => {
    const fetchData = async () => {
      const profileData = await fetchProfileData(profileId);
      setProfile(profileData);
      setLoading(false);
    };
    fetchData();
  }, [profileId]);

  return (
    // the height is calculated by the responsive viewport height minus the height of the navbar (80px)
    <div className="container mx-auto px-4 h-[calc(100vh-80px)]"> 
      {loading ? (
        <p>Loading profile...</p>   // wait until we fetch the profile
      ) : (
        <div className="flex flex-col h-full justify-between">
          <ProfileDetails profile={profile}/>
          <div className="flex justify-between gap-2 mb-2">
            <Link href={`profile/edit/${profile._id}`} className="bg-blue-500 text-white p-2 rounded">
              Edit Profile
            </Link>
            <button type="button" className="bg-red-500 text-white p-2 rounded" onClick={() => handleDeleteProfile(profile._id, setProfileId)}>
              <TrashIcon className="size-6"/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
