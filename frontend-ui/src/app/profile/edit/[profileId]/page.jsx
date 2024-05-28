// src/app/profile/page.jsx
"use client"
import AddEdit from "@/components/profile/AddEdit";
import { useEffect, useState } from "react";

// fetch profile
const fetchProfileData = async (id) => {
  try {
    const res = await fetch(`http://localhost:8080/profile/${id}`);
    if(!res.ok) {
      throw new Error('Failed to fetch profile data');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return null;
  }
};

const EditProfilePage = ( { params } ) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const profileData = await fetchProfileData(params.profileId);
      setProfile(profileData);
      setLoading(false);
    };
    fetchData();
  }, [params.profileId]);

  return (
    <div>
      {loading ? (
        <p>Loading edit page...</p>   // wait until we have fetched the profile
      ) : (
        <AddEdit profile={profile} /> // set the profile prop so the form knows to update
      )}
    </div>
  )
};

export default EditProfilePage;
